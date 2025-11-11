import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllAssetSubCategories,
    getAssetSubCategoryById,
    createAssetSubCategory,
    updateAssetSubCategory,
    deleteAssetSubCategory,
    getSubCategoriesByCategory
} from '../../services/assetSubCategoriesService';

// Fetch tất cả asset sub categories
export const fetchAssetSubCategories = createAsyncThunk(
    'assetSubCategories/fetchAssetSubCategories', 
    async (categoryId = null) => {
        const response = await getAllAssetSubCategories(categoryId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách loại thiết bị phụ');
        }
    }
);

// Fetch asset sub category theo ID
export const fetchAssetSubCategoryById = createAsyncThunk(
    'assetSubCategories/fetchAssetSubCategoryById',
    async (id) => {
        const response = await getAssetSubCategoryById(id);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin loại thiết bị phụ');
        }
    }
);

// Fetch sub categories theo category
export const fetchSubCategoriesByCategory = createAsyncThunk(
    'assetSubCategories/fetchSubCategoriesByCategory',
    async (categoryId) => {
        const response = await getSubCategoriesByCategory(categoryId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách loại thiết bị phụ theo loại');
        }
    }
);

// Tạo asset sub category mới
export const createNewAssetSubCategory = createAsyncThunk(
    'assetSubCategories/createNewAssetSubCategory',
    async (subCategoryData) => {
        const response = await createAssetSubCategory(subCategoryData);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tạo loại thiết bị phụ mới');
        }
    }
);

// Cập nhật asset sub category
export const updateExistingAssetSubCategory = createAsyncThunk(
    'assetSubCategories/updateExistingAssetSubCategory',
    async ({ id, data }) => {
        const response = await updateAssetSubCategory(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể cập nhật loại thiết bị phụ');
        }
    }
);

// Xóa asset sub category
export const deleteExistingAssetSubCategory = createAsyncThunk(
    'assetSubCategories/deleteExistingAssetSubCategory',
    async (id) => {
        const response = await deleteAssetSubCategory(id);
        if (response) {
            return { id, ...response };
        } else {
            throw new Error('Không thể xóa loại thiết bị phụ');
        }
    }
);

const assetSubCategoriesSlice = createSlice({
    name: 'assetSubCategories',
    initialState: {
        subCategories: [],
        currentSubCategory: null,
        filteredSubCategories: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentSubCategory: (state) => {
            state.currentSubCategory = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetSubCategories: (state) => {
            state.subCategories = [];
            state.currentSubCategory = null;
            state.filteredSubCategories = [];
        },
        clearFilteredSubCategories: (state) => {
            state.filteredSubCategories = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all asset sub categories
            .addCase(fetchAssetSubCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetSubCategories.fulfilled, (state, action) => {
                state.subCategories = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetSubCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch asset sub category by ID
            .addCase(fetchAssetSubCategoryById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetSubCategoryById.fulfilled, (state, action) => {
                state.currentSubCategory = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetSubCategoryById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch sub categories by category
            .addCase(fetchSubCategoriesByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubCategoriesByCategory.fulfilled, (state, action) => {
                state.filteredSubCategories = action.payload.subCategories || [];
                state.loading = false;
            })
            .addCase(fetchSubCategoriesByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Create new asset sub category
            .addCase(createNewAssetSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewAssetSubCategory.fulfilled, (state, action) => {
                state.subCategories.push(action.payload);
                state.loading = false;
            })
            .addCase(createNewAssetSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Update asset sub category
            .addCase(updateExistingAssetSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingAssetSubCategory.fulfilled, (state, action) => {
                const index = state.subCategories.findIndex(subCat => subCat.id === action.payload.id);
                if (index !== -1) {
                    state.subCategories[index] = action.payload;
                }
                if (state.currentSubCategory && state.currentSubCategory.id === action.payload.id) {
                    state.currentSubCategory = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateExistingAssetSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Delete asset sub category
            .addCase(deleteExistingAssetSubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExistingAssetSubCategory.fulfilled, (state, action) => {
                state.subCategories = state.subCategories.filter(subCat => subCat.id !== action.payload.id);
                if (state.currentSubCategory && state.currentSubCategory.id === action.payload.id) {
                    state.currentSubCategory = null;
                }
                state.loading = false;
            })
            .addCase(deleteExistingAssetSubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { 
    clearCurrentSubCategory, 
    clearError, 
    resetSubCategories, 
    clearFilteredSubCategories 
} = assetSubCategoriesSlice.actions;
export default assetSubCategoriesSlice.reducer;