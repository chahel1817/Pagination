import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getProducts = async (limit = 20, category = '', cursorCreatedAt = null, cursorId = null) => {
  try {
    const params = { limit };
    
    if (category && category !== 'All') {
      params.category = category;
    }
    
    if (cursorCreatedAt && cursorId) {
      params.cursorCreatedAt = cursorCreatedAt;
      params.cursorId = cursorId;
    }

    const response = await axios.get(`${API_BASE_URL}/products`, { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};