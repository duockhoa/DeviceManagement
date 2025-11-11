import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from '../../services/maintenanceService';

export const fetchMaintenances = createAsyncThunk('maintenance/fetchAll', async () => {
    const response = await maintenanceService.getAll();
    return response.data;
});

export const createNewMaintenance = createAsyncThunk('maintenance/create', async (data) => {
    const response = await maintenanceService.create(data);
    return response.data;
});

export const updateExistingMaintenance = createAsyncThunk('maintenance/update', async ({ id, data }) => {
    const response = await maintenanceService.update(id, data);
    return response.data;
});

export const deleteExistingMaintenance = createAsyncThunk('maintenance/delete', async (id) => {
    const response = await maintenanceService.delete(id);
    return { id, ...response.data };
});

export const updateMaintenanceStatus = createAsyncThunk('maintenance/updateStatus', async ({ id, status }) => {
    const response = await maintenanceService.updateMaintenanceStatus(id, status);
    return response.data;
});

const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: { items: [], loading: false, error: null, selectedItem: null },
    reducers: {
        setSelectedItem: (state, action) => { state.selectedItem = action.payload; },
        clearSelectedItem: (state) => { state.selectedItem = null; },
        clearError: (state) => { state.error = null; },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaintenances.pending, (state) => { state.loading = true; })
            .addCase(fetchMaintenances.fulfilled, (state, action) => {
                state.items = action.payload;
                state.loading = false;
            })
            .addCase(fetchMaintenances.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            .addCase(createNewMaintenance.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateExistingMaintenance.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            })
            .addCase(deleteExistingMaintenance.fulfilled, (state, action) => {
                state.items = state.items.filter(item => item.id !== action.payload.id);
            })
            .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) state.items[index] = action.payload;
            });
    }
});

export const { setSelectedItem, clearSelectedItem, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
