import customizeAxios from './customize-axios';

const userServices = {
    /**
     * Get users with optional filters
     * @param {Object} params - Query parameters
     * @param {string} params.role - Filter by role (TECHNICIAN, MANAGER, etc.)
     * @param {string} params.status - Filter by status (active, inactive)
     * @returns {Promise} Response with users array
     */
    getUsers: async (params = {}) => {
        try {
            const response = await customizeAxios.get('/users', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error.response?.data?.message || 'Không thể tải danh sách người dùng';
        }
    },

    /**
     * Get user by ID
     * @param {number} id - User ID
     * @returns {Promise} User data
     */
    getUserById: async (id) => {
        try {
            const response = await customizeAxios.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error.response?.data?.message || 'Không thể tải thông tin người dùng';
        }
    },

    /**
     * Get technicians (shortcut for getUsers with role=TECHNICIAN)
     * @returns {Promise} Response with technicians array
     */
    getTechnicians: async () => {
        return await userServices.getUsers({ role: 'TECHNICIAN', status: 'active' });
    }
};

export { userServices };
export default userServices;
