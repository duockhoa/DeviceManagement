import axios from './customize-axios';

async function getCommentsByRequestIdService(requestId) {
    try {
        const response = await axios.get(`/comment/getbyrequestid/${requestId}`);
        if (response.status === 200) {
            return response.data.result;
        } else {
            throw new Error('Không thể lấy danh sách bình luận');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi lấy danh sách bình luận');
        }
    }
}

async function createCommentService(payload) {
    try {
        const response = await axios.post('/comment/create', payload, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        if (response.status === 201) {
            return response.data.result;
        } else {
            throw new Error('Không thể tạo bình luận');
        }
    } catch (error) {
        if (error.response) {
            throw new Error(error.response.data.message || 'Lỗi từ server');
        } else if (error.request) {
            throw new Error('Không thể kết nối đến server');
        } else {
            throw new Error(error.message || 'Đã xảy ra lỗi khi tạo bình luận');
        }
    }
}

export { getCommentsByRequestIdService, createCommentService };
