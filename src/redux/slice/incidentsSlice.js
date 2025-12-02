import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import incidentsService from '../../services/incidentsService';

export const fetchIncidents = createAsyncThunk('incidents/fetchAll', async (_, { rejectWithValue }) => {
    try {
        return await incidentsService.getAllIncidents();
    } catch (error) {
        return rejectWithValue(error);
    }
});

export const fetchIncidentById = createAsyncThunk('incidents/fetchById', async (id, { rejectWithValue }) => {
    try {
        return await incidentsService.getIncidentById(id);
    } catch (error) {
        return rejectWithValue(error);
    }
});

const incidentsSlice = createSlice({
    name: 'incidents',
    initialState: {
        incidents: [],
        currentIncident: null,
        loading: false,
        error: null
    },
    reducers: {
        clearIncidentError: (state) => { state.error = null; }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchIncidents.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncidents.fulfilled, (state, action) => {
                state.loading = false;
                state.incidents = action.payload || [];
            })
            .addCase(fetchIncidents.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            })
            .addCase(fetchIncidentById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchIncidentById.fulfilled, (state, action) => {
                state.loading = false;
                state.currentIncident = action.payload;
            })
            .addCase(fetchIncidentById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload || action.error.message;
            });
    }
});

export const { clearIncidentError } = incidentsSlice.actions;
export default incidentsSlice.reducer;
