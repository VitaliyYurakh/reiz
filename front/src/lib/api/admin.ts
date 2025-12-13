import axios from 'axios';
import {Car, Segment} from "@/types/cars";
import {API_URL} from "@/config/environment";

const adminApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

adminApi.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

export const checkAuthReq = async (): Promise<boolean> => {
    try {
        await adminApi.get('/auth/check');
        return true;
    } catch (error) {
        return false;
    }
}

export const getAllCars = async (): Promise<{cars: Car[]}> => {
    const res = await adminApi.get('/car'); // Подставьте ваш реальный endpoint
    return res.data;
};

export const getOneCar = async (id: string): Promise<Car> => {
    const res = await adminApi.get(`/car/${id}`);
    return res.data.car;
};

export const createCar = async (data: Partial<Car> = {}): Promise<Car> => {
    const res = await adminApi.post('/car', {data});
    return res.data.car;
};

export const updateCar = async (id: number, data: Partial<Car>): Promise<Car> => {
    const res = await adminApi.patch(`/car/${id}`, {data});
    return res.data;
};

export const deleteCar = async (id: number): Promise<void> => {
    await adminApi.delete(`/car/${id}`);
};

export const getSegments = async (): Promise<Segment[]> => {
    const res = await adminApi.get('/segment');
    return res.data.segments;
};

// Фото API
export const addPhoto = async (id: number, formData: FormData) => {
    return adminApi.post(`/car/${id}/photo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const deletePhoto = async (carId: number, photoId: number) => {
    return adminApi.delete(`/car/${carId}/photo/${photoId}`);
};

export const updatePhoto = async (carId: number, data: { photoId: number; alt: string }) => {
    return adminApi.patch(`/car/${carId}/photo`, data);
};

export const addPreview = async (id: number, formData: FormData) => {
    return adminApi.patch(`/car/${id}/preview`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
};

export const updateRentalTariffs = async (id: number, tariffs: any[]) => {
    return adminApi.patch(`/car/${id}/tariff`, {data: tariffs});
};


export default adminApi;
