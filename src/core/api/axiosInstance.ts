import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './baseUrl';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    async (config) => {
        if (__DEV__) {
            const requestUrl = `${config.baseURL || ''}${config.url || ''}`;
            console.log(`[API] ${config.method?.toUpperCase()} ${requestUrl}`);
        }
        const token = await AsyncStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (__DEV__) {
            const failedUrl = `${error?.config?.baseURL || ''}${error?.config?.url || ''}`;
            console.log('[API ERROR]', failedUrl, error?.message);
        }
        if (error.response?.status === 401) {
            AsyncStorage.removeItem('token');
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
