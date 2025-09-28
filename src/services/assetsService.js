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

