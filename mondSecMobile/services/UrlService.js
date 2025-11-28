import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UrlService = axios.create({

    baseURL: 'http://192.168.15.116:8000/api',
  timeout: 10000,
});

UrlService.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default UrlService;
