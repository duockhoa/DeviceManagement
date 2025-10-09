import axios from "./customize-axios";

export const getAllAssets = async () => {
  try {
    const response = await axios.get(`/assets`);
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all assets:", error);
    throw error;
  }
};

export const getAssetById = async (id) => {
  try {
    const response = await axios.get(`/assets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    throw error;
  }
};

export const createNewAsset = async (data) => {
  try {
    const response = await axios.post('/assets', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new asset:", error);
    throw error;
  }
};

export const updateAsset = async (id, data) => {
  try {
    const response = await axios.put(`/assets/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
};

export const deleteAsset = async (id) => {
  try {
    const response = await axios.delete(`/assets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};

// Thêm các methods mới theo API đã cập nhật
export const getAssetsByArea = async (areaId) => {
  try {
    const response = await axios.get(`/assets/by-area/${areaId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by area:", error);
    throw error;
  }
};

export const getAssetsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/assets/by-category/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by category:", error);
    throw error;
  }
};

export const getAssetsByDepartment = async (departmentName) => {
  try {
    const response = await axios.get(`/assets/by-department/${departmentName}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by department:", error);
    throw error;
  }
};

export const searchAssets = async (params) => {
  try {
    const response = await axios.get('/assets/search', { params });
    return response.data.data;
  } catch (error) {
    console.error("Error searching assets:", error);
    throw error;
  }
};

export const getAssetByCode = async (assetCode) => {
  try {
    const response = await axios.get(`/assets/by-code/${assetCode}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset by code:", error);
    throw error;
  }
};

