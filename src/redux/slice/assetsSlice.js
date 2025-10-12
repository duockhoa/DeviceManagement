import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllAssets,
    getAssetById,
    createAsset as createAssetService,
    updateAsset,
    deleteAsset,
    getAssetsBySubCategory,     // Thêm mới
    getAssetsByCategory,        // Logic mới
    getAssetsByArea,
    getAssetsByDepartment,
    searchAssets,
    getAssetByCode
} from '../../services/assetsService';

// Fetch tất cả assets
export const fetchAssets = createAsyncThunk(
    'assets/fetchAssets', 
    async () => {
        const response = await getAllAssets();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị');
        }
    }
);

// Fetch asset theo ID
export const fetchAssetById = createAsyncThunk(
    'assets/fetchAssetById',
    async (id) => {
        const response = await getAssetById(id);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin thiết bị');
        }
    }
);

// Fetch asset theo code
export const fetchAssetByCode = createAsyncThunk(
    'assets/fetchAssetByCode',
    async (assetCode) => {
        const response = await getAssetByCode(assetCode);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin thiết bị theo mã');
        }
    }
);

// Fetch assets theo sub category (MỚI)
export const fetchAssetsBySubCategory = createAsyncThunk(
    'assets/fetchAssetsBySubCategory',
    async (subCategoryId) => {
        const response = await getAssetsBySubCategory(subCategoryId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị theo loại phụ');
        }
    }
);

// Fetch assets theo category (LOGIC MỚI - qua sub categories)
export const fetchAssetsByCategory = createAsyncThunk(
    'assets/fetchAssetsByCategory',
    async (categoryId) => {
        const response = await getAssetsByCategory(categoryId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị theo loại');
        }
    }
);

// Fetch assets theo area
export const fetchAssetsByArea = createAsyncThunk(
    'assets/fetchAssetsByArea',
    async (areaId) => {
        const response = await getAssetsByArea(areaId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị theo khu vực');
        }
    }
);

// Fetch assets theo department
export const fetchAssetsByDepartment = createAsyncThunk(
    'assets/fetchAssetsByDepartment',
    async (departmentName) => {
        const response = await getAssetsByDepartment(departmentName);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị theo phòng ban');
        }
    }
);

// Search assets
export const searchAssetsThunk = createAsyncThunk(
    'assets/searchAssets',
    async (searchParams) => {
        const response = await searchAssets(searchParams);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tìm kiếm thiết bị');
        }
    }
);

// Tạo asset mới
export const createAsset = createAsyncThunk(
    'assets/createAsset',
    async (assetData) => {
        const response = await createAssetService(assetData);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tạo thiết bị mới');
        }
    }
);

// Cập nhật asset
export const updateExistingAsset = createAsyncThunk(
    'assets/updateExistingAsset',
    async ({ id, data }) => {
        const response = await updateAsset(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể cập nhật thiết bị');
        }
    }
);

// Xóa asset
export const deleteExistingAsset = createAsyncThunk(
    'assets/deleteExistingAsset',
    async (id) => {
        const response = await deleteAsset(id);
        if (response) {
            return { id, ...response };
        } else {
            throw new Error('Không thể xóa thiết bị');
        }
    }
);

const assetsSlice = createSlice({
    name: 'assets',
    initialState: {
        assets: [],
        currentAsset: null,
        filteredAssets: [],        // Thêm để lưu kết quả filter/search
        searchResults: [],         // Thêm để lưu kết quả search
        loading: false,
        error: null,
        filters: {                 // Thêm để lưu trạng thái filter
            category_id: null,
            sub_category_id: null,
            area_id: null,
            department: null
        }
    },
    reducers: {
        clearCurrentAsset: (state) => {
            state.currentAsset = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        resetAssets: (state) => {
            state.assets = [];
            state.currentAsset = null;
            state.filteredAssets = [];
            state.searchResults = [];
        },
        clearFilteredAssets: (state) => {
            state.filteredAssets = [];
            state.searchResults = [];
        },
        setFilters: (state, action) => {
            state.filters = { ...state.filters, ...action.payload };
        },
        clearFilters: (state) => {
            state.filters = {
                category_id: null,
                sub_category_id: null,
                area_id: null,
                department: null
            };
            state.filteredAssets = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all assets
            .addCase(fetchAssets.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssets.fulfilled, (state, action) => {
                state.assets = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssets.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch asset by ID
            .addCase(fetchAssetById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetById.fulfilled, (state, action) => {
                state.currentAsset = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch asset by code
            .addCase(fetchAssetByCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetByCode.fulfilled, (state, action) => {
                state.currentAsset = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetByCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch assets by sub category (MỚI)
            .addCase(fetchAssetsBySubCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsBySubCategory.fulfilled, (state, action) => {
                state.filteredAssets = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetsBySubCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch assets by category (LOGIC MỚI)
            .addCase(fetchAssetsByCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsByCategory.fulfilled, (state, action) => {
                state.filteredAssets = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetsByCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch assets by area
            .addCase(fetchAssetsByArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsByArea.fulfilled, (state, action) => {
                state.filteredAssets = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetsByArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch assets by department
            .addCase(fetchAssetsByDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsByDepartment.fulfilled, (state, action) => {
                state.filteredAssets = action.payload;
                state.loading = false;
            })
            .addCase(fetchAssetsByDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Search assets
            .addCase(searchAssetsThunk.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(searchAssetsThunk.fulfilled, (state, action) => {
                state.searchResults = action.payload;
                state.loading = false;
            })
            .addCase(searchAssetsThunk.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Create new asset
            .addCase(createAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAsset.fulfilled, (state, action) => {
                state.assets.unshift(action.payload);
                state.loading = false;
            })
            .addCase(createAsset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Update asset
            .addCase(updateExistingAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingAsset.fulfilled, (state, action) => {
                const index = state.assets.findIndex(asset => asset.id === action.payload.id);
                if (index !== -1) {
                    state.assets[index] = action.payload;
                }
                if (state.currentAsset && state.currentAsset.id === action.payload.id) {
                    state.currentAsset = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateExistingAsset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Delete asset
            .addCase(deleteExistingAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExistingAsset.fulfilled, (state, action) => {
                state.assets = state.assets.filter(asset => asset.id !== action.payload.id);
                if (state.currentAsset && state.currentAsset.id === action.payload.id) {
                    state.currentAsset = null;
                }
                state.loading = false;
            })
            .addCase(deleteExistingAsset.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { 
    clearCurrentAsset, 
    clearError, 
    resetAssets, 
    clearFilteredAssets, 
    setFilters, 
    clearFilters 
} = assetsSlice.actions;
export default assetsSlice.reducer;
