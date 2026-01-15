// src/types/api.types.ts
import { SpecialistStatus } from './specialist.types';

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: ValidationError[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface QueryParams {
  page?: number;
  limit?: number;
  status?: SpecialistStatus;
  search?: string;
  sortBy?: 'created_at' | 'name' | 'updated_at';
  sortOrder?: 'ASC' | 'DESC';
}

export interface ValidationError {
  field: string;
  message: string;
}