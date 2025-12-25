/**
 * Maintenance Service - Action-based State Machine API
 * Sử dụng state machine workflow thay vì direct status updates
 */
import customizeAxios from './customize-axios';

const maintenanceService = {
    // ==================== READ OPERATIONS ====================
    
    getAllMaintenance: async (filters = {}) => {
        try {
            const response = await customizeAxios.get('/maintenance', { params: filters });
            return response.data.data || response.data; // Extract data array
        } catch (error) {
            console.error('Error fetching maintenance:', error);
            throw error;
        }
    },

    getMaintenanceById: async (id) => {
        try {
            const response = await customizeAxios.get(`/maintenance/${id}`);
            // Response bao gồm nextActions array cho UI
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance by ID:', error);
            throw error;
        }
    },

    createMaintenance: async (data) => {
        try {
            const response = await customizeAxios.post('/maintenance', data);
            return response.data;
        } catch (error) {
            console.error('Error creating maintenance:', error);
            throw error;
        }
    },

    // ==================== ACTION-BASED WORKFLOW ====================
    
    /**
     * Gửi phê duyệt (draft → pending)
     * Role: TECHNICIAN, PLANNER
     */
    submitMaintenance: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/submit`, data);
            return response.data;
        } catch (error) {
            console.error('Error submitting maintenance:', error);
            throw error.response?.data?.message || 'Không thể gửi phê duyệt';
        }
    },

    /**
     * Phê duyệt (pending → approved)
     * Role: MANAGER, QA
     */
    approveMaintenance: async (id, data = {}) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/approve`, data);
            return response.data;
        } catch (error) {
            console.error('Error approving maintenance:', error);
            throw error.response?.data?.message || 'Không thể phê duyệt';
        }
    },

    /**
     * Lập lịch (approved → scheduled)
     * Role: PLANNER, MANAGER
     */
    scheduleMaintenance: async (id, data) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/schedule`, {
                scheduled_date: data.scheduled_date,
                shift: data.shift,
                technician_id: data.technician_id
            });
            return response.data;
        } catch (error) {
            console.error('Error scheduling maintenance:', error);
            throw error.response?.data?.message || 'Không thể lập lịch';
        }
    },

    /**
     * Bắt đầu thực hiện (scheduled → in_progress)
     * Role: TECHNICIAN
     */
    startMaintenance: async (id) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/start`);
            return response.data;
        } catch (error) {
            console.error('Error starting maintenance:', error);
            throw error.response?.data?.message || 'Không thể bắt đầu';
        }
    },

    /**
     * Gửi nghiệm thu (in_progress → awaiting_acceptance)
     * Role: TECHNICIAN
     */
    submitAcceptance: async (id, data) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/submit-acceptance`, {
                notes: data.notes,
                actual_duration: data.actual_duration,
                cost: data.cost
            });
            return response.data;
        } catch (error) {
            console.error('Error submitting acceptance:', error);
            throw error.response?.data?.message || 'Không thể gửi nghiệm thu';
        }
    },

    /**
     * Nghiệm thu đạt (awaiting_acceptance → accepted)
     * Role: QA, ENGINEERING
     */
    acceptMaintenance: async (id, notes = '') => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/accept`, {
                acceptance_notes: notes
            });
            return response.data;
        } catch (error) {
            console.error('Error accepting maintenance:', error);
            throw error.response?.data?.message || 'Không thể nghiệm thu';
        }
    },

    /**
     * Nghiệm thu không đạt (awaiting_acceptance → in_progress)
     * Role: QA, ENGINEERING
     */
    rejectAcceptance: async (id, notes) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/reject-acceptance`, {
                rejection_notes: notes
            });
            return response.data;
        } catch (error) {
            console.error('Error rejecting acceptance:', error);
            throw error.response?.data?.message || 'Không thể từ chối nghiệm thu';
        }
    },

    /**
     * Đóng lệnh bảo trì (accepted → closed)
     * Role: MANAGER
     */
    closeMaintenance: async (id) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/close`);
            return response.data;
        } catch (error) {
            console.error('Error closing maintenance:', error);
            throw error.response?.data?.message || 'Không thể đóng lệnh';
        }
    },

    /**
     * Hủy lệnh bảo trì (trước in_progress)
     * Role: MANAGER
     */
    cancelMaintenance: async (id, reason) => {
        try {
            const response = await customizeAxios.post(`/maintenance/${id}/cancel`, {
                cancel_reason: reason
            });
            return response.data;
        } catch (error) {
            console.error('Error cancelling maintenance:', error);
            throw error.response?.data?.message || 'Không thể hủy lệnh';
        }
    },

    // ==================== LEGACY SUPPORT ====================
    
    /**
     * @deprecated Use action-based methods instead
     */
    updateMaintenance: async (id, data) => {
        try {
            const response = await customizeAxios.put(`/maintenance/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating maintenance:', error);
            throw error;
        }
    },

    deleteMaintenance: async (id, reason) => {
        try {
            const response = await customizeAxios.delete(`/maintenance/${id}`, { 
                data: { reason } 
            });
            return response.data;
        } catch (error) {
            console.error('Error deleting maintenance:', error);
            throw error;
        }
    },

    // Kept for backward compatibility with other modules
    getMaintenanceByAsset: async (assetId) => {
        try {
            const response = await customizeAxios.get(`/maintenance`, { 
                params: { asset_id: assetId } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance by asset:', error);
            throw error;
        }
    },

    getMaintenanceByStatus: async (status) => {
        try {
            const response = await customizeAxios.get(`/maintenance`, { 
                params: { status } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance by status:', error);
            throw error;
        }
    },

    getMaintenanceByTechnician: async (technicianId) => {
        try {
            const response = await customizeAxios.get(`/maintenance`, { 
                params: { technician_id: technicianId } 
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching maintenance by technician:', error);
            throw error;
        }
    }
};

export default maintenanceService;

// Named exports for backward compatibility
export const getAllMaintenance = maintenanceService.getAllMaintenance;
export const getMaintenanceById = maintenanceService.getMaintenanceById;
export const createMaintenance = maintenanceService.createMaintenance;
export const getMaintenanceByAsset = maintenanceService.getMaintenanceByAsset;
export const getMaintenanceByStatus = maintenanceService.getMaintenanceByStatus;
export const getMaintenanceByTechnician = maintenanceService.getMaintenanceByTechnician;
export const updateMaintenance = maintenanceService.updateMaintenance;
export const deleteMaintenance = maintenanceService.deleteMaintenance;
export const approveMaintenance = maintenanceService.approveMaintenance;
export const submitMaintenance = maintenanceService.submitMaintenance;
export const scheduleMaintenance = maintenanceService.scheduleMaintenance;
export const startMaintenance = maintenanceService.startMaintenance;
export const submitAcceptance = maintenanceService.submitAcceptance;
export const acceptMaintenance = maintenanceService.acceptMaintenance;
export const rejectAcceptance = maintenanceService.rejectAcceptance;
export const closeMaintenance = maintenanceService.closeMaintenance;
export const cancelMaintenance = maintenanceService.cancelMaintenance;

// Alias for compatibility
export const rejectMaintenance = maintenanceService.rejectAcceptance;
