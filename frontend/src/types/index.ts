export type LoadLevel = "низкая" | "средняя" | "высокая";

export interface InputParams {
  size_tb: number;
  load_level: LoadLevel;
}

export interface OutputParams {
  host_type: string;
  host_count: number;
  segments_per_host: number;
  total_vcpu: number;
  total_segments: number;
  disks_per_host_tb: number;
  disk_type: string;
  master_recommendation: string;
}
