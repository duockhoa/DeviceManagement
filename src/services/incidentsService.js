/**
 * Incident Service - Action-based State Machine API
 * Sử dụng state machine workflow thay vì direct status updates
 */
import customizeAxios from './customize-axios';

const incidentsService = {
    // ==================== READ OPERATIONS ====================
    
    getAllIncidents: async (filters = {}) => {
        try {
            const response = await customizeAxios.get('/incidents', { params: filters });
            return response.data.data || response.data; // Extract data array
        } catch (error) {
            console.error('Error fetching incidents:', error);
            throw error.response?.data?.message || 'Không thể tải danh sách sự cố';
        }
    },

    getIncidentById: async (id) => {
        try {
            const response = await customizeAxios.get(`/incidents/${id}`);
            // Backend returns { success: true, data: {...incident} }
            return response.data.data || response.data;
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

    // ==================== ACTION-BASED WORKFLOW (SIMPLIFIED) ====================
    
    /**
     * Tiếp nhận và bắt đầu xử lý sự cố (reported → in_progress)
     * Role: TECHNICIAN, QA, MANAGER
     * Thay thế cho triage + assign + start
     */
    acknowledgeIncident: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/acknowledge`, data);
            return response.data;
        } catch (error) {
            console.error('Error acknowledging incident:', error);
            throw error.response?.data?.message || 'Không thể tiếp nhận sự cố';
        }
    },

    /**
     * Đánh dấu sự cố đã được giải quyết (in_progress → resolved)
     * Role: TECHNICIAN, QA, MANAGER
     * data: { solution: string, root_cause: string, downtime_minutes: number }
     */
    resolveIncident: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/resolve`, data);
            return response.data;
        } catch (error) {
            console.error('Error resolving incident:', error);
            throw error.response?.data?.message || 'Không thể đánh dấu đã giải quyết';
        }
    },

    /**
     * Chuyển sự cố thiết bị thành lệnh bảo trì sửa chữa
     * Tạo maintenance order từ incident data, link incident_id
     * Chỉ áp dụng cho incident_category = EQUIPMENT
     * Role: MANAGER
     */
    convertToMaintenance: async (id, data) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/convert-to-maintenance`, data);
            return response.data;
        } catch (error) {
            console.error('Error converting to maintenance:', error);
            throw error.response?.data?.message || 'Không thể chuyển sang lệnh bảo trì';
        }
    },

    /**
     * Đóng sự cố (resolved → closed)
     * Role: MANAGER, QA
     * data: { close_notes?, downtime_minutes? }
     */
    closeIncident: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/close`, data);
            return response.data;
        } catch (error) {
            console.error('Error closing incident:', error);
            throw error.response?.data?.message || 'Không thể đóng sự cố';
        }
    },

    /**
     * Hủy sự cố (reported → cancelled)
     * Role: MANAGER
     * data: { cancel_reason: string }
     */
    cancelIncident: async (id, data) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/cancel`, data);
            return response.data;
        } catch (error) {
            console.error('Error cancelling incident:', error);
            throw error.response?.data?.message || 'Không thể hủy sự cố';
        }
    },

    // ==================== LEGACY SUPPORT ====================
    
    /**
     * @deprecated Use action-based methods instead
     */
    updateIncident: async (id, incidentData) => {
        try {
            const response = await customizeAxios.put(`/incidents/${id}`, incidentData);
            return response.data;
        } catch (error) {
            console.error('Error updating incident:', error);
            throw error.response?.data?.message || 'Không thể cập nhật sự cố';
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

    // ==================== COMPATIBILITY METHODS ====================
    
    /**
     * Get my incidents - wrapper for getAllIncidents with user filter
     */
    getMyIncidents: async () => {
        try {
            const response = await customizeAxios.get('/incidents/my-incidents');
            return response.data;
        } catch (error) {
            console.error('Error fetching my incidents:', error);
            throw error.response?.data?.message || 'Không thể tải sự cố của bạn';
        }
    },

    /**
     * Get incident statistics - use reportsService.getDashboardSummary instead
     * @deprecated Use reportsService.getDashboardSummary
     */
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

    /**
     * Assess incident - maps to triageIncident
     * @deprecated Use triageIncident instead
     */
    assessIncident: async (id, payload) => {
        try {
            // Map to triageIncident with appropriate data
            return await incidentsService.triageIncident(id, {
                priority: payload.priority,
                notes: payload.assessment_notes
            });
        } catch (error) {
            console.error('Error assessing incident:', error);
            throw error.response?.data?.message || 'Không thể gửi đánh giá sự cố';
        }
    },

    /**
     * Approve solution - specific workflow action
     */
    approveSolution: async (id) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/approve-solution`);
            return response.data;
        } catch (error) {
            console.error('Error approving solution:', error);
            throw error.response?.data?.message || 'Không thể duyệt phương án';
        }
    },

    // ==================== REPORTS ====================

    /**
     * Get incident reports with statistics
     */
    getIncidentReports: async (params = {}) => {
        try {
            const response = await customizeAxios.get('/incidents/reports', { params });
            return response.data.data || response.data;
        } catch (error) {
            console.error('Error fetching incident reports:', error);
            throw error.response?.data?.message || 'Không thể tải báo cáo';
        }
    }
};

export default incidentsService;
