import authAxios from './auth-axios';
import deviceAxios from './customize-axios';
import Cookies from 'js-cookie';

async function getUserService(id) {
    try {
        const id = Cookies.get('id');
        const response = await authAxios.get(`/users/${id}`);
        return response;
    } catch (error) {
        console.error('Error fetching user data:', error);
        throw error; // Rethrow the error to handle it in the calling function
    }
}

async function getAllUsersService() {
    try {
        const response = await authAxios.get('/users');
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy danh sách người dùng');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách người dùng');
        }
    }
}

async function changePasswordService(data) {
    try {
        const id = Cookies.get('id');
        const response = await authAxios.put(`/users/${id}/password`, data);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể thay đổi mật khẩu');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.error || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi thay đổi mật khẩu');
        }
    }
}

async function updateAvatarService(payload) {
    try {
        // Kiểm tra payload
        if (!payload || !payload.get('avatar')) {
            throw new Error('Không tìm thấy file ảnh');
        }
        const id = Cookies.get('id');

        const response = await authAxios.put(`/users/${id}/avatar`, payload, {
            headers: {
                // Sửa Headers thành headers
                'Content-Type': 'multipart/form-data',
            },
        });

        // Kiểm tra response
        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Cập nhật avatar thất bại');
        }
    } catch (error) {
        // Xử lý các loại lỗi cụ thể
        if (error.response) {
            // Lỗi từ server
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            // Lỗi không nhận được response
            throw new Error('Không thể kết nối đến server');
        } else {
            // Lỗi khi set up request
            throw new Error(error.message || 'Đã xảy ra lỗi khi tải ảnh lên');
        }
    }
}

// Lấy danh sách nhân viên kỹ thuật cơ điện (để gán vào bảo trì)
async function getMechanicalElectricalTechniciansService() {
    try {
        const response = await deviceAxios.get('/departments/mechanical-electrical/technicians');
        if (response.status === 200) {
            return response.data.data;
        } else {
            throw new Error('Không thể lấy danh sách kỹ thuật viên cơ điện');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách kỹ thuật viên');
        }
    }
}

export { 
    getAllUsersService, 
    changePasswordService, 
    getUserService, 
    updateAvatarService,
    getMechanicalElectricalTechniciansService 
};
