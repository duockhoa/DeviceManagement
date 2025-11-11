import axios from "./customize-axios";

// GET /api/plants - Lấy tất cả plants
export const getAllPlants = async () => {
  try {
    const response = await axios.get(`/plants`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all plants:", error);
    throw error;
  }
};

// GET /api/plants/:id - Lấy plant theo ID
export const getPlantById = async (id) => {
  try {
    const response = await axios.get(`/plants/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching plant by ID:", error);
    throw error;
  }
};

// GET /api/plants/by-code/:code - Lấy plant theo code
export const getPlantByCode = async (code) => {
  try {
    const response = await axios.get(`/plants/by-code/${code}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching plant by code:", error);
    throw error;
  }
};

// GET /api/plants/:id/areas - Lấy tất cả areas thuộc plant
export const getAreasByPlant = async (plantId) => {
  try {
    const response = await axios.get(`/plants/${plantId}/areas`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching areas by plant:", error);
    throw error;
  }
};

// POST /api/plants - Tạo plant mới
export const createPlant = async (data) => {
  try {
    const response = await axios.post('/plants', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new plant:", error);
    throw error;
  }
};

// PUT /api/plants/:id - Cập nhật plant
export const updatePlant = async (id, data) => {
  try {
    const response = await axios.put(`/plants/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating plant:", error);
    throw error;
  }
};

// DELETE /api/plants/:id - Xóa plant
export const deletePlant = async (id) => {
  try {
    const response = await axios.delete(`/plants/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting plant:", error);
    throw error;
  }
};