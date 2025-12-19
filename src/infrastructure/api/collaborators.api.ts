import type {
  ApiResponse,
  Collaborator,
  CreateCollaboratorDto,
  UpdateCollaboratorDto,
  CollaboratorFilters,
  CollaboratorSelect,
} from '@/src/core/entities';
import apiClient from './client';

export const collaboratorsApi = {
  async getAll(filters?: CollaboratorFilters): Promise<Collaborator[]> {
    const { data } = await apiClient.get<ApiResponse<Collaborator[]>>('/collaborators', {
      params: filters,
    });
    return data.data;
  },

  async getPaginated(filters?: CollaboratorFilters): Promise<{ data: Collaborator[]; meta: any }> {
    const { data } = await apiClient.get<ApiResponse<Collaborator[]>>('/collaborators/pagination', {
      params: filters,
    });
    return {
      data: data.data,
      meta: (data as any).meta, 
    };
  },

  async getForSelect(): Promise<CollaboratorSelect[]> {
    const { data } = await apiClient.get<ApiResponse<CollaboratorSelect[]>>('/collaborators/collabSelector');
    return data.data;
  },

  async getById(id: string): Promise<Collaborator> {
    const { data } = await apiClient.get<ApiResponse<Collaborator>>(`/collaborators/${id}`);
    return data.data;
  },

  async create(collaboratorData: CreateCollaboratorDto): Promise<Collaborator> {
    const { data } = await apiClient.post<ApiResponse<Collaborator>>('/collaborators', collaboratorData);
    return data.data;
  },

  async update(id: string, collaboratorData: UpdateCollaboratorDto): Promise<Collaborator> {
    const { data } = await apiClient.patch<ApiResponse<Collaborator>>(`/collaborators/${id}`, collaboratorData);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/collaborators/${id}`);
  },
};