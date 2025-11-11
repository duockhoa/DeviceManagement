import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllPlants,
    getPlantById,
    getPlantByCode,
    getAreasByPlant,
    createPlant,
    updatePlant,
    deletePlant
} from '../../services/plantService';

// Fetch tất cả plants
export const fetchPlants = createAsyncThunk(
    'plants/fetchPlants', 
    async () => {
        const response = await getAllPlants();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách nhà máy');
        }
    }
);

// Fetch plant theo ID
export const fetchPlantById = createAsyncThunk(
    'plants/fetchPlantById',
    async (id) => {
        const response = await getPlantById(id);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin nhà máy');
        }
    }
);

// Fetch plant theo code
export const fetchPlantByCode = createAsyncThunk(
    'plants/fetchPlantByCode',
    async (code) => {
        const response = await getPlantByCode(code);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin nhà máy');
        }
    }
);

// Fetch areas thuộc plant
export const fetchAreasByPlant = createAsyncThunk(
    'plants/fetchAreasByPlant',
    async (plantId) => {
        const response = await getAreasByPlant(plantId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách khu vực');
        }
    }
);

// Tạo plant mới
export const createNewPlant = createAsyncThunk(
    'plants/createNewPlant',
    async (plantData) => {
        const response = await createPlant(plantData);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tạo nhà máy mới');
        }
    }
);

// Cập nhật plant
export const updateExistingPlant = createAsyncThunk(
    'plants/updateExistingPlant',
    async ({ id, data }) => {
        const response = await updatePlant(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể cập nhật nhà máy');
        }
    }
);

// Xóa plant
export const deleteExistingPlant = createAsyncThunk(
    'plants/deleteExistingPlant',
    async (id) => {
        const response = await deletePlant(id);
        if (response) {
            return { id, ...response };
        } else {
            throw new Error('Không thể xóa nhà máy');
        }
    }
);

const plantSlice = createSlice({
    name: 'plants',
    initialState: {
        plants: [],
        currentPlant: null,
        plantAreas: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentPlant: (state) => {
            state.currentPlant = null;
            state.plantAreas = [];
        },
        clearError: (state) => {
            state.error = null;
        },
        setCurrentPlant: (state, action) => {
            state.currentPlant = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all plants
            .addCase(fetchPlants.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlants.fulfilled, (state, action) => {
                state.plants = action.payload;
                state.loading = false;
            })
            .addCase(fetchPlants.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch plant by ID
            .addCase(fetchPlantById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlantById.fulfilled, (state, action) => {
                state.currentPlant = action.payload;
                state.loading = false;
            })
            .addCase(fetchPlantById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch plant by code
            .addCase(fetchPlantByCode.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlantByCode.fulfilled, (state, action) => {
                state.currentPlant = action.payload;
                state.loading = false;
            })
            .addCase(fetchPlantByCode.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch areas by plant
            .addCase(fetchAreasByPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAreasByPlant.fulfilled, (state, action) => {
                state.plantAreas = action.payload;
                state.loading = false;
            })
            .addCase(fetchAreasByPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Create new plant
            .addCase(createNewPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createNewPlant.fulfilled, (state, action) => {
                state.plants.push(action.payload);
                state.loading = false;
            })
            .addCase(createNewPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Update plant
            .addCase(updateExistingPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateExistingPlant.fulfilled, (state, action) => {
                const index = state.plants.findIndex(plant => plant.id === action.payload.id);
                if (index !== -1) {
                    state.plants[index] = action.payload;
                }
                if (state.currentPlant?.id === action.payload.id) {
                    state.currentPlant = action.payload;
                }
                state.loading = false;
            })
            .addCase(updateExistingPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Delete plant
            .addCase(deleteExistingPlant.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteExistingPlant.fulfilled, (state, action) => {
                state.plants = state.plants.filter(plant => plant.id !== action.payload.id);
                if (state.currentPlant?.id === action.payload.id) {
                    state.currentPlant = null;
                    state.plantAreas = [];
                }
                state.loading = false;
            })
            .addCase(deleteExistingPlant.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearCurrentPlant, clearError, setCurrentPlant } = plantSlice.actions;
export default plantSlice.reducer;