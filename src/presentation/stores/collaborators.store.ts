import { create } from 'zustand';
import type {
  Collaborator,
  CreateCollaboratorDto,
  UpdateCollaboratorDto,
  CollaboratorFilters,
  CollaboratorSelect,
  PaginationMeta,
} from '@/src/core/entities';
import { collaboratorsApi } from '@/src/infrastructure/api/collaborators.api';

interface CollaboratorsState {
  collaboratorsList: Collaborator[];
  collaboratorSelector: CollaboratorSelect[];
  selectedCollaborator: Collaborator | null;
  meta: PaginationMeta | null;
  isLoading: boolean;
  error: string | null;
  lastFetchTimestamp: number;

  // Actions
  fetchCollaborators: (filters?: CollaboratorFilters, force?: boolean) => Promise<void>;
  fetchCollaboratorSelector: () => Promise<void>;
  getCollaboratorById: (id: string) => Promise<Collaborator | null>; 
  createCollaborator: (data: CreateCollaboratorDto) => Promise<Collaborator | null>;
  updateCollaborator: (id: string, data: UpdateCollaboratorDto) => Promise<Collaborator | null>;
  deleteCollaborator: (id: string) => Promise<void>;
  setSelectedCollaborator: (collaborator: Collaborator | null) => void;
  clearError: () => void;
}

export const useCollaboratorsStore = create<CollaboratorsState>((set, get) => ({
  collaboratorsList: [],
  collaboratorSelector: [],
  selectedCollaborator: null,
  meta: null,
  isLoading: false,
  error: null,
  lastFetchTimestamp: 0,

  fetchCollaborators: async (filters?: CollaboratorFilters, force = false) => {
    const currentTimestamp = Date.now();
    const CACHE_DURATION = 5 * 60 * 1000;

    if (!force && get().collaboratorsList.length > 0 && (currentTimestamp - get().lastFetchTimestamp < CACHE_DURATION)) {
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const { data, meta } = await collaboratorsApi.getPaginated(filters);
      set({
        collaboratorsList: data,
        meta,
        isLoading: false,
        lastFetchTimestamp: currentTimestamp,
      });
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Error al cargar colaboradores' });
    }
  },

  fetchCollaboratorSelector: async () => {
    try {
      const data = await collaboratorsApi.getForSelect();
      set({ collaboratorSelector: data });
    } catch (error: any) {
      console.error('Error fetching selector:', error);
    }
  },

  getCollaboratorById: async (id: string) => {
    const existing = get().collaboratorsList.find(c => c.id === id);
    if (existing) {
      set({ selectedCollaborator: existing });
      return existing;
    }

    // Si no está en la lista, se la pide 
    set({ isLoading: true, error: null });
    try {
      const collaborator = await collaboratorsApi.getById(id);
      set({ selectedCollaborator: collaborator, isLoading: false });
      return collaborator;
    } catch (error: any) {
      set({
        isLoading: false,
        error: error.message || 'Error al obtener colaborador',
      });
      return null;
    }
  },

  createCollaborator: async (data: CreateCollaboratorDto) => {
    set({ isLoading: true, error: null });
    try {
      const newCollab = await collaboratorsApi.create(data);
      set((state) => ({
        collaboratorsList: [newCollab, ...state.collaboratorsList],
        isLoading: false,
      }));
      return newCollab;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Error al crear colaborador' });
      return null;
    }
  },

  updateCollaborator: async (id: string, data: UpdateCollaboratorDto) => {
    set({ isLoading: true, error: null });
    try {
      const updated = await collaboratorsApi.update(id, data);
      set((state) => ({
        collaboratorsList: state.collaboratorsList.map((c) => (c.id === id ? updated : c)),
        selectedCollaborator: state.selectedCollaborator?.id === id ? updated : state.selectedCollaborator,
        isLoading: false,
      }));
      return updated;
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Error al actualizar colaborador' });
      return null;
    }
  },

  deleteCollaborator: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await collaboratorsApi.delete(id);
      set((state) => ({
        collaboratorsList: state.collaboratorsList.filter((c) => c.id !== id),
        isLoading: false,
      }));
    } catch (error: any) {
      set({ isLoading: false, error: error.message || 'Error al eliminar colaborador' });
    }
  },

  setSelectedCollaborator: (collaborator) => set({ selectedCollaborator: collaborator }),
  clearError: () => set({ error: null }),
}));