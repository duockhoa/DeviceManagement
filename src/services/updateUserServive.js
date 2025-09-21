import axios from './auth-axios';

async function updateUserService(payload) {
    try {
        // Validate payload
        if (!payload || !payload.id) {
            throw new Error('Thông tin người dùng không hợp lệ');
        }

        const response = await axios.put('/user/update', payload);

        // Check response status
        if (response.status === 200) {
            return response;
        } else {
            throw new Error('Cập nhật thông tin thất bại');
        }
    } catch (error) {
        // Handle specific error types
        if (error.response) {
            // Server responded with error status
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            // Request made but no response received
            throw new Error('Không thể kết nối đến server');
        } else {
            // Error setting up request
            throw new Error(error.message || 'Đã xảy ra lỗi khi cập nhật thông tin');
        }
    }
}

export { updateUserService };
