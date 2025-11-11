import axios from './auth-axios';

// Service xử lý các API liên quan đến bảo trì thiết bị
const maintenanceService = {
    // Lấy danh sách tất cả lịch bảo trì
    getAll: () => {
        return axios.get('/maintenance');
    },
    
    // Tạo mới một lịch bảo trì
    create: (data) => {
        return axios.post('/maintenance', data);
    },
    
    // Cập nhật thông tin lịch bảo trì
    update: (id, data) => {
        return axios.put(`/maintenance/${id}`, data);
    },
    
    // Xóa một lịch bảo trì
    delete: (id) => {
        return axios.delete(`/maintenance/${id}`);
    },

    // Lấy chi tiết một lịch bảo trì
    getById: (id) => {
        return axios.get(`/maintenance/${id}`);
    },

    // Lấy lịch sử bảo trì của một thiết bị
    getMaintenanceHistory: (assetId) => {
        return axios.get(`/maintenance/history/${assetId}`);
    },

    // Lấy danh sách bảo trì sắp tới
    getUpcomingMaintenance: () => {
        return axios.get('/maintenance/upcoming');
    },

    // Cập nhật trạng thái bảo trì
    updateMaintenanceStatus: (id, status) => {
        return axios.patch(`/maintenance/${id}/status`, { status });
    },

    // Lấy thống kê bảo trì
    getMaintenanceStats: () => {
        return axios.get('/maintenance/stats');
    },

    // Lấy danh sách thiết bị cần bảo trì
    getDevicesNeedMaintenance: () => {
        return axios.get('/maintenance/devices-need-maintenance');
    },

    // Lấy chi tiết báo cáo bảo trì theo khoảng thời gian
    getMaintenanceReport: (startDate, endDate) => {
        return axios.get('/maintenance/report', {
            params: { startDate, endDate }
        });
    }
};

export default maintenanceService;