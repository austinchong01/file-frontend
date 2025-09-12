// API base configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Create a configured fetch wrapper
class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method for making requests
  async request(endpoint, options = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseURL}${endpoint}`;
    
    const config = {
      credentials: 'include', // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Remove Content-Type for FormData (file uploads)
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      
      // Handle non-JSON responses (like redirects)
      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Request failed');
        }
        
        return data;
      }
      
      // For non-JSON responses (like successful redirects)
      if (response.ok) {
        return { success: true };
      }
      
      throw new Error('Request failed');
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // GET request
  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  // POST request
  post(endpoint, data) {
    const body = data instanceof FormData ? data : JSON.stringify(data);
    return this.request(endpoint, {
      method: 'POST',
      body,
    });
  }

  // PUT request
  put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  delete(endpoint) {
    return this.request(endpoint, { method: 'DELETE' });
  }
}

// Create and export a singleton instance
export const api = new ApiService();

// Specific API endpoints
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const filesAPI = {
  upload: (formData) => api.post('/files/upload', formData),
  download: (fileId) => `${API_BASE_URL}/files/${fileId}/download`,
  delete: (fileId) => api.delete(`/files/${fileId}`),
  rename: (fileId, displayName) => api.post('/files/rename', { fileId, displayName }),
};

export const foldersAPI = {
  create: (name, parentId = null) => api.post('/folders/create', { name, parentId }),
  get: (folderId) => api.get(`/folders/${folderId}`),
  rename: (folderId, name) => api.post('/folders/rename', { folderId, name }),
  delete: (folderId) => api.delete(`/folders/${folderId}`),
};

export const dashboardAPI = {
  getData: () => api.get('/dashboard'),
};