import customAxios from './customize-axios';

// Lấy danh sách WO được giao cho user
export const getMyWorkOrders = async () => {
    try {
        const response = await customAxios.get('/maintenance-work/my-tasks');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching my work orders:', error);
        throw error;
    }
};

// Lấy chi tiết WO
export const getWorkOrderById = async (id) => {
    try {
        const response = await customAxios.get(`/maintenance-work/${id}`);
        return response.data?.data || null;
    } catch (error) {
        console.error('Error fetching work order:', error);
        throw error;
    }
};

// Cập nhật checklist item
export const updateChecklistItem = async (maintenanceId, checklistId, data) => {
    try {
        const response = await customAxios.put(
            `/maintenance-work/${maintenanceId}/checklist/${checklistId}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error updating checklist:', error);
        throw error;
    }
};

// Thêm cập nhật tiến độ
export const addProgressUpdate = async (maintenanceId, data) => {
    try {
        const response = await customAxios.post(
            `/maintenance-work/${maintenanceId}/progress`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error adding progress:', error);
        throw error;
    }
};

// Upload hình ảnh
export const uploadMaintenanceImage = async (maintenanceId, data) => {
    try {
        const response = await customAxios.post(
            `/maintenance-work/${maintenanceId}/images`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

// Hoàn thành công việc
export const completeWork = async (maintenanceId, data) => {
    try {
        const response = await customAxios.put(
            `/maintenance-work/${maintenanceId}/complete`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error completing work:', error);
        throw error;
    }
};

// Lấy danh sách WO chờ duyệt (cho trưởng BP)
export const getPendingApproval = async () => {
    try {
        const response = await customAxios.get('/maintenance-work/pending-approval');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching pending approvals:', error);
        throw error;
    }
};

// Duyệt WO (trưởng BP)
export const approveWork = async (maintenanceId, data) => {
    try {
        const response = await customAxios.post(
            `/maintenance-work/${maintenanceId}/approve`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error approving work:', error);
        throw error;
    }
};
