// src/app/specialists/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialists, setFilters, deleteSpecialist } from '@/store/slices/specialistSlice';
import { SpecialistStatus } from '@/types/specialist.types';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Typography,
  Pagination,
  CircularProgress,
  Tabs,
  Tab,
  Menu,
  MenuItem,
  Button,
} from '@mui/material';
import {
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
  Add as AddIcon,
  FileDownload as ExportIcon,
} from '@mui/icons-material';
import { useDebounce } from '@/hooks/useDebounce';

export default function SpecialistsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { specialists, meta, loading, filters } = useAppSelector((state) => state.specialist);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 500);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedId, setSelectedId] = useState<string>('');
  const [specialistData, setSpecialistData] = useState<Record<string, { purchases: number; duration: number }>>({});

  useEffect(() => {
    dispatch(fetchSpecialists(filters));
  }, [dispatch, filters]);

  useEffect(() => {
    dispatch(setFilters({ search: debouncedSearch, page: 1 }));
  }, [debouncedSearch, dispatch]);

  // Initialize specialist data with mock values
  useEffect(() => {
    const data: Record<string, { purchases: number; duration: number }> = {};
    specialists.forEach((specialist) => {
      if (!specialistData[specialist.id]) {
        data[specialist.id] = {
          purchases: Math.floor(Math.random() * 1000),
          duration: Math.floor(Math.random() * 14) + 1,
        };
      }
    });
    setSpecialistData((prev) => ({ ...prev, ...data }));
  }, [specialists]);

  const handleStatusFilter = (status?: SpecialistStatus) => {
    dispatch(setFilters({ status, page: 1 }));
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    dispatch(setFilters({ page: value }));
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, id: string) => {
    setAnchorEl(event.currentTarget);
    setSelectedId(id);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedId('');
  };

  const handleEdit = () => {
    router.push(`/specialists/${selectedId}/edit`);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this specialist?')) {
      await dispatch(deleteSpecialist(selectedId));
      dispatch(fetchSpecialists(filters));
    }
    handleMenuClose();
  };

  const getStatusColor = (status: SpecialistStatus) => {
    return status === SpecialistStatus.PUBLISHED ? '#10B981' : '#94A3B8';
  };

  const getStatusBgColor = (status: SpecialistStatus) => {
    return status === SpecialistStatus.PUBLISHED ? '#D1FAE5' : '#F1F5F9';
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
        {/* Title Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, color: '#0F172A', mb: 1, fontSize: { xs: '1.5rem', md: '2rem' } }}>
            Specialists
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748B', fontSize: { xs: '0.875rem', md: '1rem' } }}>
            Create and publish your services for Client's & Companies
          </Typography>
        </Box>

        {/* Tabs and Actions Row */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', lg: 'row' }, justifyContent: 'space-between', alignItems: { xs: 'stretch', lg: 'center' }, mb: 4, gap: 3 }}>
          <Tabs
            value={filters.status || 'all'}
            onChange={(e, value) => handleStatusFilter(value === 'all' ? undefined : value)}
            sx={{
              order: { xs: 2, lg: 1 },
              '& .MuiTab-root': {
                textTransform: 'none',
                fontWeight: 600,
                fontSize: { xs: '0.85rem', md: '0.95rem' },
                color: '#64748B',
                minHeight: 48,
                px: { xs: 1.5, md: 2 },
                '&.Mui-selected': {
                  color: '#1E40AF',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#1E40AF',
                height: 3,
              },
            }}
          >
            <Tab label="All" value="all" />
            <Tab label="Drafts" value={SpecialistStatus.DRAFT} />
            <Tab label="Published" value={SpecialistStatus.PUBLISHED} />
          </Tabs>

          <Box sx={{ display: 'flex', gap: 2, width: { xs: '100%', lg: 'auto' }, order: { xs: 1, lg: 2 }, flexDirection: { xs: 'row', sm: 'row' } }}>
            <Button
              variant="contained"
              onClick={() => router.push('/specialists/create')}
              startIcon={<AddIcon />}
              sx={{
                bgcolor: '#1E40AF',
                '&:hover': { bgcolor: '#1E3A8A' },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 2.5,
              }}
            >
              Create
            </Button>
            <Button
              variant="contained"
              startIcon={<ExportIcon />}
              sx={{
                bgcolor: '#334155',
                '&:hover': { bgcolor: '#1E293B' },
                textTransform: 'none',
                fontWeight: 600,
                fontSize: '14px',
                px: 2.5,
              }}
            >
              Export
            </Button>
          </Box>
        </Box>

        {/* Search */}
        <Box sx={{ mb: 4, display: 'flex', width: '100%' }}>
          <TextField
            placeholder="Search Services"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            sx={{
              width: { xs: '100%', md: 350 },
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                bgcolor: 'white',
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#94A3B8' }} />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Table Container */}
        <Box sx={{ width: '100%', bgcolor: 'white', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 8 }}>
              <CircularProgress />
            </Box>
          ) : specialists.length === 0 ? (
            <Box sx={{ textAlign: 'center', p: { xs: 3, md: 8 }, minHeight: 300, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No specialists found
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {filters.search
                  ? 'Try adjusting your search terms'
                  : 'Get started by creating your first specialist'}
              </Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ width: '100%', overflowX: 'auto' }}>
                <Table sx={{ width: '100%', minWidth: { xs: 600, md: 'auto' } }}>
                  <TableHead>
                    <TableRow sx={{ bgcolor: '#F8FAFC' }}>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: { xs: '10px', md: '12px' }, textTransform: 'uppercase' }}>
                        SERVICE
                      </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: { xs: '10px', md: '12px' }, textTransform: 'uppercase', display: { xs: 'none', md: 'table-cell' } }}>
                      PRICE
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: { xs: '10px', md: '12px' }, textTransform: 'uppercase', display: { xs: 'none', lg: 'table-cell' } }}>
                      PURCHASES
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: { xs: '10px', md: '12px' }, textTransform: 'uppercase', display: { xs: 'none', lg: 'table-cell' } }}>
                      DURATION
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: { xs: '10px', md: '12px' }, textTransform: 'uppercase' }}>
                        APPROVAL STATUS
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }}>
                        PUBLISH STATUS
                      </TableCell>
                      <TableCell sx={{ fontWeight: 600, color: '#475569', fontSize: '12px', textTransform: 'uppercase' }} align="center">
                        ACTION
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {specialists.map((specialist) => (
                      <TableRow
                        key={specialist.id}
                        sx={{
                          '&:hover': { bgcolor: '#F8FAFC' },
                          borderBottom: '1px solid #F1F5F9',
                        }}
                      >
                        <TableCell sx={{ color: '#0F172A', fontWeight: 500 }}>
                          {specialist.name}
                        </TableCell>
                        <TableCell sx={{ color: '#475569' }}>RM 2,000</TableCell>
                        <TableCell sx={{ color: '#475569' }}>
                          {specialistData[specialist.id]?.purchases || 0}
                        </TableCell>
                        <TableCell sx={{ color: '#475569' }}>
                          {specialistData[specialist.id]?.duration || 0} Days
                        </TableCell>
                        <TableCell>
                          <Chip
                            label="Approved"
                            size="small"
                            sx={{
                              bgcolor: '#D1FAE5',
                              color: '#059669',
                              fontWeight: 600,
                              fontSize: '11px',
                              height: 24,
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={specialist.status === SpecialistStatus.PUBLISHED ? 'Published' : 'Not Published'}
                            size="small"
                            sx={{
                              bgcolor: getStatusBgColor(specialist.status),
                              color: getStatusColor(specialist.status),
                              fontWeight: 600,
                              fontSize: '11px',
                              height: 24,
                              borderRadius: '6px',
                            }}
                          />
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            onClick={(e) => handleMenuOpen(e, specialist.id)}
                            size="small"
                            sx={{ color: '#64748B' }}
                          >
                            <MoreVertIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>

              {/* Pagination */}
              {meta && meta.totalPages > 1 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 3, borderTop: '1px solid #F1F5F9' }}>
                  <Pagination
                    count={meta.totalPages}
                    page={meta.page}
                    onChange={handlePageChange}
                    sx={{
                      '& .MuiPaginationItem-root': {
                        color: '#64748B',
                        fontWeight: 600,
                      },
                      '& .Mui-selected': {
                        bgcolor: '#1E40AF !important',
                        color: '#fff',
                      },
                    }}
                  />
                </Box>
              )}
            </>
          )}
        </Box>

        {/* Action Menu */}
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
          <MenuItem onClick={handleEdit} sx={{ fontSize: '14px', py: 1.5 }}>
            Edit
          </MenuItem>
          <MenuItem onClick={handleDelete} sx={{ fontSize: '14px', py: 1.5, color: '#EF4444' }}>
            Delete
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}