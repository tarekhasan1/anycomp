// src/types/specialist.types.ts
export enum SpecialistStatus {
  DRAFT = 'draft',
  PUBLISHED = 'published',
}

export interface Specialist {
  id: string;
  name: string;
  description?: string;
  status: SpecialistStatus;
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  logo_id?: string;
  logo?: Media;
  published_at?: string;
  created_at: string;
  updated_at: string;
  service_offerings?: ServiceOffering[];
  media?: Media[];
}

export interface ServiceOffering {
  id?: string;
  specialist_id?: string;
  service_name: string;
  service_type?: string;
  description?: string;
  platform_fee_id?: string;
  platform_fee?: PlatformFee;
  created_at?: string;
  updated_at?: string;
}

export interface PlatformFee {
  id: string;
  fee_name: string;
  fee_percentage?: number;
  fee_fixed_amount?: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Media {
  id: string;
  specialist_id?: string;
  file_name: string;
  file_url: string;
  file_type: string;
  file_size?: number;
  media_type: 'logo' | 'document' | 'image';
  uploaded_at: string;
}

export interface CreateSpecialistDto {
  name: string;
  description?: string;
  contact_email: string;
  contact_phone?: string;
  website_url?: string;
  logo_id?: string;
  service_offerings?: Omit<ServiceOffering, 'id' | 'specialist_id'>[];
}

export interface UpdateSpecialistDto extends Partial<CreateSpecialistDto> {
  status?: SpecialistStatus;
}

