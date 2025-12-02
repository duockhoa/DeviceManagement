import customAxios from './customize-axios';

const handoversService = {
    list: async () => {
        const response = await customAxios.get('/handovers');
        return response.data.data || [];
    },
    
    create: async (payload) => {
        const response = await customAxios.post('/handovers', payload);
        return response.data.data;
    },
    
    accept: async (id) => {
        await customAxios.post(`/handovers/${id}/accept`);
    },
    
    addFollowUpRecord: async (id, followUpData) => {
        const response = await customAxios.post(`/handovers/${id}/follow-up`, followUpData);
        return response.data.data;
    },
    
    closeHandover: async (id, closeReason) => {
        await customAxios.post(`/handovers/${id}/close`, { closeReason });
    }
};

export default handoversService;
