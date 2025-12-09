export interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  dni?: string;
  cuit?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStaffDto {
  firstName: string;
  lastName: string;
  dni?: string;
  cuit?: string;
  category?: string;
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {}

export interface StaffFilters {
  page?: number;
  limit?: number;
  firstName?: string; // Nota: El backend espera firstName, no fullname
  dni?: string;
  cuit?: string;
}