import api from './config.js';

export const authCheck = async () => {
    try {
        await api.get('/auth/check');
        return true;
    } catch (err) {
        console.log(err);
        return false;
    }
};

export const login = async (email, password) => {
    try {
        const res = await api.post('/auth/login', {
            nickname: email,
            pass: password,
        });

        return res.data.token;
    } catch (err) {
        console.log(err);
        throw new Error('Bad auth data');
    }
};
