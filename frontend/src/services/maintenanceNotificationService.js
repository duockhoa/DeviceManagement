import axios from '../auth-axios';

// Service xử lý các API liên quan đến thông báo bảo trì
const maintenanceNotificationService = {
    // Lấy danh sách thông báo bảo trì
    getAll: () => {
        return axios.get('/maintenance-notifications');
    },

    // Đánh dấu thông báo đã đọc
    markAsRead: (notificationId) => {
        return axios.put(`/maintenance-notifications/${notificationId}/read`);
    },

    // Tạo thông báo mới
    create: (data) => {
        return axios.post('/maintenance-notifications', data);
    },

    // Lấy số lượng thông báo chưa đọc
    getUnreadCount: () => {
        return axios.get('/maintenance-notifications/unread-count');
    },

    // Gửi email thông báo
    sendEmail: (data) => {
        return axios.post('/maintenance-notifications/send-email', data);
    }
};

export default maintenanceNotificationService;