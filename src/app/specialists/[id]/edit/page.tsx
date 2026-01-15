// src/app/specialists/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchSpecialistById,
  updateSpecialist,
  publishSpecialist,
  clearCurrentSpecialist,
} from '@/store/slices/specialistSlice';
import { UpdateSpecialistDto, ServiceOffering, SpecialistStatus } from '@/types/specialist.types';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Divider,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Publish as PublishIcon,
  Unpublished as UnpublishedIcon,
} from '@mui/icons-material';

export default function EditSpecialistPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();
  const { currentSpecialist, loading } = useAppSelector((state) => state.specialist);

  const [formData, setFormData] = useState<UpdateSpecialistDto>({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    service_offerings: [],
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [publishLoading, setPublishLoading] = useState(false);

  useEffect(() => {
    if (params.id) {
      dispatch(fetchSpecialistById(params.id as string));
    }

    return () => {
      dispatch(clearCurrentSpecialist());
    };
  }, [params.id, dispatch]);

  useEffect(() => {
    if (currentSpecialist) {
      setFormData({
        name: currentSpecialist.name,
        description: currentSpecialist.description || '',
        contact_email: currentSpecialist.contact_email,
        contact_phone: currentSpecialist.contact_phone || '',
        website_url: currentSpecialist.website_url || '',
        service_offerings: currentSpecialist.service_offerings || [],
      });
    }
  }, [currentSpecialist]);

  const handleInputChange = (field: keyof UpdateSpecialistDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceChange = (index: number, field: keyof ServiceOffering, value: string) => {
    const updatedServices = [...(formData.service_offerings || [])];
    updatedServices[index] = { ...updatedServices[index], [field]: value };
    setFormData((prev) => ({ ...prev, service_offerings: updatedServices }));
  };

  const addService = () => {
    setFormData((prev) => ({
      ...prev,
      service_offerings: [
        ...(prev.service_offerings || []),
        { service_name: '', service_type: '', description: '' },
      ],
    }));
  };

  const removeService = (index: number) => {
    const updatedServices = formData.service_offerings?.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, service_offerings: updatedServices }));
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.contact_email?.trim()) {
      newErrors.contact_email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact_email)) {
      newErrors.contact_email = 'Invalid email format';
    }

    if (formData.website_url && !/^https?:\/\/.+/.test(formData.website_url)) {
      newErrors.website_url = 'Invalid URL format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setSubmitError('');

    if (!validate()) {
      return;
    }

    setSubmitLoading(true);

    try {
      await dispatch(
        updateSpecialist({
          id: params.id as string,
          dto: formData,
        })
      ).unwrap();

      router.push('/specialists');
    } catch (error: any) {
      setSubmitError(error || 'Failed to update specialist');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handlePublishToggle = async () => {
    if (!currentSpecialist) return;

    const newStatus =
      currentSpecialist.status === SpecialistStatus.PUBLISHED
        ? SpecialistStatus.DRAFT
        : SpecialistStatus.PUBLISHED;

    setPublishLoading(true);

    try {
      await dispatch(
        publishSpecialist({
          id: currentSpecialist.id,
          status: newStatus,
        })
      ).unwrap();
    } catch (error: any) {
      setSubmitError(error || 'Failed to update status');
    } finally {
      setPublishLoading(false);
    }
  };

  if (loading && !currentSpecialist) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress sx={{ color: '#222222' }} />
      </Box>
    );
  }

  if (!loading && !currentSpecialist) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Specialist not found
        </Typography>
        <Button onClick={() => router.push('/specialists')} sx={{ mt: 2 }}>
          Back to List
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#F8FAFC', width: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ bgcolor: 'white', borderBottom: '1px solid #E2E8F0', px: { xs: 2, sm: 3, md: 4 }, py: 2 }}>
        <Typography variant="caption" sx={{ color: '#64748B', display: 'block', mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 700, color: '#1E293B', fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
          Services
        </Typography>
      </Box>

      {/* Content Area */}
      <Box sx={{ px: { xs: 2, sm: 2, md: 4 }, py: 3, flex: 1, overflow: 'auto' }}>
        {/* Top Section with Back Button and Publish Toggle */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4, gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <IconButton onClick={() => router.back()} sx={{ color: '#222222' }}>
              <ArrowBackIcon />
            </IconButton>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: '#222222', fontSize: { xs: '1.5rem', md: '2rem' } }}>
                Edit Specialist
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mt: 1 }}>
                <Chip
                  label={currentSpecialist?.status || 'Loading...'}
                  color={currentSpecialist?.status === SpecialistStatus.PUBLISHED ? 'success' : 'default'}
                  size="small"
                  sx={{ textTransform: 'capitalize', fontWeight: 600 }}
                />
                {currentSpecialist?.published_at && (
                  <Typography variant="caption" color="text.secondary">
                    Published: {new Date(currentSpecialist.published_at).toLocaleDateString()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>

          {/* Publish Toggle Button */}
          <Button
            variant={currentSpecialist?.status === SpecialistStatus.PUBLISHED ? 'outlined' : 'contained'}
            startIcon={
              currentSpecialist?.status === SpecialistStatus.PUBLISHED ? (
                <UnpublishedIcon />
              ) : (
                <PublishIcon />
              )
            }
            onClick={handlePublishToggle}
            disabled={publishLoading}
            sx={{
              bgcolor: currentSpecialist?.status === SpecialistStatus.PUBLISHED ? 'transparent' : '#222222',
              color: currentSpecialist?.status === SpecialistStatus.PUBLISHED ? '#222222' : '#fff',
              borderColor: '#222222',
              '&:hover': {
                bgcolor: currentSpecialist?.status === SpecialistStatus.PUBLISHED ? 'rgba(34,34,34,0.04)' : '#444444',
              },
              textTransform: 'none',
              px: 3,
              whiteSpace: 'nowrap',
            }}
          >
            {publishLoading
              ? 'Processing...'
              : currentSpecialist?.status === SpecialistStatus.PUBLISHED
              ? 'Unpublish'
              : 'Publish'}
          </Button>
        </Box>

        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        {/* Main Form Paper */}
        <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: '12px' }}>
          {/* Basic Information */}
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600, color: '#222222' }}>
            Basic Information
          </Typography>

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr', gap: 3, mb: 4 }}>
            <TextField
              fullWidth
              label="Specialist Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              required
            />

            <TextField
              fullWidth
              label="Description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              multiline
              rows={4}
            />

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
              <TextField
                fullWidth
                label="Contact Email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                error={!!errors.contact_email}
                helperText={errors.contact_email}
                required
              />

              <TextField
                fullWidth
                label="Contact Phone"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
              />
            </Box>

            <TextField
              fullWidth
              label="Website URL"
              value={formData.website_url}
              onChange={(e) => handleInputChange('website_url', e.target.value)}
              error={!!errors.website_url}
              helperText={errors.website_url}
              placeholder="https://example.com"
            />
          </Box>

          <Divider sx={{ my: 4 }} />

          {/* Service Offerings */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#222222' }}>
              Service Offerings
            </Typography>
            <Button
              startIcon={<AddIcon />}
              onClick={addService}
              sx={{ color: '#222222', textTransform: 'none', fontWeight: 600 }}
            >
              Add Service
            </Button>
          </Box>

          {formData.service_offerings?.map((service, index) => (
            <Paper key={index} variant="outlined" sx={{ p: 3, mb: 2, bgcolor: '#fafafa', position: 'relative' }}>
              <IconButton
                onClick={() => removeService(index)}
                sx={{ position: 'absolute', top: 8, right: 8, color: '#d32f2f' }}
                size="small"
              >
                <DeleteIcon />
              </IconButton>

              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={service.service_name}
                  onChange={(e) => handleServiceChange(index, 'service_name', e.target.value)}
                  size="small"
                  required
                />
                <TextField
                  fullWidth
                  label="Service Type"
                  value={service.service_type || ''}
                  onChange={(e) => handleServiceChange(index, 'service_type', e.target.value)}
                  size="small"
                />
              </Box>
              <TextField
                fullWidth
                label="Description"
                value={service.description || ''}
                onChange={(e) => handleServiceChange(index, 'description', e.target.value)}
                multiline
                rows={2}
                size="small"
                sx={{ mt: 2 }}
              />
            </Paper>
          ))}

          {(!formData.service_offerings || formData.service_offerings.length === 0) && (
            <Box sx={{ textAlign: 'center', py: 4, color: '#999' }}>
              <Typography>No services added yet. Click "Add Service" to begin.</Typography>
            </Box>
          )}

          <Divider sx={{ my: 4 }} />

          {/* Actions */}
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              variant="outlined"
              onClick={() => router.back()}
              disabled={submitLoading}
              sx={{ borderColor: '#222222', color: '#222222', textTransform: 'none', px: 4 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={submitLoading}
              sx={{ bgcolor: '#222222', '&:hover': { bgcolor: '#444444' }, textTransform: 'none', px: 4 }}
            >
              {submitLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
