import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Response interceptor for centralized error extraction
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let validationErrors = null;

    if (error.response) {
      const data = error.response.data;
      if (data) {
        if (data.validationErrors) {
          validationErrors = data.validationErrors;
          errorMessage = data.message || 'Please correct the validation errors.';
        } else if (data.message) {
          errorMessage = data.message;
        } else if (typeof data === 'string') {
          errorMessage = data;
        }
      }
    } else if (error.request) {
      errorMessage = 'Could not connect to the backend server. Please verify the Spring Boot service is running.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = error.response ? error.response.status : null;
    enhancedError.validationErrors = validationErrors;
    enhancedError.rawError = error;
    return Promise.reject(enhancedError);
  }
);

export const MistakeService = {
  getMistakes: async (params = {}) => {
    const response = await apiClient.get('/mistakes', { params });
    return response.data;
  },

  getMistakeById: async (id) => {
    const response = await apiClient.get(`/mistakes/${id}`);
    return response.data;
  },

  createMistake: async (data) => {
    const response = await apiClient.post('/mistakes', data);
    return response.data;
  },

  updateMistake: async (id, data) => {
    const response = await apiClient.put(`/mistakes/${id}`, data);
    return response.data;
  },

  deleteMistake: async (id) => {
    const response = await apiClient.delete(`/mistakes/${id}`);
    return response.data;
  },

  updateReview: async (id, reviewData) => {
    const response = await apiClient.patch(`/mistakes/${id}/review`, reviewData);
    return response.data;
  }
};

export const DashboardService = {
  getStats: async () => {
    const response = await apiClient.get('/dashboard/stats');
    return response.data;
  },

  getMistakesByType: async () => {
    const response = await apiClient.get('/dashboard/mistakes-by-type');
    return response.data;
  },

  getMistakesOverTime: async (days = 14) => {
    const response = await apiClient.get('/dashboard/mistakes-over-time', {
      params: { days }
    });
    return response.data;
  },

  getMistakesByTopic: async () => {
    const response = await apiClient.get('/dashboard/mistakes-by-topic');
    return response.data;
  }
};

export default apiClient;
