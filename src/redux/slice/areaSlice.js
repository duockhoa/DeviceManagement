import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllAreas,
    getAreaById,
    getAreasByPlant,
    getAssetsByArea,  // Thay đổi từ getPositionsByArea
    createArea,
    updateArea,
    deleteArea
} from '../../services/areasService';

// Fetch tất cả areas
export const fetchAreas = createAsyncThunk(
    'areas/fetchAreas',
    async () => {
        const response = await getAllAreas();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách khu vực');
        }
    }
);

// Fetch area theo ID
export const fetchAreaById = createAsyncThunk(
    'areas/fetchAreaById',
    async (id) => {
        const response = await getAreaById(id);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin khu vực');
        }
    }
);

// Fetch areas theo plant
export const fetchAreasByPlant = createAsyncThunk(
    'areas/fetchAreasByPlant',
    async (plantId) => {
        const response = await getAreasByPlant(plantId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách khu vực theo nhà máy');
        }
    }
);

// Fetch assets thuộc area (thay thế positions)
export const fetchAssetsByArea = createAsyncThunk(
    'areas/fetchAssetsByArea',
    async (areaId) => {
        const response = await getAssetsByArea(areaId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị');
        }
    }
);

// Tạo area mới
export const createNewArea = createAsyncThunk(
    'areas/createNewArea',
    async (areaData) => {
        const response = await createArea(areaData);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tạo khu vực mới');
        }
    }
);

// Cập nhật area
export const updateExistingArea = createAsyncThunk(
    'areas/updateExistingArea',
    async ({ id, data }) => {
        const response = await updateArea(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể cập nhật khu vực');
        }
    }
);

// Xóa area
export const deleteExistingArea = createAsyncThunk(
    'areas/deleteExistingArea',
    async (id) => {
        const response = await deleteArea(id);
        if (response) {
            return { id, ...response };
        } else {
            throw new Error('Không thể xóa khu vực');
        }
    }
);

const areaSlice = createSlice({
    name: 'areas',
    initialState: {
        areas: [],
        currentArea: null,
        areasByPlant: [],
        areaAssets: [],  // Thay đổi từ areaPositions sang areaAssets
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentArea: (state) => {
            state.currentArea = null;
            state.areaAssets = [];  // Thay đổi từ areaPositions
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentArea: (state, action) => {
            state.currentArea = action.payload;
        },
        clearAreasByPlant: (state) => {
            state.areasByPlant = [];
        },
        clearAreaAssets: (state) => {  // Thêm action mới
            state.areaAssets = [];
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all areas
            .addCase(fetchAreas.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreas.fulfilled, (state, action) => {
                state.areas = action.payload;
                state.loading = false;
            })
            .addCase(fetchAreas.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch area by ID
            .addCase(fetchAreaById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreaById.fulfilled, (state, action) => {
                state.currentArea = action.payload;
                state.loading = false;
            })
            .addCase(fetchAreaById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch areas by plant
            .addCase(fetchAreasByPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreasByPlant.fulfilled, (state, action) => {
                state.areasByPlant = action.payload;
                state.loading = false;
            })
            .addCase(fetchAreasByPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Fetch assets by area (thay thế positions)
            .addCase(fetchAssetsByArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsByArea.fulfilled, (state, action) => {
                state.areaAssets = action.payload.assets || action.payload;  // Handle different response formats
                state.loading = false;
            })
            .addCase(fetchAssetsByArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Create new area
            .addCase(createNewArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewArea.fulfilled, (state, action) => {
                state.areas.push(action.payload);
                state.loading = false;
            })
            .addCase(createNewArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update area
            .addCase(updateExistingArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingArea.fulfilled, (state, action) => {
                const index = state.areas.findIndex(area => area.id === action.payload.id);
                if (index !== -1) {
                    state.areas[index] = action.payload;
                }
                if (state.currentArea?.id === action.payload.id) {
                    state.currentArea = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateExistingArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete area
            .addCase(deleteExistingArea.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExistingArea.fulfilled, (state, action) => {
                state.areas = state.areas.filter(area => area.id !== action.payload.id);
                state.areasByPlant = state.areasByPlant.filter(area => area.id !== action.payload.id);
                if (state.currentArea?.id === action.payload.id) {
                    state.currentArea = null;
                    state.areaAssets = [];  // Thay đổi từ areaPositions
                }
                state.loading = false;
            })
            .addCase(deleteExistingArea.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const {
    clearCurrentArea,
    clearError,
    setCurrentArea,
    clearAreasByPlant,
    clearAreaAssets  // Thêm action mới
} = areaSlice.actions;

export default areaSlice.reducer;