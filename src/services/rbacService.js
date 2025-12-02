import customAxios from './customize-axios';

const API_PATH = '/rbac';

const rbacService = {
    // ==================== ROLES ====================
    getAllRoles: async (params = {}) => {
        try {
            const response = await customAxios.get(`${API_PATH}/roles`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching roles:', error);
            throw error;
        }
    },

    createRole: async (data) => {
        try {
            const response = await customAxios.post(`${API_PATH}/roles`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating role:', error);
            throw error;
        }
    },

    updateRole: async (id, data) => {
        try {
            const response = await customAxios.put(`${API_PATH}/roles/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Error updating role:', error);
            throw error;
        }
    },

    deleteRole: async (id) => {
        try {
            const response = await customAxios.delete(`${API_PATH}/roles/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting role:', error);
            throw error;
        }
    },

    // ==================== PERMISSIONS ====================
    getAllPermissions: async (params = {}) => {
        try {
            const response = await customAxios.get(`${API_PATH}/permissions`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching permissions:', error);
            throw error;
        }
    },

    createPermission: async (data) => {
        try {
            const response = await customAxios.post(`${API_PATH}/permissions`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating permission:', error);
            throw error;
        }
    },

    // ==================== USER ROLES ====================
    getAllUsers: async (params = {}) => {
        try {
            const response = await customAxios.get(`${API_PATH}/users`, { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching users:', error);
            throw error;
        }
    },

    getUserRoles: async (userId) => {
        try {
            const response = await customAxios.get(`${API_PATH}/users/${userId}/roles`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user roles:', error);
            throw error;
        }
    },

    assignUserRoles: async (userId, roleIds) => {
        try {
            const response = await customAxios.post(`${API_PATH}/users/${userId}/roles`, {
                role_ids: roleIds
            });
            return response.data;
        } catch (error) {
            console.error('Error assigning user roles:', error);
            throw error;
        }
    },

    getUserPermissions: async (userId) => {
        try {
            const response = await customAxios.get(`${API_PATH}/users/${userId}/permissions`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user permissions:', error);
            throw error;
        }
    },

    // ==================== SEED ====================
    seedRBAC: async () => {
        try {
            const response = await customAxios.post(`${API_PATH}/seed`);
            return response.data;
        } catch (error) {
            console.error('Error seeding RBAC:', error);
            throw error;
        }
    }
};

export default rbacService;
