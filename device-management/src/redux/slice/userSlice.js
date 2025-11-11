import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { getUserService } from '../../services/usersService';

const fetchUser = createAsyncThunk('user/fetchUser', async () => {
    const response = await getUserService();
    return response.data?.result;
});

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: {
            id: '',
            name: '',
            email: '',
            phone: '',
            avatar: '',
            createdAt: '',
            updatedAt: '',
        },
        loading: false,
        error: null,
        onEditUser: false,
    },
    reducers: {
        setOnEdit: (state, action) => {
            state.onEditUser = action.payload;
        },
        setUserInfo: (state, action) => {
            state.userInfo = action.payload;
        },
    },

    extraReducers: (builder) => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            if (action.payload) {
                state.userInfo = action.payload;
            }
            state.loading = false;
            state.error = null;
        });
        builder.addCase(fetchUser.pending, (state) => {
            state.error = null;
            state.loading = true;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.error.message;
        });
    },
});

export { fetchUser };
export const { setOnEdit, setUserInfo } = userSlice.actions;
export default userSlice.reducer;
