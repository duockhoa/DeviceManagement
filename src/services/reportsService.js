/**
 * Reports Service - Analytics & CAPA
 */
import customizeAxios from './customize-axios';

const reportsService = {
    /**
     * Dashboard summary - Tổng hợp các chỉ số chính
     * @param {number} period - Số ngày (default: 30)
     */
    getDashboardSummary: async (period = 30) => {
        try {
            const response = await customizeAxios.get('/reports/dashboard', {
                params: { period }
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching dashboard summary:', error);
            throw error.response?.data?.message || 'Không thể tải dashboard';
        }
    },

    /**
     * Downtime report - Báo cáo thời gian dừng máy
     * @param {Object} filters - { asset_id, startDate, endDate, groupBy }
     */
    getIncidentDowntime: async (filters = {}) => {
        try {
            const response = await customizeAxios.get('/reports/incidents/downtime', {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching downtime report:', error);
            throw error.response?.data?.message || 'Không thể tải báo cáo downtime';
        }
    },

    /**
     * Pareto analysis - Phân tích Pareto
     * @param {Object} filters - { groupBy, startDate, endDate }
     */
    getIncidentPareto: async (filters = {}) => {
        try {
            const response = await customizeAxios.get('/reports/incidents/pareto', {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching Pareto analysis:', error);
            throw error.response?.data?.message || 'Không thể tải phân tích Pareto';
        }
    },

    /**
     * MTBF/MTTR metrics
     * @param {Object} filters - { asset_id, startDate, endDate }
     */
    getMtbfMttr: async (filters = {}) => {
        try {
            const response = await customizeAxios.get('/reports/mtbf-mttr', {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching MTBF/MTTR:', error);
            throw error.response?.data?.message || 'Không thể tải MTBF/MTTR';
        }
    },

    /**
     * CAPA tracking - Danh sách CAPA
     * @param {Object} filters - { status, severity }
     */
    getCapaList: async (filters = {}) => {
        try {
            const response = await customizeAxios.get('/reports/capa', {
                params: filters
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching CAPA list:', error);
            throw error.response?.data?.message || 'Không thể tải danh sách CAPA';
        }
    },

    /**
     * OEE Report - Legacy compatibility
     * @param {Object} params - Query parameters
     */
    getOeeReport: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await customizeAxios.get(`/reports/oee${queryString ? `?${queryString}` : ''}`);
            return response.data?.data;
        } catch (error) {
            console.error('Error fetching OEE report:', error);
            throw error.response?.data?.message || 'Không thể tải OEE report';
        }
    },

    /**
     * MTBF Report - Legacy compatibility
     * @param {Object} params - Query parameters
     */
    getMtbfReport: async (params = {}) => {
        try {
            const queryString = new URLSearchParams(params).toString();
            const response = await customizeAxios.get(`/reports/mtbf${queryString ? `?${queryString}` : ''}`);
            return response.data?.data;
        } catch (error) {
            console.error('Error fetching MTBF report:', error);
            throw error.response?.data?.message || 'Không thể tải MTBF report';
        }
    }
};

// Named exports for backward compatibility
export const getDashboardSummary = reportsService.getDashboardSummary;
export const getIncidentDowntime = reportsService.getIncidentDowntime;
export const getIncidentPareto = reportsService.getIncidentPareto;
export const getMtbfMttr = reportsService.getMtbfMttr;
export const getCapaList = reportsService.getCapaList;
export const getOeeReport = reportsService.getOeeReport;
export const getMtbfReport = reportsService.getMtbfReport;

export default reportsService;
