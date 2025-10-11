import axios from 'axios';
import Cookies from 'js-cookie';

const domain = process.env.REACT_APP_DOMAIN;

const cookieOptions = {
    domain: domain,
    secure: window.location.protocol === 'https:',
    sameSite: 'lax',
    path: '/',
    expires: 70,
};

const instance = axios.create({
    baseURL: process.env.REACT_APP_AUTH_URL,
    timeout: 12000,
    headers: { 'X-Custom-Header': 'foobar' },
});

instance.interceptors.request.use(
    async (config) => {
        const token = Cookies.get('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    },
);

instance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        if (error.response && error.response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = Cookies.get('refreshToken');
            if (refreshToken) {
                try {
                    const refreshInstance = axios.create({
                        baseURL: process.env.REACT_APP_AUTH_URL,
                        timeout: 12000,
                    });
                    const response = await refreshInstance.post('/auth/refreshtoken', { refreshToken });
                    const newAccessToken = response.data.accessToken;
                    Cookies.set('accessToken', newAccessToken, cookieOptions);
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return instance(originalRequest);
                } catch (refreshError) {
                    Cookies.remove('accessToken', { domain: domain, path: '/' });
                    Cookies.remove('refreshToken', { domain: domain, path: '/' });
                    Cookies.remove('id', { domain: domain, path: '/' });
                    window.location.href = process.env.REACT_APP_FRONTEND_ROOT_URL + '/login'; // Chuyển hướng đến trang đăng nhập
                    return Promise.reject(refreshError);
                }
            } else {
                // Không có refresh token
                Cookies.remove('accessToken', { domain: domain, path: '/' });
                Cookies.remove('refreshToken', { domain: domain, path: '/' });
                Cookies.remove('id', { domain: domain, path: '/' });
                window.location.href = process.env.REACT_APP_FRONTEND_ROOT_URL + '/login';
            }
        }
        return Promise.reject(error);
    },
);

export default instance;
