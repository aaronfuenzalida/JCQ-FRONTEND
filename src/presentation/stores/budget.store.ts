import { create } from 'zustand';
import type {
  Budget,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetFilters,
  PaginationMeta, 
} from '@/src/core/entities';
import { budgetsApi } from '@/src/infrastructure/api/budget.api';

interface BudgetsState {
  budgetsList: Budget[];
  selectedBudget: Budget | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTimestamp: number;

  // Actions
  fetchBudgets: (filters?: BudgetFilters, force?: boolean) => Promise<void>;
  getBudgetById: (id: string) => Promise<Budget | null>;
  createBudget: (data: CreateBudgetDto) => Promise<Budget | null>;
  updateBudget: (id: string, data: UpdateBudgetDto) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<void>;
  setSelectedBudget: (budget: Budget | null) => void;
  clearError: () => void;
}

export const useBudgetsStore = create<BudgetsState>((set, get) => ({
  budgetsList: [],
  selectedBudget: null,
  meta: null,
  isLoading: false,
  error: null,
  lastFetchTimestamp: 0,

  fetchBudgets: async (filters?: BudgetFilters, force = false) => {
    const currentTimestamp = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000; 

    if (
      !force &&
      get().budgetsList.length > 0 &&
      currentTimestamp - get().lastFetchTimestamp < CACHE_DURATION
    ) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const data = await budgetsApi.getAll(filters);
      set({
        budgetsList: data,
        isLoading: false,
        lastFetchTimestamp: currentTimestamp,
      });
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : String(error) || 'Error al cargar presupuestos',
      });
    }
  },

  getBudgetById: async (id: string) => {
    const existing = get().budgetsList.find(b => b.id === id);
    if (existing) {
      set({ selectedBudget: existing });
      return existing;
    }

    set({ isLoading: true, error: null });
    try {
      const budget = await budgetsApi.getById(id);
      set({ selectedBudget: budget, isLoading: false });
      return budget;
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  },

  createBudget: async (data: CreateBudgetDto) => {
    set({ isLoading: true, error: null });
    try {
      const newBudget = await budgetsApi.create(data);
      set((state) => ({
        budgetsList: [newBudget, ...state.budgetsList], 
        isLoading: false,
      }));
      return newBudget;
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : String(error) || 'Error al crear presupuesto',
      });
      return null; 
    }
  },

  updateBudget: async (id: string, data: UpdateBudgetDto) => {
    set({ isLoading: true, error: null });
    try {
      const updatedBudget = await budgetsApi.update(id, data);
      set((state) => ({
        budgetsList: state.budgetsList.map((b) => (b.id === id ? updatedBudget : b)),
        selectedBudget: state.selectedBudget?.id === id ? updatedBudget : state.selectedBudget,
        isLoading: false,
      }));
      return updatedBudget;
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : String(error) || 'Error al actualizar',
      });
      return null;
    }
  },

  deleteBudget: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await budgetsApi.delete(id);
      set((state) => ({
        budgetsList: state.budgetsList.filter((b) => b.id !== id),
        selectedBudget: state.selectedBudget?.id === id ? null : state.selectedBudget,
        isLoading: false,
      }));
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : String(error) || 'Error al eliminar',
      });
        //El error esta listo para usarse.. TO-DO Implementar este mismo error
    }
  },

  setSelectedBudget: (budget) => set({ selectedBudget: budget }),
  
  clearError: () => set({ error: null }),
}));