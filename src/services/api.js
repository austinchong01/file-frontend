// src/services/api.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const api = {
  async testConnection() {
    try {
      const response = await fetch(`${BACKEND_URL}/api/test`, {
        method: 'GET',
        credentials: 'include', // session handling
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('API connection test failed:', error);
      return { success: false, error: error.message };
    }
  }
};