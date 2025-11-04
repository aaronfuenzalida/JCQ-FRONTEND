import { create } from "zustand";
import type { DashboardData } from "@/src/core/entities";
import { getDashboard } from "@/src/infrastructure/api";

interface DashboardState {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  dashboardData: null,
  isLoading: false,
  error: null,

  fetchDashboard: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getDashboard();
      set({ dashboardData: data, isLoading: false });
    } catch (error: unknown) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Error al cargar datos del dashboard",
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
}));

