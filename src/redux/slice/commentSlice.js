import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCommentsByRequestIdService, createCommentService } from '../../services/commentService';

// Fetch comments thunk
export const fetchComments = createAsyncThunk('comments/fetchComments', async (requestId) => {
    const response = await getCommentsByRequestIdService(requestId);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể lấy danh sách bình luận');
    }
});

// Create comment thunk
export const createComment = createAsyncThunk('comments/createComment', async (payload) => {
    const response = await createCommentService(payload);
    if (response) {
        return response;
    } else {
        throw new Error('Không thể tạo bình luận');
    }
});

const commentSlice = createSlice({
    name: 'comments',
    initialState: {
        comments: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearComments: (state) => {
            state.comments = [];
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch comments cases
            .addCase(fetchComments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchComments.fulfilled, (state, action) => {
                state.comments = action.payload;
                state.loading = false;
            })
            .addCase(fetchComments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Create comment cases
            .addCase(createComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createComment.fulfilled, (state, action) => {
                state.loading = false;
                state.comments.push(action.payload);
            })
            .addCase(createComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearComments } = commentSlice.actions;
export default commentSlice.reducer;
