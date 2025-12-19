import axios from './customize-axios';

export const previewOeeImport = async ({ idempotencyKey, file, rows }) => {
    if (!idempotencyKey) throw new Error('idempotencyKey required');
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('idempotency_key', idempotencyKey);
        const res = await axios.post('/oee/import/preview', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    }
    const payload = { idempotency_key: idempotencyKey, rows };
    const res = await axios.post('/oee/import/preview', payload);
    return res.data;
};

export const commitOeeImport = async ({ idempotencyKey, file, rows }) => {
    if (!idempotencyKey) throw new Error('idempotencyKey required');
    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('idempotency_key', idempotencyKey);
        const res = await axios.post('/oee/import/commit', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return res.data;
    }
    const payload = { idempotency_key: idempotencyKey, rows };
    const res = await axios.post('/oee/import/commit', payload);
    return res.data;
};
