import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getNotificationsByUserId,
    getUnreadCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification
} from '../../services/notificationService';

// Async thunks
export const fetchNotifications = createAsyncThunk(
    'notifications/fetchNotifications',
    async ({ userId, params = {} }) => {
        const response = await getNotificationsByUserId(userId, params);
        return response.data;
    }
);

export const fetchUnreadCount = createAsyncThunk(
    'notifications/fetchUnreadCount',
    async (userId) => {
        const count = await getUnreadCount(userId);
        return count;
    }
);

export const markAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId) => {
        const response = await markNotificationAsRead(notificationId);
        return { notificationId, data: response };
    }
);

export const markAllAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (userId) => {
        await markAllNotificationsAsRead(userId);
        return userId;
    }
);

export const removeNotification = createAsyncThunk(
    'notifications/removeNotification',
    async (notificationId) => {
        await deleteNotification(notificationId);
        return notificationId;
    }
);

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
    pagination: {
        total: 0,
        limit: 50,
        offset: 0
    }
};

const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        },
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.is_read) {
                state.unreadCount += 1;
            }
        },
        updateUnreadCount: (state, action) => {
            state.unreadCount = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch notifications
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.notifications = action.payload;
                state.loading = false;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch unread count
            .addCase(fetchUnreadCount.fulfilled, (state, action) => {
                state.unreadCount = action.payload;
            })
            
            // Mark as read
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(
                    n => n.id === action.payload.notificationId
                );
                if (notification && !notification.is_read) {
                    notification.is_read = true;
                    notification.read_at = new Date().toISOString();
                    state.unreadCount = Math.max(0, state.unreadCount - 1);
                }
            })
            
            // Mark all as read
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(notification => {
                    if (!notification.is_read) {
                        notification.is_read = true;
                        notification.read_at = new Date().toISOString();
                    }
                });
                state.unreadCount = 0;
            })
            
            // Remove notification
            .addCase(removeNotification.fulfilled, (state, action) => {
                const index = state.notifications.findIndex(
                    n => n.id === action.payload
                );
                if (index !== -1) {
                    const notification = state.notifications[index];
                    if (!notification.is_read) {
                        state.unreadCount = Math.max(0, state.unreadCount - 1);
                    }
                    state.notifications.splice(index, 1);
                }
            });
    }
});

export const { clearNotifications, addNotification, updateUnreadCount } = notificationSlice.actions;
export default notificationSlice.reducer;
