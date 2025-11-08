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
    }
};

export default maintenanceService;