import axios from './customize-axios';

// Get notifications by user ID
async function getNotificationsByUserId(userId) {
    try {
        const response = await axios.get(`/notification/getall/${userId}`);
        if (response.status === 200) {
            return response.data.result;
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

// Mark single notification as read
async function markNotificationAsRead(notificationId) {
    try {
        const response = await axios.put(`/notification/markread/${notificationId}`);
        if (response.status === 200) {
            return response.data.result;
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
        const response = await axios.put(`/notification/markreadall/${userId}`);
        if (response.status === 200) {
            return response.data.result;
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

export { getNotificationsByUserId, markNotificationAsRead, markAllNotificationsAsRead };
