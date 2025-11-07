import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

/**
 * Get all waifus
 * @param {boolean|null} isActive - If true, get only active waifus. If false, get only inactive. If null/undefined, get all.
 */
export const getAllWaifus = async (isActive = true) => {
  try {
    const params = {};
    
    // Only add isActive parameter if it's explicitly true or false
    if (isActive !== null && isActive !== undefined) {
      params.isActive = isActive;
    }
    
    const response = await axios.get(`${API_URL}/waifus`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching waifus:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get waifu by ID
 */
export const getWaifuById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/waifus/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching waifu:', error);
    throw error.response?.data || error;
  }
};

/**
 * Create new waifu (Admin only)
 */
export const createWaifu = async (waifuData, token) => {
  try {
    const response = await axios.post(`${API_URL}/waifus`, waifuData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error creating waifu:', error);
    throw error.response?.data || error;
  }
};

/**
 * Update waifu (Admin only)
 */
export const updateWaifu = async (id, waifuData, token) => {
  try {
    const response = await axios.put(`${API_URL}/waifus/${id}`, waifuData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error updating waifu:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete waifu (Admin only)
 */
export const deleteWaifu = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/waifus/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting waifu:', error);
    throw error.response?.data || error;
  }
};

/**
 * Upload emotion image (Admin only)
 */
export const uploadEmotionImage = async (waifuId, emotion, imageFile, token) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    
    const response = await axios.post(
      `${API_URL}/waifus/${waifuId}/emotions/${emotion}/upload`,
      formData,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading emotion image:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get waifu image URL
 */
export const getWaifuImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL, return it
  if (imageUrl.startsWith('http')) return imageUrl;
  
  // Otherwise, construct the full URL
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  return `${baseUrl}${imageUrl}`;
};
