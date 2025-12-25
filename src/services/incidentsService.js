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
            // Response bao gồm nextActions array cho UI
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

    // ==================== ACTION-BASED WORKFLOW ====================
    
    /**
     * Phân loại sự cố (reported → triaged)
     * Role: MANAGER, QA
     */
    triageIncident: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/triage`, data);
            return response.data;
        } catch (error) {
            console.error('Error triaging incident:', error);
            throw error.response?.data?.message || 'Không thể phân loại sự cố';
        }
    },

    /**
     * Cô lập thiết bị (triaged → out_of_service)
     * Role: MANAGER
     * Required for critical incidents
     */
    isolateIncident: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/isolate`, data);
            return response.data;
        } catch (error) {
            console.error('Error isolating incident:', error);
            throw error.response?.data?.message || 'Không thể cô lập thiết bị';
        }
    },

    /**
     * Phân công kỹ thuật viên (triaged|out_of_service → assigned)
     * Role: MANAGER
     */
    assignIncident: async (id, assignedTo) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/assign`, { 
                assigned_to: assignedTo 
            });
            return response.data;
        } catch (error) {
            console.error('Error assigning incident:', error);
            throw error.response?.data?.message || 'Không thể phân công sự cố';
        }
    },

    /**
     * Bắt đầu xử lý (assigned → in_progress)
     * Role: TECHNICIAN
     */
    startIncident: async (id) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/start`);
            return response.data;
        } catch (error) {
            console.error('Error starting incident:', error);
            throw error.response?.data?.message || 'Không thể bắt đầu xử lý sự cố';
        }
    },

    /**
     * Gửi kiểm tra sau sửa chữa (in_progress → post_fix_check)
     * Role: TECHNICIAN
     */
    submitPostFix: async (id, data) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/submit-post-fix`, data);
            return response.data;
        } catch (error) {
            console.error('Error submitting post-fix check:', error);
            throw error.response?.data?.message || 'Không thể gửi kiểm tra';
        }
    },

    /**
     * Kiểm tra sau sửa chữa (post_fix_check → resolved|in_progress)
     * Role: QA, ENGINEERING
     * data: { post_fix_result: 'pass' | 'fail', post_fix_notes: string }
     */
    postFixCheck: async (id, data) => {
        try {
            const response = await customizeAxios.post(`/incidents/${id}/post-fix-check`, data);
            return response.data;
        } catch (error) {
            console.error('Error performing post-fix check:', error);
            throw error.response?.data?.message || 'Không thể thực hiện kiểm tra';
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
    }
};

export default incidentsService;
