import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllAssets } from '../../services/assetsService';

const fetchAssets = createAsyncThunk('assets/fetchAssets', async () => {
    const response = await getAllAssets();
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách tài sản');
    }
});

const assetsSlice = createSlice({
    name: 'assets',
    initialState: {
        assets: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
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
            });
    },
});

export { fetchAssets };
export default assetsSlice.reducer;
