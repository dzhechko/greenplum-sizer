# Tasks
## To-Do
1. [ ] Examine existing backend code to understand the calculation logic
2. [ ] Select frontend framework (React, Vue, or Angular)
3. [ ] Define UI/UX requirements and create wireframes
4. [ ] Set up frontend project structure
5. [ ] Implement form components for user input
6. [ ] Create visualization components for output data
7. [ ] Implement API integration with backend
8. [ ] Add export/save functionality for configurations
9. [ ] Implement responsive design
10. [ ] Test application with sample data
## Backend API Details
- Input parameters:
  - size_tb: Float - Storage size in TB (uncompressed data)
  - load_level: String - Load level ("низкая", "средняя", "высокая")
- Output parameters:
  - host_type: String - Host type description
  - host_count: Integer - Number of hosts required
  - segments_per_host: Integer - Segments per host
  - total_vcpu: Integer - Total vCPUs required
  - total_segments: Integer - Total segments
  - disks_per_host_tb: Float - Disk size per host in TB
  - disk_type: String - Type of disk storage
  - master_recommendation: String - VM flavor recommendation
## Completed Tasks
1. [x] Examined existing backend code to understand the calculation logic
2. [x] Selected frontend framework (React with TypeScript)
3. [x] Set up frontend project structure
4. [x] Implemented form components for user input
5. [x] Created visualization components for output data
6. [x] Implemented API integration with backend
