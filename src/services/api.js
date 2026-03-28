// services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Translation API
export const translateSign = async (imageData) => {
  try {
    const response = await api.post('/translate', { image: imageData });
    return response.data;
  } catch (error) {
    console.error('Translation error:', error);
    throw error;
  }
};

// Quiz APIs
export const getFlashcards = async () => {
  try {
    const response = await api.get('/flashcards');
    return response.data;
  } catch (error) {
    console.error('Error fetching flashcards:', error);
    throw error;
  }
};

export const submitQuizResult = async (resultData) => {
  try {
    const response = await api.post('/quiz/results', resultData);
    return response.data;
  } catch (error) {
    console.error('Error submitting quiz result:', error);
    throw error;
  }
};

// User APIs
export const getUserProfile = async () => {
  try {
    const response = await api.get('/user/profile');
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProgress = async (progressData) => {
  try {
    const response = await api.put('/user/progress', progressData);
    return response.data;
  } catch (error) {
    console.error('Error updating progress:', error);
    throw error;
  }
};

export default api;