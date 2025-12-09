import type {
  ApiResponse, 
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilters,
} from '@/src/core/entities';
import apiClient from './client'; 

export const staffApi = {
  async getAll(filters?: StaffFilters): Promise<Staff[]> {
    const { data } = await apiClient.get<ApiResponse<Staff[]>>('/staff', { params: filters });
    return data.data; 
  },

  async getPaginated(filters?: StaffFilters): Promise<ApiResponse<Staff[]>> {
    const { data } = await apiClient.get<ApiResponse<Staff[]>>('/staff', {
      params: filters,
    });
    return data;
  },

  async getById(id: string): Promise<Staff> {
    const { data } = await apiClient.get<ApiResponse<Staff>>(`/staff/${id}`);
    return data.data;
  },

  async create(staffData: CreateStaffDto): Promise<Staff> {
    const { data } = await apiClient.post<ApiResponse<Staff>>('/staff', staffData);
    return data.data;
  },

  async update(id: string, staffData: UpdateStaffDto): Promise<Staff> {
    const { data } = await apiClient.patch<ApiResponse<Staff>>(`/staff/${id}`, staffData);
    return data.data;
  },

  async updateWorkRecord(id: string, recordData: any): Promise<any> {
    const { data } = await apiClient.patch(`/staff/work-record/${id}`, recordData);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/staff/${id}`);
  },
};