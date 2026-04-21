// client/src/api/axios.js
import axios from 'axios';

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || '/api';
export const API_ORIGIN =
  import.meta.env.VITE_API_ORIGIN ||
  (typeof window !== 'undefined' ? window.location.origin : '');

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,  // cookies bhejne ke liye — refresh token ke liye zaroori
});

// --------------------------------
// REQUEST INTERCEPTOR
// --------------------------------
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --------------------------------
// RESPONSE INTERCEPTOR
// --------------------------------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    // agar 401 aaya aur pehle retry nahi ki
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh'
    ) {
      originalRequest._retry = true;

      try {
        // new access token 
        const res = await api.post('/auth/refresh');
        const newAccessToken = res.data.accessToken;

        // localStorage update 
        localStorage.setItem('accessToken', newAccessToken);

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (err) {

     
        localStorage.removeItem('accessToken');
        window.location.assign('/login');
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
