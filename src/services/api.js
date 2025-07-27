const API_BASE_URL = 'http://localhost:3001/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  getHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Request failed');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  }

  // Authentication
  async login(username, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  // Projects
  async getProjects() {
    return this.request('/projects');
  }

  async getProject(projectId) {
    return this.request(`/projects/${projectId}`);
  }

  async createProject(projectData) {
    return this.request('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  }

  async updateProjectStatus(projectId, status) {
    return this.request(`/projects/${projectId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Project Assignments
  async getProjectAssignments(projectId) {
    return this.request(`/projects/${projectId}/assignments`);
  }

  async assignUserToProject(projectId, userId) {
    return this.request(`/projects/${projectId}/assignments`, {
      method: 'POST',
      body: JSON.stringify({ userId }),
    });
  }

  async removeUserFromProject(projectId, userId) {
    return this.request(`/projects/${projectId}/assignments/${userId}`, {
      method: 'DELETE',
    });
  }

  // Documents
  async getProjectDocuments(projectId) {
    return this.request(`/projects/${projectId}/documents`);
  }

  async uploadDocument(projectId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await fetch(`${this.baseURL}/projects/${projectId}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  }

  async deleteDocument(documentId) {
    return this.request(`/documents/${documentId}`, {
      method: 'DELETE',
    });
  }

  // Users
  async getUsers() {
    return this.request('/users');
  }

  async createUser(userData) {
    return this.request('/users', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getAvailableUsers() {
    return this.request('/users/available');
  }

  // File download
  getFileUrl(filename) {
    return `${this.baseURL.replace('/api', '')}/uploads/${filename}`;
  }
}

export default new ApiService(); 