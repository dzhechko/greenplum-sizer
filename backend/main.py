from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Literal
import math
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Greenplum Storage Calculator API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Constants from the dictionary sheet
COMPRESSION_RATIO = 3.0
FILL_COEFFICIENT = 0.75

# Settings per load level
LOAD_CONFIG = {
    "низкая": {
        "vcpu_per_segment": 2,
        "segment_disk_tb": 1.2 * FILL_COEFFICIENT,
        "segments_per_host": 8,
        "disk_type": "non-replicated-ssd",
        "flavor": "s3-c8-m32, 300GB network-ssd",
    },
    "средняя": {
        "vcpu_per_segment": 12,
        "segment_disk_tb": 1.2 * FILL_COEFFICIENT,
        "segments_per_host": 4,
        "disk_type": "non-replicated-ssd",
        "flavor": "s3-c12-m38, 600GB network-ssd",
    },
    "высокая": {
        "vcpu_per_segment": 20,
        "segment_disk_tb": 2.0 * FILL_COEFFICIENT,
        "segments_per_host": 2,
        "disk_type": "local-ssd",
        "flavor": "i3-c16-m128, 900GB network-ssd",
    }
}

class InputParams(BaseModel):
    size_tb: float = Query(..., gt=0, description="Размер хранилища в ТБ (несжатые данные)")
    load_level: Literal["низкая", "средняя", "высокая"]

class OutputParams(BaseModel):
    host_type: str
    host_count: int
    segments_per_host: int
    total_vcpu: int
    total_segments: int
    disks_per_host_tb: float
    disk_type: str
    master_recommendation: str

@app.post("/calculate", response_model=OutputParams)
def calculate_storage(params: InputParams):
    config = LOAD_CONFIG[params.load_level]

    effective_storage = params.size_tb / COMPRESSION_RATIO
    segment_storage_tb = config["segment_disk_tb"]
    total_segments = math.ceil(effective_storage / segment_storage_tb)

    segments_per_host = config["segments_per_host"]
    host_count = math.ceil(total_segments / segments_per_host)
    total_vcpu = total_segments * config["vcpu_per_segment"]
    disks_per_host_tb = segments_per_host * segment_storage_tb

    return OutputParams(
        host_type="расчетный",  # Можно доработать логику, если есть фактические значения
        host_count=host_count,
        segments_per_host=segments_per_host,
        total_vcpu=total_vcpu,
        total_segments=total_segments,
        disks_per_host_tb=round(disks_per_host_tb, 2),
        disk_type=config["disk_type"],
        master_recommendation=config["flavor"]
    )

# Добавляем корневой эндпоинт с описанием
@app.get("/")
def root():
    return {"message": "Greenplum Storage Calculator API. Use POST /calculate with size_tb and load_level."}
