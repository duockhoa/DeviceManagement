import axios from './customize-axios';

// Get notifications by user ID
async function getNotificationsByUserId(userId, params = {}) {
    try {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString 
            ? `/notifications/user/${userId}?${queryString}` 
            : `/notifications/user/${userId}`;
        
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Không thể lấy danh sách thông báo');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách thông báo');
        }
    }
}

// Get unread notifications count
async function getUnreadCount(userId) {
    try {
        const response = await axios.get(`/notifications/unread-count/${userId}`);
        if (response.status === 200) {
            return response.data.data.unread_count;
        } else {
            throw new Error('Không thể lấy số thông báo chưa đọc');
        }
    } catch (error) {
        console.error('Error getting unread count:', error);
        return 0;
    }
}

// Mark single notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const response = await axios.put(`/notifications/${notificationId}/read`);
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Không thể đánh dấu thông báo đã đọc');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi đánh dấu thông báo đã đọc');
        }
    }
}

// Mark all notifications as read for a user
async function markAllNotificationsAsRead(userId) {
    try {
        const response = await axios.put(`/notifications/mark-all-read/${userId}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Không thể đánh dấu tất cả thông báo đã đọc');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi đánh dấu tất cả thông báo đã đọc');
        }
    } 
}

// Delete notification
async function deleteNotification(notificationId) {
    try {
        const response = await axios.delete(`/notifications/${notificationId}`);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Không thể xóa thông báo');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi xóa thông báo');
        }
    }
}

export { 
    getNotificationsByUserId, 
    getUnreadCount,
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    deleteNotification
};
