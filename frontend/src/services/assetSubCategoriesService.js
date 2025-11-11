import axios from "./customize-axios";

// GET /api/asset-sub-categories - Lấy tất cả asset sub categories
export const getAllAssetSubCategories = async (categoryId = null) => {
  try {
    const url = categoryId ? `/asset-sub-categories?category_id=${categoryId}` : '/asset-sub-categories';
    const response = await axios.get(url);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching all asset sub categories:", error);
    throw error;
  }
};

// GET /api/asset-sub-categories/:id - Lấy asset sub category theo ID
export const getAssetSubCategoryById = async (id) => {
  try {
    const response = await axios.get(`/asset-sub-categories/${id}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching asset sub category by ID:", error);
    throw error;
  }
};

// GET /api/asset-sub-categories/by-category/:categoryId - Lấy sub categories theo category
export const getSubCategoriesByCategory = async (categoryId) => {
  try {
    const response = await axios.get(`/asset-sub-categories/by-category/${categoryId}`);
    return response.data.data;
  } catch (error) {
    console.error("Error fetching sub categories by category:", error);
    throw error;
  }
};

// POST /api/asset-sub-categories - Tạo asset sub category mới
export const createAssetSubCategory = async (data) => {
  try {
    const response = await axios.post('/asset-sub-categories', data);
    return response.data.data;
  } catch (error) {
    console.error("Error creating new asset sub category:", error);
    throw error;
  }
};

// PUT /api/asset-sub-categories/:id - Cập nhật asset sub category
export const updateAssetSubCategory = async (id, data) => {
  try {
    const response = await axios.put(`/asset-sub-categories/${id}`, data);
    return response.data.data;
  } catch (error) {
    console.error("Error updating asset sub category:", error);
    throw error;
  }
};

// DELETE /api/asset-sub-categories/:id - Xóa asset sub category
export const deleteAssetSubCategory = async (id) => {
  try {
    const response = await axios.delete(`/asset-sub-categories/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting asset sub category:", error);
    throw error;
  }
};