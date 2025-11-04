export interface ApiResponse<T> {
  success: boolean;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError {
  success: false;
  statusCode: number;
  code?: string;
  error?: string;
  message: string | string[];
  timestamp: string;
  path: string;
}

// Note: UserFilters, ClientFilters, ProjectFilters, and PaidFilters
// are now defined in their respective entity files
