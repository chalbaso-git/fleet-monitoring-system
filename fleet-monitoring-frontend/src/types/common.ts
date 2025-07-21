// Base entity interface for all API entities
export interface BaseEntity {
  id: number;
  createdAt: string;
  updatedAt?: string;
}

// Common API response wrapper
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

// Pagination interface
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Common filter interface
export interface BaseFilters {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
}

// Error response interface
export interface ApiError {
  message: string;
  code: string;
  details?: any;
  timestamp: string;
}
