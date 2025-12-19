import customAxios from './customize-axios';

// Lấy danh sách công việc bảo trì của user hiện tại
export const getMyWorkOrders = async () => {
    try {
        const response = await customAxios.get('/maintenance/my-work');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching my work orders:', error);
        throw error;
    }
};

// Lấy danh sách yêu cầu xưởng được phân công cho user (chưa tạo lịch bảo trì)
export const getMyRequestTasks = async () => {
    try {
        const response = await customAxios.get('/work-requests/my-tasks');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching my request tasks:', error);
        throw error;
    }
};

// Lấy kết quả bảo trì (quản lý) - in_progress, awaiting_approval, completed
export const getMaintenanceResults = async () => {
    try {
        const response = await customAxios.get('/maintenance/results');
        return response.data?.data || [];
    } catch (error) {
        console.error('Error fetching maintenance results:', error);
        throw error;
    }
};

// Lấy chi tiết WO
export const getWorkOrderById = async (id) => {
    try {
        const response = await customAxios.get(`/maintenance/${id}`);
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

// Cập nhật báo cáo công việc
export const updateWorkTaskReport = async (maintenanceId, taskId, data) => {
    try {
        const response = await customAxios.put(
            `/maintenance/${maintenanceId}/work-tasks/${taskId}`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error updating work task report:', error);
        throw error;
    }
};

// Bắt đầu công việc
export const startWorkTask = async (maintenanceId, taskId, data) => {
    try {
        const response = await customAxios.post(
            `/maintenance/${maintenanceId}/work-tasks/${taskId}/start`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error starting work task:', error);
        throw error;
    }
};

// Hoàn thành công việc
export const completeWorkTask = async (maintenanceId, taskId, data) => {
    try {
        const response = await customAxios.post(
            `/maintenance/${maintenanceId}/work-tasks/${taskId}/complete`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error completing work task:', error);
        throw error;
    }
};

// Bắt đầu lệnh bảo trì (chuyển status pending/awaiting_approval → in_progress)
export const startMaintenance = async (maintenanceId) => {
    try {
        const response = await customAxios.post(
            `/maintenance/${maintenanceId}/start`
        );
        return response.data;
    } catch (error) {
        console.error('Error starting maintenance:', error);
        throw error;
    }
};

// Lưu tiến độ công việc hiện tại
export const saveMaintenanceProgress = async (maintenanceId, data) => {
    try {
        const response = await customAxios.put(
            `/maintenance/${maintenanceId}/save-progress`,
            data
        );
        return response.data;
    } catch (error) {
        console.error('Error saving maintenance progress:', error);
        throw error;
    }
};

export const decideWorkOrder = async (maintenanceId, { approved, rejection_reason }) => {
    try {
        const response = await customAxios.post(
            `/maintenance-work/${maintenanceId}/approve`,
            { approved, rejection_reason }
        );
        return response.data;
    } catch (error) {
        console.error('Error approving/rejecting work order:', error);
        throw error;
    }
};
