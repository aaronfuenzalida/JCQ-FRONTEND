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

  async getById(id: string | number): Promise<Staff> {
    const { data } = await apiClient.get<ApiResponse<Staff>>(`/staff/${id}`);
    return data.data;
  },

  async create(staffData: CreateStaffDto): Promise<Staff> {
    const { data } = await apiClient.post<ApiResponse<Staff>>('/staff', staffData);
    return data.data;
  },

  async getWorkRecords(staffId: string | number): Promise<any[]> {
    const { data } = await apiClient.get(`/staff/${staffId}/work-records`);
    return Array.isArray(data) ? data : data.data || []; 
  },

  async createWorkRecord(recordData: any): Promise<any> {
  const { data } = await apiClient.post('/staff/work-record', recordData);
  return data.data;
},

  async update(id: string | number, staffData: UpdateStaffDto): Promise<Staff> {
    const { data } = await apiClient.patch<ApiResponse<Staff>>(`/staff/${id}`, staffData);
    return data.data;
  },

  async updateWorkRecord(id: string | number, recordData: any): Promise<any> {
    const { data } = await apiClient.patch(`/staff/work-record/${id}`, recordData);
    return data.data;
  },

  async delete(id: string | number): Promise<void> {
    await apiClient.delete(`/staff/${id}`);
  },
};