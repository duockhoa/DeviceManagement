import customizeAxios from './customize-axios';

const incidentsService = {
    getAllIncidents: async () => {
        try {
            const response = await customizeAxios.get('/incidents');
            return response.data;
        } catch (error) {
            console.error('Error fetching incidents:', error);
            throw error.response?.data?.message || 'Không thể tải danh sách sự cố';
        }
    },

    getIncidentById: async (id) => {
        try {
            const response = await customizeAxios.get(`/incidents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching incident:', error);
            throw error.response?.data?.message || 'Không thể tải chi tiết sự cố';
        }
    },

    createIncident: async (incidentData) => {
        try {
            const response = await customizeAxios.post('/incidents', incidentData);
            return response.data;
        } catch (error) {
            console.error('Error creating incident:', error);
            throw error.response?.data?.message || 'Không thể tạo sự cố mới';
        }
    },

    updateIncident: async (id, incidentData) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}`, incidentData);
            return response.data;
        } catch (error) {
            console.error('Error updating incident:', error);
            throw error.response?.data?.message || 'Không thể cập nhật sự cố';
        }
    },

    assignIncident: async (id, assignedTo) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}/assign`, { assigned_to: assignedTo });
            return response.data;
        } catch (error) {
            console.error('Error assigning incident:', error);
            throw error.response?.data?.message || 'Không thể phân công sự cố';
        }
    },

    startIncident: async (id) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}/start`);
            return response.data;
        } catch (error) {
            console.error('Error starting incident:', error);
            throw error.response?.data?.message || 'Không thể bắt đầu xử lý sự cố';
        }
    },

    resolveIncident: async (id, resolveData) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}/resolve`, resolveData);
            return response.data;
        } catch (error) {
            console.error('Error resolving incident:', error);
            throw error.response?.data?.message || 'Không thể giải quyết sự cố';
        }
    },

    closeIncident: async (id) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}/close`);
            return response.data;
        } catch (error) {
            console.error('Error closing incident:', error);
            throw error.response?.data?.message || 'Không thể đóng sự cố';
        }
    },

    deleteIncident: async (id) => {
        try {
            const response = await customizeAxios.delete(`/incidents/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting incident:', error);
            throw error.response?.data?.message || 'Không thể xóa sự cố';
        }
    },

    getMyIncidents: async () => {
        try {
            const response = await customizeAxios.get('/incidents/my-incidents');
            return response.data;
        } catch (error) {
            console.error('Error fetching my incidents:', error);
            throw error.response?.data?.message || 'Không thể tải sự cố của bạn';
        }
    },

    getIncidentStatistics: async (startDate, endDate) => {
        try {
            const params = {};
            if (startDate) params.startDate = startDate;
            if (endDate) params.endDate = endDate;
            const response = await customizeAxios.get('/incidents/statistics', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching incident statistics:', error);
            throw error.response?.data?.message || 'Không thể tải thống kê sự cố';
        }
    },

    assessIncident: async (id, payload) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}/assess`, payload);
            return response.data;
        } catch (error) {
            console.error('Error assessing incident:', error);
            throw error.response?.data?.message || 'Không thể gửi đánh giá sự cố';
        }
    },

    approveSolution: async (id) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/approve-solution`);
            return response.data;
        } catch (error) {
            console.error('Error approving solution:', error);
            throw error.response?.data?.message || 'Không thể duyệt phương án';
        }
    }
};

export default incidentsService;
