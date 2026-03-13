import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from './baseUrl';

const axiosInstanceFile = axios.create({
    baseURL: API_BASE_URL,
    timeout: 30000,
    responseType: 'blob',
});

axiosInstanceFile.interceptors.request.use(
    async (config) => {
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

export default axiosInstanceFile;
