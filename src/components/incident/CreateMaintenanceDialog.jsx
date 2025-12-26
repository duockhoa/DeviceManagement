import React, { useState } from 'react';
import {
    Box,
    TextField,
    Stack,
    Alert,
    FormHelperText,
    Typography,
    Divider
} from '@mui/material';

/**
 * CreateMaintenanceDialog - Form chuyển đổi sự cố thành lệnh bảo trì sửa chữa
 * Link với hệ thống Maintenance có sẵn, không tạo mới
 * Chỉ áp dụng cho incident_category = EQUIPMENT
 */
const CreateMaintenanceDialog = ({ onSubmit, incident }) => {
    const [formData, setFormData] = useState({
        maintenance_title: incident?.title || '',
        maintenance_description: incident?.assessment_notes || '',
        estimated_hours: '',
        required_parts: '',
        safety_notes: ''
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
        
        // Validation
        const newErrors = {};
        if (!formData.maintenance_title?.trim()) {
            newErrors.maintenance_title = 'Tiêu đề lệnh sửa chữa là bắt buộc';
        }
        if (!formData.maintenance_description?.trim()) {
            newErrors.maintenance_description = 'Mô tả công việc là bắt buộc';
        }
        
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        
        onSubmit(formData);
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
                    🔧 Chuyển sang lệnh bảo trì cho: {incident?.asset?.name || 'Thiết bị'}
                </Typography>
                <Typography variant="caption">
                    Mã thiết bị: {incident?.asset?.asset_code} | Mã sự cố: {incident?.incident_code}
                </Typography>
            </Alert>

            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                📋 Thông tin chuyển sang bảo trì
            </Typography>
            <Divider sx={{ mb: 2 }} />
            
            <TextField
                fullWidth
                required
                label="Tiêu đề lệnh sửa chữa"
                value={formData.maintenance_title}
                onChange={(e) => handleChange('maintenance_title', e.target.value)}
                error={!!errors.maintenance_title}
                helperText={errors.maintenance_title}
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                required
                multiline
                rows={4}
                label="Mô tả công việc sửa chữa"
                placeholder="Mô tả chi tiết công việc cần thực hiện: kiểm tra, thay thế, sửa chữa..."
                value={formData.maintenance_description}
                onChange={(e) => handleChange('maintenance_description', e.target.value)}
                error={!!errors.maintenance_description}
                helperText={errors.maintenance_description}
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                type="number"
                label="Thời gian dự kiến (giờ)"
                placeholder="VD: 4"
                value={formData.estimated_hours}
                onChange={(e) => handleChange('estimated_hours', e.target.value)}
                helperText="Ước tính số giờ cần để hoàn thành"
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                multiline
                rows={3}
                label="Vật tư / phụ tùng cần thiết"
                placeholder="Liệt kê vật tư, phụ tùng cần chuẩn bị..."
                value={formData.required_parts}
                onChange={(e) => handleChange('required_parts', e.target.value)}
                helperText="Giúp kỹ thuật viên chuẩn bị trước khi bắt đầu"
                sx={{ mb: 2 }}
            />
            
            <TextField
                fullWidth
                multiline
                rows={2}
                label="⚠️ Lưu ý an toàn"
                placeholder="Các yêu cầu về an toàn lao động khi sửa chữa..."
                value={formData.safety_notes}
                onChange={(e) => handleChange('safety_notes', e.target.value)}
                helperText="Rất quan trọng để đảm bảo an toàn"
            />
            
            <Alert severity="warning" sx={{ mt: 2 }}>
                <Typography variant="caption">
                    💡 Sau khi chuyển sang bảo trì, hệ thống sẽ tạo lệnh bảo trì mới và liên kết với sự cố này. Sự cố sẽ chuyển sang trạng thái "Đã chuyển bảo trì".
                </Typography>
            </Alert>
        </Box>
    );
};

export default CreateMaintenanceDialog;
