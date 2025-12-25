import React, { useState } from 'react';
import {
    Box,
    TextField,
    Alert,
    Stack,
    Typography
} from '@mui/material';
import { validateSubmitAcceptance } from '../../utils/validators';

const SubmitAcceptanceDialog = ({ maintenance, onSubmit }) => {
    const [formData, setFormData] = useState({
        work_report: '',
        actual_duration: '',
        actual_cost: ''
    });
    const [errors, setErrors] = useState({});
    
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateSubmitAcceptance(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Convert numbers
        const payload = {
            work_report: formData.work_report,
            actual_duration: formData.actual_duration ? Number(formData.actual_duration) : null,
            actual_cost: formData.actual_cost ? Number(formData.actual_cost) : null
        };
        
        // Call parent onSubmit
        onSubmit(payload);
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="info" sx={{ mb: 2 }}>
                Gửi báo cáo hoàn thành để QA/Engineering nghiệm thu
            </Alert>
            
            {maintenance?.scheduled_date && (
                <Alert severity="info" variant="outlined" sx={{ mb: 2 }}>
                    <Stack spacing={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Thời gian dự kiến:
                        </Typography>
                        <Typography variant="body2">
                            {new Date(maintenance.scheduled_date).toLocaleString('vi-VN')}
                        </Typography>
                    </Stack>
                </Alert>
            )}
            
            <TextField
                fullWidth
                multiline
                rows={5}
                label="Báo cáo công việc *"
                placeholder="Mô tả chi tiết công việc đã thực hiện, kết quả, và tình trạng thiết bị sau bảo trì..."
                value={formData.work_report}
                onChange={(e) => handleChange('work_report', e.target.value)}
                error={!!errors.work_report}
                helperText={errors.work_report}
                required
                sx={{ mb: 2 }}
            />
            
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    type="number"
                    label="Thời gian thực tế (phút)"
                    placeholder="180"
                    value={formData.actual_duration}
                    onChange={(e) => handleChange('actual_duration', e.target.value)}
                    error={!!errors.actual_duration}
                    helperText={errors.actual_duration || 'Tổng thời gian thực hiện'}
                    inputProps={{ min: 0, step: 1 }}
                />
                
                <TextField
                    fullWidth
                    type="number"
                    label="Chi phí thực tế (VND)"
                    placeholder="1000000"
                    value={formData.actual_cost}
                    onChange={(e) => handleChange('actual_cost', e.target.value)}
                    error={!!errors.actual_cost}
                    helperText={errors.actual_cost || 'Tổng chi phí vật tư + nhân công'}
                    inputProps={{ min: 0, step: 1000 }}
                />
            </Stack>
        </Box>
    );
};

export default SubmitAcceptanceDialog;
