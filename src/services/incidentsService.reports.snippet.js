const incidentsService = {
    // ... existing methods ...

    /**
     * Get incident reports with statistics
     */
    async getIncidentReports(params) {
        try {
            const response = await axios.get('/incidents/reports', { params });
            return response.data;
        } catch (error) {
            console.error('Error fetching incident reports:', error);
            throw error;
        }
    }
};

export default incidentsService;
