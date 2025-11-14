import axios from "./customize-axios";

// GET /api/calibration - Lấy tất cả calibration records
export const getAllCalibrations = async () => {
  try {
    const response = await axios.get(`/calibration`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all calibrations:", error);
    throw error;
  }
};

// GET /api/calibration/:id - Lấy calibration theo ID
export const getCalibrationById = async (id) => {
  try {
    const response = await axios.get(`/calibration/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching calibration by ID:", error);
    throw error;
  }
};

// GET /api/calibration/asset/:assetId - Lấy calibration theo asset
export const getCalibrationsByAsset = async (assetId) => {
  try {
    const response = await axios.get(`/calibration/by-asset/${assetId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching calibrations by asset:", error);
    throw error;
  }
};

// GET /api/calibration/status/:status - Lấy calibration theo status
export const getCalibrationsByStatus = async (status) => {
  try {
    const response = await axios.get(`/calibration/by-status/${status}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching calibrations by status:", error);
    throw error;
  }
};

// GET /api/calibration/technician/:technicianId - Lấy calibration theo technician
export const getCalibrationsByTechnician = async (technicianId) => {
  try {
    const response = await axios.get(`/calibration/by-technician/${technicianId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching calibrations by technician:", error);
    throw error;
  }
};

// POST /api/calibration - Tạo calibration mới
export const createCalibration = async (data) => {
  try {
    const response = await axios.post('/calibration', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new calibration:", error);
    throw error;
  }
};

// PUT /api/calibration/:id - Cập nhật calibration
export const updateCalibration = async (id, data) => {
  try {
    const url = `/calibration/${id}`;
    
    const response = await axios.put(url, data);
    return response.data.data; // Return nested data structure
  } catch (error) {
    console.error("Error updating calibration:", error);
    throw error;
  }
};

// DELETE /api/calibration/:id - Xóa calibration
export const deleteCalibration = async (id) => {
  try {
    const response = await axios.delete(`/calibration/${id}`);
    return response.data; // Trả về toàn bộ response data thay vì response.data.data
  } catch (error) {
    console.error("Error deleting calibration:", error);
    throw error;
  }
};