// src/store/slices/specialistSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { specialistService } from '@/services/specialistService';
import {
  Specialist,
  SpecialistStatus,
  CreateSpecialistDto,
  UpdateSpecialistDto,
} from '@/types/specialist.types';
import { PaginationMeta, QueryParams } from '@/types/api.types';

interface SpecialistState {
  specialists: Specialist[];
  currentSpecialist: Specialist | null;
  meta: PaginationMeta | null;
  loading: boolean;
  error: string | null;
  filters: QueryParams;
}

const initialState: SpecialistState = {
  specialists: [],
  currentSpecialist: null,
  meta: null,
  loading: false,
  error: null,
  filters: {
    page: 1,
    limit: 10,
    status: undefined,
    search: '',
    sortBy: 'created_at',
    sortOrder: 'DESC',
  },
};

// Async thunks
export const fetchSpecialists = createAsyncThunk(
  'specialist/fetchAll',
  async (params: QueryParams, { rejectWithValue }) => {
    try {
      const response = await specialistService.getAll(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchSpecialistById = createAsyncThunk(
  'specialist/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await specialistService.getById(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const createSpecialist = createAsyncThunk(
  'specialist/create',
  async (dto: CreateSpecialistDto, { rejectWithValue }) => {
    try {
      const response = await specialistService.create(dto);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateSpecialist = createAsyncThunk(
  'specialist/update',
  async ({ id, dto }: { id: string; dto: UpdateSpecialistDto }, { rejectWithValue }) => {
    try {
      const response = await specialistService.update(id, dto);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const publishSpecialist = createAsyncThunk(
  'specialist/publish',
  async ({ id, status }: { id: string; status: SpecialistStatus }, { rejectWithValue }) => {
    try {
      const response = await specialistService.publish(id, status);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const deleteSpecialist = createAsyncThunk(
  'specialist/delete',
  async (id: string, { rejectWithValue }) => {
    try {
      await specialistService.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const specialistSlice = createSlice({
  name: 'specialist',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<Partial<QueryParams>>) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearCurrentSpecialist: (state) => {
      state.currentSpecialist = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all specialists
    builder
      .addCase(fetchSpecialists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialists.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = action.payload.data || [];
        state.meta = action.payload.meta || null;
      })
      .addCase(fetchSpecialists.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch specialist by ID
    builder
      .addCase(fetchSpecialistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpecialistById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSpecialist = action.payload.data || null;
      })
      .addCase(fetchSpecialistById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Create specialist
    builder
      .addCase(createSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists.unshift(action.payload.data!);
      })
      .addCase(createSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Update specialist
    builder
      .addCase(updateSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data!;
        state.specialists = state.specialists.map((s) =>
          s.id === updated.id ? updated : s
        );
        state.currentSpecialist = updated;
      })
      .addCase(updateSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Publish specialist
    builder
      .addCase(publishSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(publishSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload.data!;
        state.specialists = state.specialists.map((s) =>
          s.id === updated.id ? updated : s
        );
        state.currentSpecialist = updated;
      })
      .addCase(publishSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Delete specialist
    builder
      .addCase(deleteSpecialist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSpecialist.fulfilled, (state, action) => {
        state.loading = false;
        state.specialists = state.specialists.filter((s) => s.id !== action.payload);
      })
      .addCase(deleteSpecialist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentSpecialist, clearError } =
  specialistSlice.actions;

export default specialistSlice.reducer;