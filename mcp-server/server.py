import os
import logging
from fastmcp import FastMCP
from pydantic import BaseModel, Field
from typing import Literal, Optional
import math

# Setup logging
log_level = os.environ.get("LOG_LEVEL", "info").upper()
logging.basicConfig(
    level=getattr(logging, log_level),
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# Create FastMCP server
mcp = FastMCP(name="Greenplum Storage Calculator")

# Constants
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

# Data Models
class OutputParams(BaseModel):
    host_type: str
    host_count: int
    segments_per_host: int
    total_vcpu: int
    total_segments: int
    disks_per_host_tb: float
    disk_type: str
    master_recommendation: str

# Main calculation logic
@mcp.tool()
def calculate_storage(size_tb: float, load_level: str) -> OutputParams:
    """Calculate Greenplum storage parameters based on size and load level.
    
    Args:
        size_tb: Storage size in TB (uncompressed data)
        load_level: Load level (низкая, средняя, высокая)
    
    Returns:
        Storage configuration parameters
    """
    load_level = load_level.lower()
    
    logger.info(f"Calculating for size {size_tb} TB and load level {load_level}")
    
    # Base values depending on load level
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
        raise ValueError("Invalid load level. Must be: низкая, средняя, or высокая")
    
    # Calculate hosts and other parameters
    tb_per_segment = 2.0  # TB per segment (assumption)
    segments_needed = max(1, int(size_tb / tb_per_segment))
    host_count = max(3, (segments_needed + segments_per_host - 1) // segments_per_host)
    total_segments = host_count * segments_per_host
    
    # Disk size per host
    disks_per_host_tb = round(size_tb / host_count, 2)
    
    # Disk type based on load level
    if load_level == "низкая":
        disk_type = "HDD"
    elif load_level == "средняя":
        disk_type = "SSD"
    else:
        disk_type = "NVMe SSD"
    
    # Master recommendation
    master_recommendation = f"VM мастера: {vcpu_per_segment * 2} vCPU, {8 * vcpu_per_segment}GB RAM"
    
    # Total vCPU
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

# Run the server
if __name__ == "__main__":
    # Use streamable-http transport for web access
    mcp.run(transport="streamable-http", host="0.0.0.0", port=8000)