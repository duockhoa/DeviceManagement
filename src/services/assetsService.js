import axios from "./customize-axios";

// GET /api/assets - Lấy tất cả assets
export const getAllAssets = async () => {
  try {
    const response = await axios.get(`/assets`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all assets:", error);
    throw error;
  }
};

// GET /api/assets/:id - Lấy asset theo ID
export const getAssetById = async (id) => {
  try {
    const response = await axios.get(`/assets/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    throw error;
  }
};

// GET /api/assets/by-code/:assetCode - Lấy asset theo asset code
export const getAssetByCode = async (assetCode) => {
  try {
    const response = await axios.get(`/assets/by-code/${assetCode}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset by code:", error);
    throw error;
  }
};

export const getAssetByDkCode = async (dkCode) => {
  try {
    const response = await axios.get(`/assets/by-dk/${dkCode}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset by DK code:", error);
    throw error;
  }
};

// GET /api/assets/by-area/:areaId - Lấy assets theo area
export const getAssetsByArea = async (areaId) => {
  try {
    const response = await axios.get(`/assets/by-area/${areaId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by area:", error);
    throw error;
  }
};

// GET /api/assets/by-sub-category/:subCategoryId - Lấy assets theo sub category (MỚI)
export const getAssetsBySubCategory = async (subCategoryId) => {
  try {
    const response = await axios.get(`/assets/by-sub-category/${subCategoryId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by sub category:", error);
    throw error;
  }
};

// GET /api/assets/by-category/:categoryId - Lấy assets theo category (LOGIC MỚI)
export const getAssetsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/assets/by-category/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by category:", error);
    throw error;
  }
};

// GET /api/assets/by-department/:departmentName - Lấy assets theo department
export const getAssetsByDepartment = async (departmentName) => {
  try {
    const response = await axios.get(`/assets/by-department/${departmentName}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by department:", error);
    throw error;
  }
};

// GET /api/assets/search - Tìm kiếm assets
export const searchAssets = async (params = {}) => {
  try {
    const queryString = new URLSearchParams(params).toString();
    const response = await axios.get(`/assets/search?${queryString}`);
    return response.data.data;
  } catch (error) {
    console.error("Error searching assets:", error);
    throw error;
  }
};

// POST /api/assets - Tạo asset mới
export const createAsset = async (data) => {
  try {
    const response = await axios.post('/assets', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new asset:", error);
    throw error;
  }
};

// PUT /api/assets/:id - Cập nhật asset
export const updateAsset = async (id, data) => {
  try {
    const response = await axios.put(`/assets/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating asset:", error);
    throw error;
  }
};

// DELETE /api/assets/:id - Xóa asset
export const deleteAsset = async (id) => {
  try {
    const response = await axios.delete(`/assets/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset:", error);
    throw error;
  }
};

// GET /api/assets/:id/consumables - Lấy vật tư tiêu hao của asset
export const getAssetConsumables = async (assetId) => {
  try {
    const response = await axios.get(`/assets/${assetId}/consumables`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset consumables:", error);
    throw error;
  }
};
