import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_ENDPOINTS } from '../../constants';

// Simple error type
interface ApiError {
  message: string;
  status?: number;
  details?: any;
  timestamp?: string;
}

// Create base axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_ENDPOINTS.BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Add request timestamp
    (config as any).metadata = { startTime: new Date() };
    
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    const { config } = response;
    const duration = (config as any).metadata ? 
      new Date().getTime() - (config as any).metadata.startTime.getTime() : 0;
    
    console.log(
      `✅ API Response: ${config.method?.toUpperCase()} ${config.url} (${duration}ms)`
    );
    
    return response;
  },
  (error) => {
    const { config, response } = error;
    const duration = (config as any)?.metadata ? 
      new Date().getTime() - (config as any).metadata.startTime.getTime() : 0;
    
    console.error(
      `❌ API Error: ${config?.method?.toUpperCase()} ${config?.url} (${duration}ms)`,
      response?.data || error.message
    );

    // Transform error to our ApiError format
    const apiError: ApiError = {
      message: response?.data?.message || error.message || 'Unknown error',
      status: response?.status,
      details: response?.data,
      timestamp: new Date().toISOString(),
    };

    return Promise.reject(apiError);
  }
);

export default apiClient;
