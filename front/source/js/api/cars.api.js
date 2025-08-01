import api from './config.js';

export const getAll = async () => {
    try {
        const res = await api.get('/car/');

        return res.data.cars;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const getSegments = async () => {
    try {
        const res = await api.get('/segment/');

        return res.data.segments;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const getOne = async (id) => {
    try {
        const res = await api.get(`/car/${id}`);

        return res.data.car;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const createOne = async (data) => {
    try {
        const res = await api.post(`/car/`, {data});

        return res.data.car;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const addPhoto = async (id, formData) => {
    try {
        const res = await api.post(`/car/${id}/photo`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data.url;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const addPreview = async (id, formData) => {
    try {
        const res = await api.patch(`/car/${id}/preview`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return res.data.url;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const updateRentalTariffs = async (id, data) => {
    try {
        await api.patch(`/car/${id}/tariff`, {data});
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const updateCountingRule = async (id, data) => {
    try {
        await api.patch(`/car/${id}/rule`, {data});
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const updateOne = async (id, data) => {
    try {
        const res = await api.patch(`/car/${id}`, {data});

        return res.data.car;
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const deletePhoto = async (id, photoId) => {
    try {
        await api.delete(`/car/${id}/photo/${photoId}`);
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};

export const deleteOne = async (id) => {
    try {
        await api.delete(`/car/${id}`);
    } catch (err) {
        console.log(err);
        throw new Error(err.message);
    }
};
