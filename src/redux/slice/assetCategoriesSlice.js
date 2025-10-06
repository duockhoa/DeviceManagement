import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllAssetCategories,
    getAssetCategoryById,
    createAssetCategory,
    updateAssetCategory,
    deleteAssetCategory,
    getAssetsByCategory
} from '../../services/assetCategoriesService';

// Fetch tất cả asset categories
export const fetchAssetCategories = createAsyncThunk(
    'assetCategories/fetchAssetCategories', 
    async () => {
        const response = await getAllAssetCategories();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách loại thiết bị');
        }
    }
);

// Fetch asset category theo ID
export const fetchAssetCategoryById = createAsyncThunk(
    'assetCategories/fetchAssetCategoryById',
    async (id) => {
        const response = await getAssetCategoryById(id);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin loại thiết bị');
        }
    }
);

// Tạo asset category mới
export const createNewAssetCategory = createAsyncThunk(
    'assetCategories/createNewAssetCategory',
    async (categoryData) => {
        const response = await createAssetCategory(categoryData);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tạo loại thiết bị mới');
        }
    }
);

// Cập nhật asset category
export const updateExistingAssetCategory = createAsyncThunk(
    'assetCategories/updateExistingAssetCategory',
    async ({ id, data }) => {
        const response = await updateAssetCategory(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể cập nhật loại thiết bị');
        }
    }
);

// Xóa asset category
export const deleteExistingAssetCategory = createAsyncThunk(
    'assetCategories/deleteExistingAssetCategory',
    async (id) => {
        const response = await deleteAssetCategory(id);
        if (response) {
            return { id, ...response };
        } else {
            throw new Error('Không thể xóa loại thiết bị');
        }
    }
);

// Fetch assets thuộc category
export const fetchAssetsByCategory = createAsyncThunk(
    'assetCategories/fetchAssetsByCategory',
    async (categoryId) => {
        const response = await getAssetsByCategory(categoryId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị theo loại');
        }
    }
);

const assetCategoriesSlice = createSlice({
    name: 'assetCategories',
    initialState: {
        categories: [],
        currentCategory: null,
        categoryAssets: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentCategory: (state) => {
            state.currentCategory = null;
            state.categoryAssets = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        resetCategories: (state) => {
            state.categories = [];
            state.currentCategory = null;
            state.categoryAssets = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all asset categories
            .addCase(fetchAssetCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetCategories.fulfilled, (state, action) => {
                state.categories = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch asset category by ID
            .addCase(fetchAssetCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetCategoryById.fulfilled, (state, action) => {
                state.currentCategory = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Create new asset category
            .addCase(createNewAssetCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewAssetCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
                state.loading = false;
            })
            .addCase(createNewAssetCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Update asset category
            .addCase(updateExistingAssetCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingAssetCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(cat => cat.id === action.payload.id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
                if (state.currentCategory && state.currentCategory.id === action.payload.id) {
                    state.currentCategory = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateExistingAssetCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Delete asset category
            .addCase(deleteExistingAssetCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExistingAssetCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(cat => cat.id !== action.payload.id);
                if (state.currentCategory && state.currentCategory.id === action.payload.id) {
                    state.currentCategory = null;
                }
                state.loading = false;
            })
            .addCase(deleteExistingAssetCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch assets by category
            .addCase(fetchAssetsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsByCategory.fulfilled, (state, action) => {
                state.categoryAssets = action.payload.assets || [];
                state.loading = false;
            })
            .addCase(fetchAssetsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearCurrentCategory, clearError, resetCategories } = assetCategoriesSlice.actions;
export default assetCategoriesSlice.reducer;
