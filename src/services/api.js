import axios from 'axios';

// Base API URL
// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';


// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiry
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/token/refresh/`, {
          refresh: refreshToken
        });
        
        if (response.data.access) {
          localStorage.setItem('token', response.data.access);
          
          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${response.data.access}`;
          return axios(originalRequest);
        }
      } catch (err) {
        // If refresh token is invalid, logout user
        localStorage.removeItem('token');
        localStorage.removeItem('refresh_token');
        // Redirect to login page or dispatch logout action
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Authentication API
export const authService = {
  register: (userData) => api.post('/auth/register/', userData),
  login: (email, password) => {
    return api.post('/token/', { email, password })
      .then(response => {
        const { access, refresh } = response.data;
        localStorage.setItem('token', access);
        localStorage.setItem('refresh_token', refresh);
        return response;
      });
  },
  socialLogin: (provider, accessToken) => api.post('/auth/login/social/', { provider, access_token: accessToken }),
  getCurrentUser: () => api.get('/auth/profile/'),
  updateProfile: (data) => api.patch('/auth/profile/', data),
  getUserLanguages: () => api.get('/auth/profile/languages/'),
  addUserLanguage: (data) => api.post('/auth/profile/languages/', data)
};

// Languages API
export const languageService = {
  getLanguages: () => api.get('/languages/'),
  getLanguageDetails: (code) => api.get(`/languages/${code}/`),
  getLanguageStats: (code) => api.get(`/languages/${code}/stats/`)
};

// Contributions API
export const contributionService = {
  getContributions: (params) => api.get('/contributions/', { params }),
  getMyContributions: () => api.get('/contributions/', { params: { my_contributions: true } }),
  getContributionDetails: (id) => api.get(`/contributions/${id}/`),
  createTextContribution: (data) => api.post('/contributions/text/', data),
  createAudioContribution: (formData) => api.post('/contributions/audio/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  getPendingValidations: () => api.get('/contributions/', { params: { to_validate: true, status: 'pending' } })
};

// Validations API
export const validationService = {
  getValidations: (params) => api.get('/validations/', { params }),
  createValidation: (data) => api.post('/validations/create/', data),
  getValidationDetails: (id) => api.get(`/validations/${id}/`),
  getPendingValidations: () => api.get('/validations/pending/')
};

export default api;