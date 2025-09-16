// src/services/api.js - Updated for JWT authentication
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

console.log('Backend URL:', BACKEND_URL);

// Token management utilities
const TOKEN_KEY = 'jwt_token';

const tokenUtils = {
  // Get token from localStorage
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Store token in localStorage
  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  // Remove token from localStorage
  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  // Get Authorization header with Bearer token
  getAuthHeader() {
    const token = this.getToken();
    return token ? `Bearer ${token}` : null;
  }
};

// Create fetch wrapper with automatic token handling
const authenticatedFetch = async (url, options = {}) => {
  const token = tokenUtils.getToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    }
  };

  // Add Authorization header if token exists
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // Add credentials for cookie-based approach (if you decide to use httpOnly cookies)
  config.credentials = 'include';

  return fetch(url, config);
};

export const api = {
  async testConnection() {
    try {
      const response = await fetch(`${BACKEND_URL}/test`, {
        method: 'GET',
        credentials: 'include',
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
      console.log('Attempting login to:', `${BACKEND_URL}/auth/login`);
      
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
      
      console.log('Login response status:', response.status);
      
      const data = await response.json();
      console.log('Login response data:', data);
      
      // Store JWT token if login successful
      if (data.success && data.token) {
        tokenUtils.setToken(data.token);
        console.log('JWT token stored successfully');
      }
      
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
      
      // Store JWT token if registration successful
      if (data.success && data.token) {
        tokenUtils.setToken(data.token);
        console.log('JWT token stored after registration');
      }
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      return { success: false, message: error.message };
    }
  },

  async dashboard() {
    try {
      console.log('Attempting dashboard request to:', `${BACKEND_URL}/dashboard`);
      
      const response = await authenticatedFetch(`${BACKEND_URL}/dashboard`, {
        method: 'GET'
      });
      
      console.log('Dashboard response status:', response.status);
      
      const data = await response.json();
      console.log('Dashboard response data:', data);
      
      // If authentication failed, remove invalid token
      if (!data.success && (data.message?.includes('Authentication') || data.redirect === '/login')) {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
      return { success: false, message: error.message };
    }
  },

  async download(fileId) {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      // For downloads, we need to handle the redirect properly
      const link = document.createElement('a');
      link.href = `${BACKEND_URL}/files/${fileId}/download`;
      
      // We can't easily add Authorization header to a direct link
      // So we'll use fetch first to get the redirect URL
      const response = await authenticatedFetch(`${BACKEND_URL}/files/${fileId}/download`, {
        method: 'GET'
      });

      if (response.ok) {
        // If it's a redirect, follow it
        if (response.redirected) {
          link.href = response.url;
        }
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return { success: true };
      } else {
        const data = await response.json();
        return { success: false, message: data.message || 'Download failed' };
      }
    } catch (error) {
      console.error('Download failed:', error);
      return { success: false, message: error.message };
    }
  },

  async renameFile(fileId, displayName) {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/files/rename`, {
        method: 'POST',
        body: JSON.stringify({
          fileId: fileId,
          displayName: displayName
        })
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Rename failed:', error);
      return { success: false, message: error.message };
    }
  },

  async deleteFile(fileId) {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/files/${fileId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, message: error.message };
    }
  },

  async upload(file) {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/files/upload`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}` // Manual header for FormData
        },
        body: formData
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, message: error.message };
    }
  },

  async newFolder(folderName) {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/folders/create`, {
        method: 'POST',
        body: JSON.stringify({
          name: folderName,
          parentId: ""
        })
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Create folder failed:', error);
      return { success: false, message: error.message };
    }
  },

  async renameFolder(folderId, name) {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/folders/rename`, {
        method: 'POST',
        body: JSON.stringify({
          folderId: folderId,
          name: name
        })
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Rename failed:', error);
      return { success: false, message: error.message };
    }
  },

  async deleteFolder(folderId) {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/folders/${folderId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, message: error.message };
    }
  },

  async getFolder(folderId) {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/folders/${folderId}`, {
        method: 'GET'
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Get Folder failed:', error);
      return { success: false, message: error.message };
    }
  },

  async uploadFileInFolder(file, folderId) {
    try {
      const token = tokenUtils.getToken();
      if (!token) {
        return { success: false, message: 'No authentication token' };
      }

      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);

      const response = await fetch(`${BACKEND_URL}/files/upload`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${token}` // Manual header for FormData
        },
        body: formData
      });
      
      const data = await response.json();
      
      // Handle authentication failures
      if (!data.success && data.redirect === '/login') {
        tokenUtils.removeToken();
      }
      
      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, message: error.message };
    }
  },

  async logout() {
    try {
      const response = await authenticatedFetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST'
      });
      
      const data = await response.json();
      
      // Always remove token on logout, regardless of server response
      tokenUtils.removeToken();
      
      return data;
    } catch (error) {
      console.error('Logout failed:', error);
      // Still remove token even if server request fails
      tokenUtils.removeToken();
      return { success: false, message: error.message };
    }
  },

  // Utility function to check if user is authenticated
  isAuthenticated() {
    return !!tokenUtils.getToken();
  },

  // Utility function to get current user info from token (if needed)
  getCurrentUser() {
    const token = tokenUtils.getToken();
    if (!token) return null;

    try {
      // Decode JWT payload (note: this doesn't verify signature, just reads data)
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.id,
        email: payload.email,
        name: payload.name
      };
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }
};