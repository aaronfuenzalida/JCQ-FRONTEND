import type { 
  ApiResponse, 
  Budget, 
  CreateBudgetDto, 
  UpdateBudgetDto, 
  BudgetFilters 
} from '@/src/core/entities'; 
import apiClient from './client';

export const budgetsApi = {

  async getAll(filters?: BudgetFilters): Promise<Budget[]> {
    const { data } = await apiClient.get<ApiResponse<Budget[]>>('/budgets', { 
      params: filters 
    });
    return data.data;
  },

  async getById(id: string): Promise<Budget> {
    const { data } = await apiClient.get<ApiResponse<Budget>>(`/budgets/${id}`);
    return data.data;
  },

  async create(budgetData: CreateBudgetDto): Promise<Budget> {
    const { data } = await apiClient.post<ApiResponse<Budget>>('/budgets', budgetData);
    return data.data;
  },

  async update(id: string, budgetData: UpdateBudgetDto): Promise<Budget> {
    const { data } = await apiClient.patch<ApiResponse<Budget>>(`/budgets/${id}`, budgetData);
    return data.data;
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/budgets/${id}`);
  }
};