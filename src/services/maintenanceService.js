import axios from "./customize-axios";

// GET /api/maintenance - Lấy tất cả maintenance records
export const getAllMaintenance = async () => {
  try {
    const response = await axios.get(`/maintenance`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all maintenance:", error);
    throw error;
  }
};

// GET /api/maintenance/:id - Lấy maintenance theo ID
export const getMaintenanceById = async (id) => {
  try {
    const response = await axios.get(`/maintenance/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching maintenance by ID:", error);
    throw error;
  }
};

// GET /api/maintenance/by-asset/:assetId - Lấy maintenance theo asset
export const getMaintenanceByAsset = async (assetId) => {
  try {
    const response = await axios.get(`/maintenance/by-asset/${assetId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching maintenance by asset:", error);
    throw error;
  }
};

// GET /api/maintenance/by-status/:status - Lấy maintenance theo status
export const getMaintenanceByStatus = async (status) => {
  try {
    const response = await axios.get(`/maintenance/by-status/${status}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching maintenance by status:", error);
    throw error;
  }
};

// GET /api/maintenance/by-technician/:technicianId - Lấy maintenance theo technician
export const getMaintenanceByTechnician = async (technicianId) => {
  try {
    const response = await axios.get(`/maintenance/by-technician/${technicianId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching maintenance by technician:", error);
    throw error;
  }
};

// POST /api/maintenance - Tạo maintenance mới
export const createMaintenance = async (data) => {
  try {
    const response = await axios.post('/maintenance', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new maintenance:", error);
    throw error;
  }
};

// PUT /api/maintenance/:id - Cập nhật maintenance
export const updateMaintenance = async (id, data) => {
  try {
    const response = await axios.put(`/maintenance/${id}`, data);
    return response.data; // Trả về toàn bộ response data thay vì response.data.data
  } catch (error) {
    console.error("Error updating maintenance:", error);
    throw error;
  }
};

// DELETE /api/maintenance/:id - Xóa maintenance (soft delete, yêu cầu reason)
export const deleteMaintenance = async (id, reason) => {
  try {
    const response = await axios.delete(`/maintenance/${id}`, { data: { reason } });
    return response.data; // Trả về toàn bộ response data thay vì response.data.data
  } catch (error) {
    console.error("Error deleting maintenance:", error);
    throw error;
  }
};

// POST /api/maintenance/:id/approve - Phê duyệt maintenance
export const approveMaintenance = async (id, data = {}) => {
  try {
    const response = await axios.post(`/maintenance/${id}/approve`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error approving maintenance:", error);
    throw error;
  }
};

// POST /api/maintenance/:id/reject - Từ chối phê duyệt maintenance
export const rejectMaintenance = async (id, reason) => {
  try {
    const response = await axios.post(`/maintenance/${id}/reject`, { reason });
    return response.data.data;
  } catch (error) {
    console.error("Error rejecting maintenance:", error);
    throw error;
  }
};