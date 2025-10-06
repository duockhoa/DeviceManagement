import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllAssets,
    getAssetById,
    createNewAsset,
    updateAsset,
    deleteAsset
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

// Tạo asset mới
export const createAsset = createAsyncThunk(
    'assets/createAsset',
    async (assetData) => {
        const response = await createNewAsset(assetData);
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
        loading: false,
        error: null,
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
            
            // Create new asset
            .addCase(createAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createAsset.fulfilled, (state, action) => {
                state.assets.push(action.payload);
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

export const { clearCurrentAsset, clearError, resetAssets } = assetsSlice.actions;
export default assetsSlice.reducer;
