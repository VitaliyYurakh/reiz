import axios from 'axios';

export const PROD = 'https://reiz.com.ua/';
export const DEV = 'http://localhost:3000/';

const api = axios.create({
    baseURL: PROD + 'api',
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
