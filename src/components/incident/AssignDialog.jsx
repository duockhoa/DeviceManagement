import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    Autocomplete,
    TextField,
    Stack,
    Avatar,
    Typography,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material';
import { validateAssign } from '../../utils/validators';
import { userServices } from '../../services/userServices';

const AssignDialog = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        assigned_to: null
    });
    const [errors, setErrors] = useState({});
    const [technicians, setTechnicians] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        loadTechnicians();
    }, []);
    
    const loadTechnicians = async () => {
        try {
            setLoading(true);
            // Fetch users with TECHNICIAN role
            const response = await userServices.getUsers({ role: 'TECHNICIAN', status: 'active' });
            setTechnicians(response.data || []);
        } catch (err) {
            console.error('Failed to load technicians:', err);
            setErrors({ general: 'Không thể tải danh sách kỹ thuật viên' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateAssign(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit
        onSubmit({ assigned_to: formData.assigned_to.id });
    };
    
    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            {errors.general && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {errors.general}
                </Alert>
            )}
            
            <FormControl fullWidth required error={!!errors.assigned_to}>
                <Autocomplete
                    options={technicians}
                    getOptionLabel={(option) => option.name || ''}
                    value={formData.assigned_to}
                    onChange={(e, value) => {
                        setFormData({ assigned_to: value });
                        setErrors(prev => ({ ...prev, assigned_to: null }));
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn kỹ thuật viên *"
                            error={!!errors.assigned_to}
                            helperText={errors.assigned_to || 'Chọn người phụ trách xử lý sự cố'}
                        />
                    )}
                    renderOption={(props, option) => (
                        <li {...props}>
                            <Stack direction="row" spacing={2} alignItems="center" width="100%">
                                <Avatar sx={{ width: 32, height: 32 }}>
                                    {option.name?.[0]?.toUpperCase()}
                                </Avatar>
                                <Box flex={1}>
                                    <Typography variant="body2" fontWeight="bold">
                                        {option.name}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {option.email}
                                    </Typography>
                                </Box>
                                {option.current_workload !== undefined && (
                                    <Chip
                                        size="small"
                                        label={option.current_workload === 0 
                                            ? 'Rảnh' 
                                            : `${option.current_workload} công việc`
                                        }
                                        color={
                                            option.current_workload === 0 ? 'success' : 
                                            option.current_workload > 5 ? 'error' : 
                                            'warning'
                                        }
                                    />
                                )}
                            </Stack>
                        </li>
                    )}
                    noOptionsText="Không tìm thấy kỹ thuật viên"
                />
            </FormControl>
            
            {technicians.length === 0 && (
                <Alert severity="warning" sx={{ mt: 2 }}>
                    Không có kỹ thuật viên khả dụng trong hệ thống
                </Alert>
            )}
        </Box>
    );
};

export default AssignDialog;
