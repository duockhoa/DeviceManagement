import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceService from '../../services/maintenanceService';

// Tạo action bất đồng bộ để lấy danh sách bảo trì
export const fetchMaintenance = createAsyncThunk(
    'maintenance/fetchAll',
    async () => {
        const response = await maintenanceService.getAll();
        return response.data;
    }
);

// Tạo action thêm mới lịch bảo trì
export const createMaintenance = createAsyncThunk(
    'maintenance/create',
    async (data) => {
        const response = await maintenanceService.create(data);
        return response.data;
    }
);

// Tạo action cập nhật lịch bảo trì
export const updateMaintenance = createAsyncThunk(
    'maintenance/update',
    async ({ id, data }) => {
        const response = await maintenanceService.update(id, data);
        return response.data;
    }
);

// Slice quản lý state cho module bảo trì
const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState: {
        items: [],         // Danh sách các lịch bảo trì
        loading: false,    // Trạng thái loading
        error: null,       // Thông tin lỗi nếu có
        selectedItem: null // Item đang được chọn để xem chi tiết/sửa
    },
    reducers: {
        // Action đặt item được chọn
        setSelectedItem: (state, action) => {
            state.selectedItem = action.payload;
        },
        // Action xóa item được chọn
        clearSelectedItem: (state) => {
            state.selectedItem = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý các trạng thái của action fetch danh sách
            .addCase(fetchMaintenance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenance.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchMaintenance.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Xử lý các trạng thái của action tạo mới
            .addCase(createMaintenance.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            // Xử lý các trạng thái của action cập nhật
            .addCase(updateMaintenance.fulfilled, (state, action) => {
                const index = state.items.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            });
    }
});

// Export các actions
export const { setSelectedItem, clearSelectedItem } = maintenanceSlice.actions;

// Export reducer
export default maintenanceSlice.reducer;