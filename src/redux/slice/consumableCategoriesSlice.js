import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllConsumableCategories,
  getConsumableCategories,
  getComponentCategories,
  getActiveConsumableCategories,
  getConsumableCategoryById,
  createConsumableCategory,
  updateConsumableCategory,
  deleteConsumableCategory,
  getConsumableCategoriesWithFilters
} from '../../services/consumableCategoriesService';

// Initial State
const initialState = {
  // Data
  categories: [],
  consumables: [],
  components: [],
  activeCategories: [],
  filteredCategories: [],
  selectedCategory: null,
  
  // Loading states
  loading: false,
  loadingConsumables: false,
  loadingComponents: false,
  loadingActive: false,
  loadingById: false,
  loadingCreate: false,
  loadingUpdate: false,
  loadingDelete: false,
  loadingFilter: false,
  
  // Status
  error: null,
  success: false,
  successMessage: '',
  
  // Meta
  total: 0,
  currentFilters: {},
  
  // Stats
  stats: {
    totalCategories: 0,
    totalConsumables: 0,
    totalComponents: 0,
    activeCount: 0,
    inactiveCount: 0
  }
};

// Async Thunks
export const fetchAllConsumableCategories = createAsyncThunk(
  'consumableCategories/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const data = await getAllConsumableCategories(params);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchConsumableCategories = createAsyncThunk(
  'consumableCategories/fetchConsumables',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getConsumableCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchComponentCategories = createAsyncThunk(
  'consumableCategories/fetchComponents',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getComponentCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchActiveConsumableCategories = createAsyncThunk(
  'consumableCategories/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const data = await getActiveConsumableCategories();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchConsumableCategoryById = createAsyncThunk(
  'consumableCategories/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const data = await getConsumableCategoryById(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const createConsumableCategoryAsync = createAsyncThunk(
  'consumableCategories/create',
  async (categoryData, { rejectWithValue }) => {
    try {
      const data = await createConsumableCategory(categoryData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const updateConsumableCategoryAsync = createAsyncThunk(
  'consumableCategories/update',
  async ({ id, categoryData }, { rejectWithValue }) => {
    try {
      const data = await updateConsumableCategory(id, categoryData);
      return { id, data };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteConsumableCategoryAsync = createAsyncThunk(
  'consumableCategories/delete',
  async (id, { rejectWithValue }) => {
    try {
      await deleteConsumableCategory(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const filterConsumableCategories = createAsyncThunk(
  'consumableCategories/filter',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await getConsumableCategoriesWithFilters(filters);
      return { data, filters };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

// Helper function to calculate stats
const calculateStats = (categories) => ({
  totalCategories: categories.length,
  totalConsumables: categories.filter(cat => cat.type === 'consumable').length,
  totalComponents: categories.filter(cat => cat.type === 'component').length,
  activeCount: categories.filter(cat => cat.is_active).length,
  inactiveCount: categories.filter(cat => !cat.is_active).length
});

// Slice
const consumableCategoriesSlice = createSlice({
  name: 'consumableCategories',
  initialState,
  reducers: {
    // Synchronous actions
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = false;
      state.successMessage = '';
    },
    setCurrentFilters: (state, action) => {
      state.currentFilters = action.payload;
    },
    resetState: () => initialState
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Categories
      .addCase(fetchAllConsumableCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllConsumableCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
        state.total = action.payload.length;
        state.stats = calculateStats(action.payload);
        state.error = null;
      })
      .addCase(fetchAllConsumableCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Consumables
      .addCase(fetchConsumableCategories.pending, (state) => {
        state.loadingConsumables = true;
        state.error = null;
      })
      .addCase(fetchConsumableCategories.fulfilled, (state, action) => {
        state.loadingConsumables = false;
        state.consumables = action.payload;
        state.error = null;
      })
      .addCase(fetchConsumableCategories.rejected, (state, action) => {
        state.loadingConsumables = false;
        state.error = action.payload;
      })

      // Fetch Components
      .addCase(fetchComponentCategories.pending, (state) => {
        state.loadingComponents = true;
        state.error = null;
      })
      .addCase(fetchComponentCategories.fulfilled, (state, action) => {
        state.loadingComponents = false;
        state.components = action.payload;
        state.error = null;
      })
      .addCase(fetchComponentCategories.rejected, (state, action) => {
        state.loadingComponents = false;
        state.error = action.payload;
      })

      // Fetch Active
      .addCase(fetchActiveConsumableCategories.pending, (state) => {
        state.loadingActive = true;
        state.error = null;
      })
      .addCase(fetchActiveConsumableCategories.fulfilled, (state, action) => {
        state.loadingActive = false;
        state.activeCategories = action.payload;
        state.error = null;
      })
      .addCase(fetchActiveConsumableCategories.rejected, (state, action) => {
        state.loadingActive = false;
        state.error = action.payload;
      })

      // Fetch By ID
      .addCase(fetchConsumableCategoryById.pending, (state) => {
        state.loadingById = true;
        state.error = null;
      })
      .addCase(fetchConsumableCategoryById.fulfilled, (state, action) => {
        state.loadingById = false;
        state.selectedCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchConsumableCategoryById.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createConsumableCategoryAsync.pending, (state) => {
        state.loadingCreate = true;
        state.error = null;
        state.success = false;
      })
      .addCase(createConsumableCategoryAsync.fulfilled, (state, action) => {
        state.loadingCreate = false;
        state.categories.push(action.payload);
        state.stats = calculateStats(state.categories);
        state.success = true;
        state.successMessage = 'Danh mục đã được tạo thành công';
        state.error = null;
      })
      .addCase(createConsumableCategoryAsync.rejected, (state, action) => {
        state.loadingCreate = false;
        state.error = action.payload;
        state.success = false;
      })

      // Update
      .addCase(updateConsumableCategoryAsync.pending, (state) => {
        state.loadingUpdate = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateConsumableCategoryAsync.fulfilled, (state, action) => {
        state.loadingUpdate = false;
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload.data;
        }
        state.selectedCategory = action.payload.data;
        state.stats = calculateStats(state.categories);
        state.success = true;
        state.successMessage = 'Danh mục đã được cập nhật thành công';
        state.error = null;
      })
      .addCase(updateConsumableCategoryAsync.rejected, (state, action) => {
        state.loadingUpdate = false;
        state.error = action.payload;
        state.success = false;
      })

      // Delete
      .addCase(deleteConsumableCategoryAsync.pending, (state) => {
        state.loadingDelete = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteConsumableCategoryAsync.fulfilled, (state, action) => {
        state.loadingDelete = false;
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
        state.stats = calculateStats(state.categories);
        state.success = true;
        state.successMessage = 'Danh mục đã được xóa thành công';
        state.error = null;
      })
      .addCase(deleteConsumableCategoryAsync.rejected, (state, action) => {
        state.loadingDelete = false;
        state.error = action.payload;
        state.success = false;
      })

      // Filter
      .addCase(filterConsumableCategories.pending, (state) => {
        state.loadingFilter = true;
        state.error = null;
      })
      .addCase(filterConsumableCategories.fulfilled, (state, action) => {
        state.loadingFilter = false;
        state.filteredCategories = action.payload.data;
        state.currentFilters = action.payload.filters;
        state.error = null;
      })
      .addCase(filterConsumableCategories.rejected, (state, action) => {
        state.loadingFilter = false;
        state.error = action.payload;
      });
  }
});

// Export actions
export const {
  clearSelectedCategory,
  clearError,
  clearSuccess,
  setCurrentFilters,
  resetState
} = consumableCategoriesSlice.actions;

// Export reducer
export default consumableCategoriesSlice.reducer;