import React, { useState } from 'react';
import {
    Box,
    TextField,
    Stack,
    Typography,
    Alert
} from '@mui/material';
import { validateSubmitPostFix } from '../../utils/validators';

const SubmitPostFixDialog = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        repair_notes: '',
        parts_used: '',
        time_spent: ''
    });
    const [errors, setErrors] = useState({});
    
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateSubmitPostFix(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Convert time_spent to number if provided
        const payload = {
            ...formData,
            time_spent: formData.time_spent ? Number(formData.time_spent) : null
        };
        
        // Call parent onSubmit
        onSubmit(payload);
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="info" sx={{ mb: 2 }}>
                Gửi báo cáo sửa chữa để QA/Engineering kiểm tra trước khi chuyển sang RESOLVED
            </Alert>
            
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Báo cáo sửa chữa *"
                placeholder="Mô tả chi tiết công việc đã thực hiện, nguyên nhân sự cố, và giải pháp..."
                value={formData.repair_notes}
                onChange={(e) => handleChange('repair_notes', e.target.value)}
                error={!!errors.repair_notes}
                helperText={errors.repair_notes}
                required
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                multiline
                rows={2}
                label="Vật tư/Linh kiện đã sử dụng"
                placeholder="Liệt kê các vật tư, linh kiện thay thế (nếu có)..."
                value={formData.parts_used}
                onChange={(e) => handleChange('parts_used', e.target.value)}
                error={!!errors.parts_used}
                helperText={errors.parts_used}
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                type="number"
                label="Thời gian thực hiện (phút)"
                placeholder="120"
                value={formData.time_spent}
                onChange={(e) => handleChange('time_spent', e.target.value)}
                error={!!errors.time_spent}
                helperText={errors.time_spent || 'Tổng thời gian từ lúc bắt đầu đến khi hoàn thành'}
                inputProps={{ min: 0, step: 1 }}
            />
        </Box>
    );
};

export default SubmitPostFixDialog;
