import customAxios from './customize-axios';

const checklistTemplateService = {
    // Lấy danh sách mẫu checklist
    getAllTemplates: (params) => {
        return customAxios.get('/checklist-templates', { params });
    },

    // Lấy chi tiết mẫu
    getTemplateById: (id) => {
        return customAxios.get(`/checklist-templates/${id}`);
    },

    // Tạo mẫu mới
    createTemplate: (data) => {
        return customAxios.post('/checklist-templates', data);
    },

    // Cập nhật mẫu
    updateTemplate: (id, data) => {
        return customAxios.put(`/checklist-templates/${id}`, data);
    },

    // Xóa mẫu
    deleteTemplate: (id) => {
        return customAxios.delete(`/checklist-templates/${id}`);
    },

    // Tạo 4 mẫu mặc định
    seedDefaultTemplates: () => {
        return customAxios.post('/checklist-templates/seed');
    }
};

export default checklistTemplateService;
