// src/services/api.js
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

export const api = {
    async testConnection() {
        try {
        const response = await fetch(`${BACKEND_URL}/test`, {
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
  },

  async login(email, password) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      return { success: false, message: error.message };
    }
  },

  async register(name, email, password, password2) {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          password2: password2
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message };
    }
  }

};