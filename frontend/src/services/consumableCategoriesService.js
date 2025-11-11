import axios from "./customize-axios";

// GET /api/consumable-categories - Lấy tất cả danh mục vật tư
export const getAllConsumableCategories = async (params = {}) => {
  try {
    const response = await axios.get(`/consumable-categories`, { params });
    console.log(response.data.data);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all consumable categories:", error);
    throw error;
  }
};

// GET /api/consumable-categories?type=consumable - Lấy chỉ vật tư tiêu hao
export const getConsumableCategories = async () => {
  try {
    const response = await axios.get(`/consumable-categories?type=consumable`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching consumable categories:", error);
    throw error;
  }
};

// GET /api/consumable-categories?type=component - Lấy chỉ linh kiện phụ tùng
export const getComponentCategories = async () => {
  try {
    const response = await axios.get(`/consumable-categories?type=component`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching component categories:", error);
    throw error;
  }
};

// GET /api/consumable-categories?is_active=true - Lấy danh mục đang hoạt động
export const getActiveConsumableCategories = async () => {
  try {
    const response = await axios.get(`/consumable-categories?is_active=true`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching active consumable categories:", error);
    throw error;
  }
};

// GET /api/consumable-categories/:id - Lấy danh mục theo ID
export const getConsumableCategoryById = async (id) => {
  try {
    const response = await axios.get(`/consumable-categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching consumable category by ID:", error);
    throw error;
  }
};

// POST /api/consumable-categories - Tạo danh mục mới
export const createConsumableCategory = async (data) => {
  try {
    const response = await axios.post('/consumable-categories', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new consumable category:", error);
    throw error;
  }
};

// PUT /api/consumable-categories/:id - Cập nhật danh mục
export const updateConsumableCategory = async (id, data) => {
  try {
    const response = await axios.put(`/consumable-categories/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating consumable category:", error);
    throw error;
  }
};

// DELETE /api/consumable-categories/:id - Xóa danh mục
export const deleteConsumableCategory = async (id) => {
  try {
    const response = await axios.delete(`/consumable-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting consumable category:", error);
    throw error;
  }
};

// Utility functions for filtering
export const filterByType = async (type) => {
  try {
    const response = await axios.get(`/consumable-categories?type=${type}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${type} categories:`, error);
    throw error;
  }
};

export const filterByStatus = async (isActive) => {
  try {
    const response = await axios.get(`/consumable-categories?is_active=${isActive}`);
    return response.data.data;
  } catch (error) {
    console.error(`Error fetching ${isActive ? 'active' : 'inactive'} categories:`, error);
    throw error;
  }
};

// Combined filter function
export const getConsumableCategoriesWithFilters = async (filters = {}) => {
  try {
    const params = new URLSearchParams();
    
    if (filters.type) {
      params.append('type', filters.type);
    }
    
    if (filters.is_active !== undefined) {
      params.append('is_active', filters.is_active);
    }
    
    const response = await axios.get(`/consumable-categories?${params.toString()}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching filtered consumable categories:", error);
    throw error;
  }
};