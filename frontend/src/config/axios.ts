import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Important for handling cookies/session
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // You can add auth tokens or other headers here if needed
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    return Promise.reject(error);
  }
);

// Add response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle common error cases
    if (error.response?.status === 401) {
      // Handle unauthorized access
      window.location.href = '/login';
    }
    if (error.response?.status === 403) {
      // Handle forbidden access
      console.error('Access forbidden');
    }
    return Promise.reject(error);
  }
);

export { axiosInstance };
