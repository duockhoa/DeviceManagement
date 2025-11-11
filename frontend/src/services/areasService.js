import axios from "./customize-axios";

// GET /api/areas - Lấy tất cả areas
export const getAllAreas = async () => {
  try {
    const response = await axios.get(`/areas`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all areas:", error);
    throw error;
  }
};

// GET /api/areas/:id - Lấy area theo ID
export const getAreaById = async (id) => {
  try {
    const response = await axios.get(`/areas/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching area by ID:", error);
    throw error;
  }
};

// GET /api/areas/by-plant/:plantId - Lấy areas theo plant
export const getAreasByPlant = async (plantId) => {
  try {
    const response = await axios.get(`/areas/by-plant/${plantId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching areas by plant:", error);
    throw error;
  }
};

// GET /api/areas/:id/assets - Lấy tất cả assets thuộc area (thay đổi từ positions)
export const getAssetsByArea = async (areaId) => {
  try {
    const response = await axios.get(`/areas/${areaId}/assets`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by area:", error);
    throw error;
  }
};

// POST /api/areas - Tạo area mới
export const createArea = async (data) => {
  try {
    const response = await axios.post('/areas', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new area:", error);
    throw error;
  }
};

// PUT /api/areas/:id - Cập nhật area
export const updateArea = async (id, data) => {
  try {
    const response = await axios.put(`/areas/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating area:", error);
    throw error;
  }
};

// DELETE /api/areas/:id - Xóa area
export const deleteArea = async (id) => {
  try {
    const response = await axios.delete(`/areas/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting area:", error);
    throw error;
  }
};