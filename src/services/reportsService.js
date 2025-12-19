import axios from './customize-axios';

// Read-only MTBF/MTTR report
export const getMtbfReport = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await axios.get(`/reports/mtbf${queryString ? `?${queryString}` : ''}`);
    return res.data?.data;
};

// Read-only OEE Level 1 (Availability-only)
export const getOeeReport = async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const res = await axios.get(`/reports/oee${queryString ? `?${queryString}` : ''}`);
    return res.data?.data;
};
