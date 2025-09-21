import axios from './auth-axios';
import Cookies from 'js-cookie';
async function logoutService(payload) {
    Cookies.remove('accessToken', {
        domain: process.env.REACT_APP_DOMAIN,
    });
    Cookies.remove('refreshToken', {
        domain: process.env.REACT_APP_DOMAIN,
    });
    Cookies.remove('id', {
        domain: process.env.REACT_APP_DOMAIN,
    });
    try {
        const response = await axios.delete('/auth/logout', {
            data: payload,
        });

        // Check response status
        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Đăng xuất thất bại');
        }
    } catch (error) {
        console.log(error);
    }
}

export { logoutService };
