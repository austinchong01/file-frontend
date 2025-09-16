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
  },

  async dashboard() {
    try {
      const response = await fetch(`${BACKEND_URL}/dashboard`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Dashboard fetch failed:', error);
      return { success: false, message: error.message };
    }
  },

  async download(fileId) {
    try {
      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = `${BACKEND_URL}/files/${fileId}/download`;
      link.target = '_blank'; // Open in new tab to avoid navigation issues
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { success: true };
    } catch (error) {
      console.error('Download failed:', error);
      return { success: false, message: error.message };
    }
  },

  async renameFile(fileId, displayName) {
    try {
      const response = await fetch(`${BACKEND_URL}/files/rename`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fileId: fileId,
          displayName: displayName
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Rename failed:', error);
      return { success: false, message: error.message };
    }
  },

  async deleteFile(fileId) {
    try {
      const response = await fetch(`${BACKEND_URL}/files/${fileId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, message: error.message };
    }
  },

  async upload(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${BACKEND_URL}/files/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, message: error.message };
    }
  },

  async newFolder(folderName){
    try {
      const response = await fetch(`${BACKEND_URL}/folders/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: folderName,
          parentId: ""
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Create folder failed:', error);
      return { success: false, message: error.message };
    }
  },

  async renameFolder(folderId, name) {
    try {
      const response = await fetch(`${BACKEND_URL}/folders/rename`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          folderId: folderId,
          name: name
        })
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Rename failed:', error);
      return { success: false, message: error.message };
    }
  },

  async deleteFolder(folderId) {
    try {
      const response = await fetch(`${BACKEND_URL}/folders/${folderId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Delete failed:', error);
      return { success: false, message: error.message };
    }
  },

  async getFolder(folderId) {
    try {
      const response = await fetch(`${BACKEND_URL}/folders/${folderId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Get Folder failed:', error);
      return { success: false, message: error.message };
    }
  },

  async uploadFileInFolder(file, folderId) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folderId', folderId);

      const response = await fetch(`${BACKEND_URL}/files/upload`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return { success: false, message: error.message };
    }
  },

  async logout() {
    try {
      const response = await fetch(`${BACKEND_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Logout failed:', error);
      return { success: false, message: error.message };
    }
  },

};