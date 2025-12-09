import { create } from 'zustand';
import type {
  Staff,
  CreateStaffDto,
  UpdateStaffDto,
  StaffFilters,
  PaginationMeta,
} from '@/src/core/entities';
import { staffApi } from '@/src/infrastructure/api/staff.api'; 

interface StaffState {
  staffList: Staff[];
  selectedStaff: Staff | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTimestamp: number;

  // Actions
  fetchStaff: (filters?: StaffFilters) => Promise<void>;
  createStaff: (data: CreateStaffDto) => Promise<Staff>;
  updateStaff: (id: string, data: UpdateStaffDto) => Promise<Staff>;
  deleteStaff: (id: string) => Promise<void>;
  setSelectedStaff: (staff: Staff | null) => void;
  clearError: () => void;
}

export const useStaffStore = create<StaffState>((set, get) => ({
  staffList: [],
  selectedStaff: null,
  meta: null,
  isLoading: false,
  error: null,
  lastFetchTimestamp: 0,

  fetchStaff: async (filters?: StaffFilters) => {
    const currentTimestamp = Date.now();
    
    // Prevent race condition (igual que en clientes)
    if (get().isLoading && currentTimestamp - get().lastFetchTimestamp < 1000) {
      return;
    }

    set({ isLoading: true, error: null, lastFetchTimestamp: currentTimestamp });

    try {
      // Usamos el método getAll o getPaginated según corresponda
      // Como tu backend actual devuelve un array en /api/staff:
      const staffData = await staffApi.getAll(filters);
      
      if (currentTimestamp >= get().lastFetchTimestamp) {
        set({
          staffList: staffData,
          // Si tu backend no devuelve meta aún, lo dejamos null o lo simulamos
          meta: null, 
          isLoading: false,
        });
      }
    } catch (error: unknown) {
      if (currentTimestamp >= get().lastFetchTimestamp) {
        set({
          isLoading: false,
          error: error instanceof Error ? error.message : String(error) || 'Error al cargar personal',
        });
      }
    }
  },

  createStaff: async (data: CreateStaffDto) => {
    set({ isLoading: true, error: null });

    try {
      const newStaff = await staffApi.create(data);
      
      // Actualizamos la lista localmente para que se vea rápido
      set((state) => ({
        staffList: [newStaff, ...state.staffList],
        isLoading: false,
      }));

      return newStaff;
    } catch (error: unknown) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : String(error) || 'Error al crear personal',
      });
      throw error;
    }
  },

  // Implementamos update y delete igual que en clientes...
  updateStaff: async (id: string, data: UpdateStaffDto) => {
     // ... (Lógica similar a updateClient)
     return {} as Staff; // Placeholder si no tienes el endpoint listo
  },

  deleteStaff: async (id: string) => {
    // ... (Lógica similar a deleteClient)
  },

  setSelectedStaff: (staff: Staff | null) => set({ selectedStaff: staff }),
  clearError: () => set({ error: null }),
}));