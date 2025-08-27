import axios from 'axios';

const PROD = 'https://reiz.com.ua/';
const DEV = 'http://localhost:3000/';

export const BASE_URL = PROD;

const api = axios.create({
    baseURL: BASE_URL + 'api',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default api;
