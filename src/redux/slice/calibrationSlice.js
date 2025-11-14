import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllCalibrations,
  getCalibrationById,
  getCalibrationsByAsset,
  getCalibrationsByStatus,
  getCalibrationsByTechnician,
  createCalibration,
  updateCalibration,
  deleteCalibration
} from '../../services/calibrationService';

// Initial state
const initialState = {
  calibrations: [],
  currentCalibration: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    assetId: '',
    technicianId: ''
  }
};

// Async thunks
export const fetchCalibrations = createAsyncThunk(
  'calibration/fetchCalibrations',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAllCalibrations();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calibrations');
    }
  }
);

export const fetchCalibrationById = createAsyncThunk(
  'calibration/fetchCalibrationById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await getCalibrationById(id);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calibration');
    }
  }
);

export const fetchCalibrationsByAsset = createAsyncThunk(
  'calibration/fetchCalibrationsByAsset',
  async (assetId, { rejectWithValue }) => {
    try {
      const response = await getCalibrationsByAsset(assetId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calibrations by asset');
    }
  }
);

export const fetchCalibrationsByStatus = createAsyncThunk(
  'calibration/fetchCalibrationsByStatus',
  async (status, { rejectWithValue }) => {
    try {
      const response = await getCalibrationsByStatus(status);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calibrations by status');
    }
  }
);

export const fetchCalibrationsByTechnician = createAsyncThunk(
  'calibration/fetchCalibrationsByTechnician',
  async (technicianId, { rejectWithValue }) => {
    try {
      const response = await getCalibrationsByTechnician(technicianId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch calibrations by technician');
    }
  }
);

export const createCalibrationRecord = createAsyncThunk(
  'calibration/createCalibrationRecord',
  async (calibrationData, { rejectWithValue }) => {
    try {
      const response = await createCalibration(calibrationData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create calibration');
    }
  }
);

export const updateCalibrationRecord = createAsyncThunk(
  'calibration/updateCalibrationRecord',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await updateCalibration(id, data);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update calibration');
    }
  }
);

export const deleteCalibrationRecord = createAsyncThunk(
  'calibration/deleteCalibrationRecord',
  async (id, { rejectWithValue }) => {
    try {
      await deleteCalibration(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete calibration');
    }
  }
);

// Slice
const calibrationSlice = createSlice({
  name: 'calibration',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    setCurrentCalibration: (state, action) => {
      state.currentCalibration = action.payload;
    },
    clearCurrentCalibration: (state) => {
      state.currentCalibration = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all calibrations
      .addCase(fetchCalibrations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalibrations.fulfilled, (state, action) => {
        state.loading = false;
        state.calibrations = action.payload;
      })
      .addCase(fetchCalibrations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch calibration by ID
      .addCase(fetchCalibrationById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCalibrationById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCalibration = action.payload;
      })
      .addCase(fetchCalibrationById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create calibration
      .addCase(createCalibrationRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCalibrationRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.calibrations.push(action.payload);
      })
      .addCase(createCalibrationRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update calibration
      .addCase(updateCalibrationRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCalibrationRecord.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.calibrations.findIndex(cal => cal.id === action.payload.id);
        if (index !== -1) {
          state.calibrations[index] = action.payload;
        }
        if (state.currentCalibration?.id === action.payload.id) {
          state.currentCalibration = action.payload;
        }
      })
      .addCase(updateCalibrationRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete calibration
      .addCase(deleteCalibrationRecord.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCalibrationRecord.fulfilled, (state, action) => {
        state.loading = false;
        state.calibrations = state.calibrations.filter(cal => cal.id !== action.payload);
        if (state.currentCalibration?.id === action.payload) {
          state.currentCalibration = null;
        }
      })
      .addCase(deleteCalibrationRecord.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  clearError,
  setFilters,
  clearFilters,
  setCurrentCalibration,
  clearCurrentCalibration
} = calibrationSlice.actions;

export default calibrationSlice.reducer;