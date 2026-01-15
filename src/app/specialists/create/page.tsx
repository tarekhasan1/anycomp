// src/app/specialists/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createSpecialist } from '@/store/slices/specialistSlice';
import { CreateSpecialistDto, ServiceOffering } from '@/types/specialist.types';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from '@mui/icons-material';

export default function CreateSpecialistPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<CreateSpecialistDto>({
    name: '',
    description: '',
    contact_email: '',
    contact_phone: '',
    website_url: '',
    service_offerings: [],
  });

  const [openServiceModal, setOpenServiceModal] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [serviceForm, setServiceForm] = useState<Omit<ServiceOffering, 'id' | 'specialist_id'>>({
    service_name: '',
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CreateSpecialistDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Company name is required';
    if (!formData.contact_email.trim()) newErrors.contact_email = 'Email is required';
    if (!formData.contact_email.includes('@')) newErrors.contact_email = 'Invalid email format';
    if (formData.service_offerings?.length === 0) {
      newErrors.service_offerings = 'At least one service offering is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      await dispatch(createSpecialist(formData)).unwrap();
      router.push('/specialists');
    } catch (error: any) {
      setErrors({ submit: error.message || 'Failed to create specialist' });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenServiceModal = (index?: number) => {
    if (index !== undefined) {
      setEditingIndex(index);
      setServiceForm(formData.service_offerings![index]);
    } else {
      setEditingIndex(null);
      setServiceForm({ service_name: '', description: '' });
    }
    setOpenServiceModal(true);
  };

  const handleCloseServiceModal = () => {
    setOpenServiceModal(false);
    setEditingIndex(null);
    setServiceForm({ service_name: '', description: '' });
  };

  const handleAddService = () => {
    if (!serviceForm.service_name.trim()) {
      alert('Service name is required');
      return;
    }

    if (editingIndex !== null) {
      const updated = [...(formData.service_offerings || [])];
      updated[editingIndex] = serviceForm;
      setFormData((prev) => ({ ...prev, service_offerings: updated }));
    } else {
      setFormData((prev) => ({
        ...prev,
        service_offerings: [...(prev.service_offerings || []), serviceForm],
      }));
    }
    handleCloseServiceModal();
  };

  const handleDeleteService = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      service_offerings: prev.service_offerings?.filter((_, i) => i !== index) || [],
    }));
  };

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

      <Box sx={{ px: { xs: 2, sm: 2, md: 4 }, py: 3, flex: 1, overflow: 'auto' }}>
        {/* Title and Actions */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'flex-start', md: 'center' }, mb: 4, gap: 3 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A', fontSize: { xs: '1.25rem', md: '1.75rem' } }}>
            Register a new company | Private Limited - Sdn Bhd
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', md: 'auto' }, flexDirection: { xs: 'column-reverse', md: 'row' } }}>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.back()}
              sx={{
                borderColor: '#1E40AF',
                color: '#1E40AF',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: '8px',
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              fullWidth
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                bgcolor: '#1E40AF',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: '8px',
                '&:hover': { bgcolor: '#1E3A8A' },
              }}
            >
              {loading ? 'Publishing...' : 'Publish'}
            </Button>
          </Box>
        </Box>

        {errors.submit && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.submit}
          </Alert>
        )}
        {errors.service_offerings && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {errors.service_offerings}
          </Alert>
        )}

        <Grid container spacing={3}>
          {/* Left Column */}
          <Grid item xs={12} md={8}>
            {/* Image Upload Section */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: '12px' }}>
              <Box
                sx={{
                  border: '2px dashed #CBD5E1',
                  borderRadius: '12px',
                  p: 6,
                  textAlign: 'center',
                  bgcolor: '#F8FAFC',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#F1F5F9' },
                }}
              >
                <UploadIcon sx={{ fontSize: 48, color: '#94A3B8', mb: 2 }} />
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Upload an image for your service listing in PNG, JPG or JPEG
                </Typography>
                <Typography variant="caption" sx={{ color: '#94A3B8' }}>
                  up to 4MB
                </Typography>
              </Box>

              {/* Sample Images */}
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                <Box
                  sx={{
                    width: '48%',
                    height: 200,
                    borderRadius: '12px',
                    bgcolor: '#1E293B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '18px',
                  }}
                >
                  10 Best Company Secretarial in Johor Bahru
                </Box>
                <Box
                  sx={{
                    width: '48%',
                    height: 200,
                    borderRadius: '12px',
                    bgcolor: '#DC2626',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    p: 3,
                  }}
                >
                  <Typography variant="body2" sx={{ color: 'white' }}>
                    A Company Secretary Represents a Key Role in Any Business. This is Why
                  </Typography>
                </Box>
              </Box>
            </Paper>

            {/* Company Information */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                Company Information
              </Typography>
              
              <TextField
                fullWidth
                label="Company Name"
                placeholder="Enter company name..."
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="Enter email..."
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                error={!!errors.contact_email}
                helperText={errors.contact_email}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              <TextField
                fullWidth
                label="Phone Number"
                placeholder="Enter phone number..."
                value={formData.contact_phone || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, contact_phone: e.target.value }))}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />

              <TextField
                fullWidth
                label="Website URL"
                placeholder="https://example.com"
                value={formData.website_url || ''}
                onChange={(e) => setFormData((prev) => ({ ...prev, website_url: e.target.value }))}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              />
            </Paper>

            {/* Description */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0F172A' }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Describe your service here
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                placeholder="Enter description..."
                value={formData.description || ''}
                onChange={(e) => handleInputChange('description', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Paper>

            {/* Service Offerings */}
            <Paper sx={{ p: 4, borderRadius: '12px' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Service Offerings
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={() => handleOpenServiceModal()}
                  sx={{
                    bgcolor: '#1E40AF',
                    textTransform: 'none',
                    fontWeight: 600,
                    '&:hover': { bgcolor: '#1E3A8A' },
                  }}
                >
                  Add Service
                </Button>
              </Box>

              {formData.service_offerings && formData.service_offerings.length > 0 ? (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Service Name</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }}>Description</TableCell>
                        <TableCell sx={{ fontWeight: 600, color: '#475569' }} align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {formData.service_offerings.map((service, index) => (
                        <TableRow key={index}>
                          <TableCell>{service.service_name}</TableCell>
                          <TableCell sx={{ color: '#64748B' }}>{service.description || '-'}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenServiceModal(index)}
                              sx={{ color: '#1E40AF' }}
                            >
                              <EditIcon fontSize="small" />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleDeleteService(index)}
                              sx={{ color: '#EF4444' }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              ) : (
                <Typography variant="body2" sx={{ color: '#94A3B8', textAlign: 'center', py: 3 }}>
                  No services added yet. Click "Add Service" to get started.
                </Typography>
              )}
            </Paper>
          </Grid>

          {/* Right Column - Professional Fee */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 4, borderRadius: '12px', position: 'sticky', top: 20 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0F172A' }}>
                Professional Fee
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 4 }}>
                Set a rate for your service
              </Typography>

              <Typography variant="h3" sx={{ fontWeight: 700, color: '#0F172A', mb: 4 }}>
                RM 1,800
              </Typography>

              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Base price
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  RM 1,800
                </Typography>
              </Box>

              <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" sx={{ color: '#64748B' }}>
                  Service processing fee
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  RM 540
                </Typography>
              </Box>

              <Box
                sx={{
                  mb: 2,
                  pb: 2,
                  display: 'flex',
                  justifyContent: 'space-between',
                  borderBottom: '1px solid #E2E8F0',
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Total
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  RM 2,340
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 600, color: '#0F172A' }}>
                  Your returns
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#10B981' }}>
                  RM 1,800
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Service Modal */}
      <Dialog
        open={openServiceModal}
        onClose={handleCloseServiceModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingIndex !== null ? 'Edit Service' : 'Add Service'}
          </Typography>
          <IconButton onClick={handleCloseServiceModal}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Service Name"
              placeholder="Enter service name..."
              value={serviceForm.service_name}
              onChange={(e) => setServiceForm((prev) => ({ ...prev, service_name: e.target.value }))}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              placeholder="Enter service description..."
              value={serviceForm.description || ''}
              onChange={(e) => setServiceForm((prev) => ({ ...prev, description: e.target.value }))}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={handleCloseServiceModal}
                sx={{
                  textTransform: 'none',
                  borderColor: '#E2E8F0',
                  color: '#64748B',
                  borderRadius: '8px',
                }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                onClick={handleAddService}
                sx={{
                  textTransform: 'none',
                  bgcolor: '#1E40AF',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#1E3A8A' },
                }}
              >
                {editingIndex !== null ? 'Update' : 'Add'}
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}