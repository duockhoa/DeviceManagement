import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { getAllUsersService } from '../../services/usersService';

const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
    const response = await getAllUsersService();
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách người dùng');
    }
});

const usersSlice = createSlice({
    name: 'users',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export { fetchUsers };
export default usersSlice.reducer;
