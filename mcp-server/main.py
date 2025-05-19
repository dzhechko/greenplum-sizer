import os
import logging
from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Literal, Optional
import math

# Настройка логирования
log_level = os.environ.get("LOG_LEVEL", "info").upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Создание приложения FastAPI
app = FastAPI(
    title="Greenplum Storage Calculator API",
    description="API для расчета параметров хранилища Greenplum",
    version="1.0.0",
)

# Настройка CORS
allowed_origins = os.environ.get("ALLOW_ORIGINS", "http://localhost,http://localhost:5173,http://localhost:5174")
origins = allowed_origins.split(",")
if "*" in origins:
    origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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

# Модели данных
class LoadLevel(str):
    pass

class InputParams(BaseModel):
    size_tb: float = Field(..., gt=0, description="Размер хранилища в ТБ (несжатые данные)")
    load_level: str = Field(..., description="Уровень нагрузки: низкая, средняя, высокая")

class OutputParams(BaseModel):
    host_type: str
    host_count: int
    segments_per_host: int
    total_vcpu: int
    total_segments: int
    disks_per_host_tb: float
    disk_type: str
    master_recommendation: str

# Основная логика расчета
def calculate_storage_params(params: InputParams) -> OutputParams:
    size_tb = params.size_tb
    load_level = params.load_level.lower()
    
    logger.info(f"Расчет для размера {size_tb} ТБ и уровня нагрузки {load_level}")
    
    # Базовые значения в зависимости от уровня нагрузки
    if load_level == "низкая":
        vcpu_per_segment = 1
        segments_per_host = 4
        host_type = "VM стандартная (8 vCPU, 32GB RAM)"
    elif load_level == "средняя":
        vcpu_per_segment = 2
        segments_per_host = 4
        host_type = "VM оптимизированная (16 vCPU, 64GB RAM)"
    elif load_level == "высокая":
        vcpu_per_segment = 4
        segments_per_host = 2
        host_type = "VM производительная (16 vCPU, 128GB RAM)"
    else:
        raise HTTPException(status_code=400, detail="Неверный уровень нагрузки")
    
    # Расчет количества хостов и других параметров
    tb_per_segment = 2.0  # ТБ на сегмент (предположение)
    segments_needed = max(1, int(size_tb / tb_per_segment))
    host_count = max(3, (segments_needed + segments_per_host - 1) // segments_per_host)
    total_segments = host_count * segments_per_host
    
    # Размер дисков на хост
    disks_per_host_tb = round(size_tb / host_count, 2)
    
    # Тип дисков в зависимости от нагрузки
    if load_level == "низкая":
        disk_type = "HDD"
    elif load_level == "средняя":
        disk_type = "SSD"
    else:
        disk_type = "NVMe SSD"
    
    # Рекомендации для мастера
    master_recommendation = f"VM мастера: {vcpu_per_segment * 2} vCPU, {8 * vcpu_per_segment}GB RAM"
    
    # Общее количество vCPU
    total_vcpu = host_count * segments_per_host * vcpu_per_segment
    
    return OutputParams(
        host_type=host_type,
        host_count=host_count,
        segments_per_host=segments_per_host,
        total_vcpu=total_vcpu,
        total_segments=total_segments,
        disks_per_host_tb=disks_per_host_tb,
        disk_type=disk_type,
        master_recommendation=master_recommendation
    )

# Маршруты API
@app.get("/")
def read_root():
    return {"message": "Greenplum Storage Calculator API"}

@app.post("/calculate", response_model=OutputParams)
def calculate_storage(params: InputParams):
    return calculate_storage_params(params)

# Для запуска через uvicorn
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
