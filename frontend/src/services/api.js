import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

// In-memory token storage (NOT localStorage) per security requirements
let inMemoryToken = null;
let onUnauthorizedCallback = null;

export const setApiToken = (token) => {
  inMemoryToken = token;
};

export const getApiToken = () => {
  return inMemoryToken;
};

export const registerUnauthorizedHandler = (callback) => {
  onUnauthorizedCallback = callback;
};

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  timeout: 15000
});

// Request interceptor: attach in-memory Bearer token
apiClient.interceptors.request.use(
  (config) => {
    if (inMemoryToken) {
      config.headers['Authorization'] = `Bearer ${inMemoryToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error extraction and 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    let validationErrors = null;
    const status = error.response ? error.response.status : null;

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

      // Handle 401 Unauthorized cleanly without infinite redirect loops
      if (status === 401) {
        const isAuthEndpoint = error.config && (
          error.config.url.includes('/auth/login') ||
          error.config.url.includes('/auth/register')
        );
        if (!isAuthEndpoint && onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }
    } else if (error.request) {
      errorMessage = 'Could not connect to the backend server. Please verify the Spring Boot service is running.';
    } else if (error.message) {
      errorMessage = error.message;
    }

    const enhancedError = new Error(errorMessage);
    enhancedError.status = status;
    enhancedError.validationErrors = validationErrors;
    enhancedError.rawError = error;
    return Promise.reject(enhancedError);
  }
);

export const AuthService = {
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData);
    return response.data;
  },

  login: async (credentials) => {
    const response = await apiClient.post('/auth/login', credentials);
    return response.data;
  }
};

export const UserService = {
  getProfile: async () => {
    const response = await apiClient.get('/users/me');
    return response.data;
  },

  updateProfile: async (data) => {
    const response = await apiClient.put('/users/me', data);
    return response.data;
  },

  changePassword: async (data) => {
    const response = await apiClient.post('/users/me/change-password', data);
    return response.data;
  }
};

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

export const LearnService = {
  getUserProgress: async () => {
    const response = await apiClient.get('/learn/progress');
    return response.data;
  },

  getTopicProgress: async (topicSlug) => {
    const response = await apiClient.get(`/learn/progress/${topicSlug}`);
    return response.data;
  },

  toggleProgress: async (data) => {
    const response = await apiClient.post('/learn/progress/toggle', data);
    return response.data;
  },

  updatePointProgress: async (learningPointId, data) => {
    const response = await apiClient.put(`/learn/progress/points/${learningPointId}`, data);
    return response.data;
  },

  recordLessonView: async (data) => {
    const response = await apiClient.post('/learn/progress/view', data);
    return response.data;
  }
};

export default apiClient;
