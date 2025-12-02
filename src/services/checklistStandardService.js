import customAxios from './customize-axios';

const checklistStandardService = {
    list: async () => {
        try {
            const response = await customAxios.get('/checklist-templates', {
                params: { is_active: true }
            });
            // Transform API response to match old localStorage format
            return response.data.data.map(template => ({
                id: template.id,
                name: template.template_name,
                description: template.description || '',
                maintenance_type: template.maintenance_type,
                items: (template.items || []).map(item => ({
                    task: item.task_name,
                    name: item.task_name,
                    check_item: item.check_item || '',
                    standard_value: item.standard_value || '',
                    method: item.check_method || '',
                    required: item.is_required || false
                }))
            }));
        } catch (error) {
            console.error('Error loading checklist templates:', error);
            return [];
        }
    },

    create: async (standard) => {
        try {
            const response = await customAxios.post('/checklist-templates', {
                template_name: standard.name || 'Checklist mới',
                description: standard.description || '',
                maintenance_type: standard.maintenance_type || 'all',
                items: (standard.items || []).map((item, idx) => ({
                    task_name: item.task || item.name || '',
                    check_item: item.check_item || '',
                    standard_value: item.standard_value || '',
                    check_method: item.method || '',
                    is_required: item.required !== false,
                    order_index: idx
                }))
            });
            return response.data.data;
        } catch (error) {
            console.error('Error creating checklist template:', error);
            throw error;
        }
    },

    update: async (id, updates) => {
        try {
            await customAxios.put(`/checklist-templates/${id}`, {
                template_name: updates.name,
                description: updates.description,
                maintenance_type: updates.maintenance_type,
                items: (updates.items || []).map((item, idx) => ({
                    task_name: item.task || item.name || '',
                    check_item: item.check_item || '',
                    standard_value: item.standard_value || '',
                    check_method: item.method || '',
                    is_required: item.required !== false,
                    order_index: idx
                }))
            });
        } catch (error) {
            console.error('Error updating checklist template:', error);
            throw error;
        }
    },

    remove: async (id) => {
        try {
            await customAxios.delete(`/checklist-templates/${id}`);
        } catch (error) {
            console.error('Error deleting checklist template:', error);
            throw error;
        }
    },

    // New method: Seed default templates
    seedDefaults: async () => {
        try {
            const response = await customAxios.post('/checklist-templates/seed');
            return response.data;
        } catch (error) {
            console.error('Error seeding default templates:', error);
            throw error;
        }
    }
};

export default checklistStandardService;
