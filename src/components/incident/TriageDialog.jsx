import React, { useState } from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Stack,
    Typography,
    FormHelperText,
    Alert
} from '@mui/material';
import { validateTriage } from '../../utils/validators';
import { NOTIFICATION_TYPES, SEVERITY_LEVELS, requiresIsolation } from '../../utils/sapPmLite';

const TriageDialog = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        severity: '',
        notification_type: '',
        triage_notes: ''
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
        const validation = validateTriage(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit
        onSubmit(formData);
    };
    
    const showIsolationWarning = requiresIsolation(formData.notification_type, formData.severity);
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <FormControl fullWidth sx={{ mb: 2 }} required error={!!errors.severity}>
                <InputLabel>Mức độ nghiêm trọng</InputLabel>
                <Select
                    value={formData.severity}
                    onChange={(e) => handleChange('severity', e.target.value)}
                    label="Mức độ nghiêm trọng"
                >
                    {Object.values(SEVERITY_LEVELS).map(severity => (
                        <MenuItem key={severity.value} value={severity.value}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <span>{severity.icon}</span>
                                <Typography>{severity.labelVi}</Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </Select>
                {errors.severity && <FormHelperText>{errors.severity}</FormHelperText>}
            </FormControl>
            
            <FormControl fullWidth sx={{ mb: 2 }} required error={!!errors.notification_type}>
                <InputLabel>Loại thông báo (SAP PM)</InputLabel>
                <Select
                    value={formData.notification_type}
                    onChange={(e) => handleChange('notification_type', e.target.value)}
                    label="Loại thông báo (SAP PM)"
                >
                    {Object.values(NOTIFICATION_TYPES).map(type => (
                        <MenuItem key={type.code} value={type.code}>
                            <Stack>
                                <Typography variant="body2" fontWeight="bold">
                                    {type.code} - {type.labelVi}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {type.descriptionVi}
                                </Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </Select>
                {errors.notification_type && (
                    <FormHelperText>{errors.notification_type}</FormHelperText>
                )}
                <FormHelperText>
                    M1 yêu cầu cô lập thiết bị nếu mức độ Critical
                </FormHelperText>
            </FormControl>
            
            {showIsolationWarning && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    ⚠️ Sự cố M1 với mức độ CRITICAL yêu cầu cô lập thiết bị ngay sau khi phân loại!
                </Alert>
            )}
            
            <TextField
                fullWidth
                multiline
                rows={3}
                label="Ghi chú phân loại"
                placeholder="Nhập ghi chú về việc phân loại sự cố..."
                value={formData.triage_notes}
                onChange={(e) => handleChange('triage_notes', e.target.value)}
                error={!!errors.triage_notes}
                helperText={errors.triage_notes}
            />
        </Box>
    );
};

export default TriageDialog;
