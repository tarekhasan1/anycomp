// src/services/specialistService.ts
import api from './api';
import {
  Specialist,
  CreateSpecialistDto,
  UpdateSpecialistDto,
  SpecialistStatus,
} from '../types/specialist.types';
import { ApiResponse, QueryParams } from '../types/api.types';

export const specialistService = {
  // Get all specialists (with filters)
  getAll: async (params: QueryParams): Promise<ApiResponse<Specialist[]>> => {
    const { data } = await api.get<ApiResponse<Specialist[]>>('/specialists', {
      params,
    });
    return data;
  },

  // Get public specialists (published only)
  getPublic: async (params: QueryParams): Promise<ApiResponse<Specialist[]>> => {
    const { data } = await api.get<ApiResponse<Specialist[]>>('/specialists/public', {
      params,
    });
    return data;
  },

  // Get specialist by ID
  getById: async (id: string): Promise<ApiResponse<Specialist>> => {
    const { data } = await api.get<ApiResponse<Specialist>>(`/specialists/${id}`);
    return data;
  },

  // Create specialist
  create: async (dto: CreateSpecialistDto): Promise<ApiResponse<Specialist>> => {
    const { data } = await api.post<ApiResponse<Specialist>>('/specialists', dto);
    return data;
  },

  // Update specialist
  update: async (id: string, dto: UpdateSpecialistDto): Promise<ApiResponse<Specialist>> => {
    const { data } = await api.put<ApiResponse<Specialist>>(`/specialists/${id}`, dto);
    return data;
  },

  // Publish/unpublish specialist
  publish: async (id: string, status: SpecialistStatus): Promise<ApiResponse<Specialist>> => {
    const { data } = await api.patch<ApiResponse<Specialist>>(
      `/specialists/${id}/publish`,
      { status }
    );
    return data;
  },

  // Delete specialist
  delete: async (id: string): Promise<ApiResponse> => {
    const { data } = await api.delete<ApiResponse>(`/specialists/${id}`);
    return data;
  },
};