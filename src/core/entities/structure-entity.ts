export type StructureCategory = 'CATEGORY_A' | 'CATEGORY_B' | 'CATEGORY_C';

export interface Structure {
  id: string;
  name: string;
  category: StructureCategory; 
  stock: number;
  measure?: string;
  available: number; 
  inUse: number;      
  createdAt: string;
  updatedAt: string;
}

export interface CreateStructureDto {
  name: string;
  category: StructureCategory; 
  measure?: string;
  stock: number;
}

export interface UpdateStructureDto extends Partial<CreateStructureDto> {}

export interface StructureFilters {
  page?: number;
  limit?: number;
  name?: string;
  category?: string;
}