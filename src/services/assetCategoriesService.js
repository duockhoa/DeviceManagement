import axios from "./customize-axios";

// Lấy tất cả asset categories
export const getAllAssetCategories = async () => {
  try {
    const response = await axios.get(`/asset-categories`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all asset categories:", error);
    throw error;
  }
};

// Lấy asset category theo ID (bao gồm assets thuộc category đó)
export const getAssetCategoryById = async (id) => {
  try {
    const response = await axios.get(`/asset-categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset category by ID:", error);
    throw error;
  }
};

// Tạo asset category mới
export const createAssetCategory = async (data) => {
  try {
    const response = await axios.post('/asset-categories', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new asset category:", error);
    throw error;
  }
};

// Cập nhật asset category
export const updateAssetCategory = async (id, data) => {
  try {
    const response = await axios.put(`/asset-categories/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating asset category:", error);
    throw error;
  }
};

// Xóa asset category
export const deleteAssetCategory = async (id) => {
  try {
    const response = await axios.delete(`/asset-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset category:", error);
    throw error;
  }
};

// Lấy tất cả assets thuộc một category
export const getAssetsByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/asset-categories/${categoryId}/assets`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching assets by category:", error);
    throw error;
  }
};

