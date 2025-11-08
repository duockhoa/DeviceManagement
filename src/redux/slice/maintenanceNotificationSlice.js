import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import maintenanceNotificationService from '../../services/maintenanceNotificationService';

// Tạo action bất đồng bộ để lấy danh sách thông báo
export const fetchNotifications = createAsyncThunk(
    'maintenanceNotification/fetchAll',
    async () => {
        const response = await maintenanceNotificationService.getAll();
        return response.data;
    }
);

// Tạo action đánh dấu thông báo đã đọc
export const markNotificationAsRead = createAsyncThunk(
    'maintenanceNotification/markAsRead',
    async (notificationId) => {
        const response = await maintenanceNotificationService.markAsRead(notificationId);
        return { id: notificationId, ...response.data };
    }
);

// Slice quản lý state cho thông báo bảo trì
const maintenanceNotificationSlice = createSlice({
    name: 'maintenanceNotification',
    initialState: {
        notifications: [],      // Danh sách thông báo
        unreadCount: 0,        // Số lượng thông báo chưa đọc
        loading: false,        // Trạng thái loading
        error: null           // Thông tin lỗi nếu có
    },
    reducers: {
        // Action cập nhật số lượng thông báo chưa đọc
        updateUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        },
        // Action xóa tất cả thông báo
        clearAllNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            // Xử lý các trạng thái của action fetch thông báo
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            // Xử lý các trạng thái của action đánh dấu đã đọc
            .addCase(markNotificationAsRead.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(n => n.id === action.payload.id);
                if (index !== -1) {
                    state.notifications[index] = {
                        ...state.notifications[index],
                        isRead: true
                    };
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            });
    }
});

// Export các actions
export const { updateUnreadCount, clearAllNotifications } = maintenanceNotificationSlice.actions;

// Export reducer
export default maintenanceNotificationSlice.reducer;