// src/app/specialists/create/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch } from '@/store/hooks';
import { createSpecialist } from '@/store/slices/specialistSlice';
import { CreateSpecialistDto } from '@/types/specialist.types';
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
} from '@mui/material';
import {
  Close as CloseIcon,
  CloudUpload as UploadIcon,
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
  const [serviceForm, setServiceForm] = useState({
    service_name: '',
    description: '',
    estimated_days: 1,
    price: 0,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: keyof CreateSpecialistDto, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await dispatch(createSpecialist(formData)).unwrap();
      router.push('/specialists');
    } catch (error: any) {
      console.error(error);
    } finally {
      setLoading(false);
    }
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
              sx={{
                borderColor: '#1E40AF',
                color: '#1E40AF',
                textTransform: 'none',
                fontWeight: 600,
                px: 3,
                borderRadius: '8px',
              }}
            >
              Edit
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
              Publish
            </Button>
          </Box>
        </Box>

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
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '8px',
                  },
                }}
              />
            </Paper>

            {/* Additional Offerings */}
            <Paper sx={{ p: 4, mb: 3, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#0F172A' }}>
                Additional Offerings
              </Typography>
              <Typography variant="body2" sx={{ color: '#64748B', mb: 3 }}>
                Enhance your service by adding additional offerings
              </Typography>
            </Paper>

            {/* Company Secretary */}
            <Paper sx={{ p: 4, borderRadius: '12px' }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 3, color: '#0F172A' }}>
                Company Secretary
              </Typography>

              <Box sx={{ display: 'flex', gap: 3 }}>
                {/* Profile */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box
                    sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      bgcolor: '#E0E7FF',
                    }}
                  />
                  <Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        Grace Lam
                      </Typography>
                      <Chip
                        label="Owner"
                        size="small"
                        sx={{
                          bgcolor: '#1E293B',
                          color: 'white',
                          height: 20,
                          fontSize: '11px',
                        }}
                      />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#64748B', display: 'block' }}>
                      Corpsec Services Sdn Bhd
                    </Typography>
                    <Typography variant="caption" sx={{ color: '#64748B' }}>
                      SSM Owner • 8.0
                    </Typography>
                  </Box>
                </Box>

                {/* Certified Badge */}
                <Box sx={{ ml: 'auto' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
                    Certified Company Secretary
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Box sx={{ width: 40, height: 40, bgcolor: '#F1F5F9', borderRadius: '8px' }} />
                    <Box sx={{ width: 40, height: 40, bgcolor: '#F1F5F9', borderRadius: '8px' }} />
                    <Box sx={{ width: 40, height: 40, bgcolor: '#F1F5F9', borderRadius: '8px' }} />
                  </Box>
                </Box>
              </Box>

              <Typography variant="body2" sx={{ color: '#475569', mt: 3, lineHeight: 1.7 }}>
                A company secretarial service handled by Asim, who believes that every client is unique and 
                has their own business needs. Guided by his motto "Simplifying confidence journey, inspired 
                by the spirit of entrepreneurship," Asim treats every client's business as if it were his own.
              </Typography>
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
        onClose={() => setOpenServiceModal(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: '12px' },
        }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Edit Service
          </Typography>
          <IconButton onClick={() => setOpenServiceModal(false)}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label="Title"
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              sx={{ mb: 3 }}
              helperText="0/500 words"
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />

            <TextField
              fullWidth
              label="Estimated Completion Time (Days)"
              type="number"
              defaultValue={1}
              sx={{ mb: 3 }}
              InputProps={{
                sx: { borderRadius: '8px' },
              }}
            />

            <TextField
              fullWidth
              label="Price"
              type="number"
              defaultValue={0}
              InputProps={{
                sx: { borderRadius: '8px' },
                startAdornment: <Typography sx={{ mr: 1 }}>MYR</Typography>,
              }}
              sx={{ mb: 3 }}
            />

            <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
              Additional Offerings
            </Typography>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              {['Company Secretary Subscription', 'CTC Copies', 'eSignature'].map((item) => (
                <Chip
                  key={item}
                  label={item}
                  onDelete={() => {}}
                  sx={{
                    bgcolor: '#F1F5F9',
                    '& .MuiChip-deleteIcon': { color: '#64748B' },
                  }}
                />
              ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                onClick={() => setOpenServiceModal(false)}
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
                sx={{
                  textTransform: 'none',
                  bgcolor: '#1E40AF',
                  borderRadius: '8px',
                  '&:hover': { bgcolor: '#1E3A8A' },
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}