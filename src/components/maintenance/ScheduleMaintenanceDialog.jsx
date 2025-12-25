import React, { useState, useEffect } from 'react';
import {
    Box,
    FormControl,
    TextField,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    Stack,
    Avatar,
    Typography,
    Chip,
    Alert,
    CircularProgress
} from '@mui/material';
import { LocalizationProvider, DateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { validateSchedule } from '../../utils/validators';
import { SHIFT_OPTIONS } from '../../utils/sapPmLite';
import { userServices } from '../../services/userServices';

const ScheduleMaintenanceDialog = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        scheduled_date: null,
        shift: '',
        technician_id: null
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
            const response = await userServices.getUsers({ role: 'TECHNICIAN', status: 'active' });
            setTechnicians(response.data || []);
        } catch (err) {
            console.error('Failed to load technicians:', err);
            setErrors({ general: 'Không thể tải danh sách kỹ thuật viên' });
        } finally {
            setLoading(false);
        }
    };
    
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateSchedule(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit
        onSubmit({
            scheduled_date: formData.scheduled_date,
            shift: formData.shift,
            technician_id: formData.technician_id?.id || formData.technician_id
        });
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
            
            <Alert severity="info" sx={{ mb: 2 }}>
                Lập lịch bảo trì để chuẩn bị thi công
            </Alert>
            
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    label="Thời gian dự kiến *"
                    value={formData.scheduled_date}
                    onChange={(value) => handleChange('scheduled_date', value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            fullWidth
                            error={!!errors.scheduled_date}
                            helperText={errors.scheduled_date}
                            required
                            sx={{ mb: 2 }}
                        />
                    )}
                    minDateTime={new Date()}
                />
            </LocalizationProvider>
            
            <FormControl fullWidth sx={{ mb: 2 }} required error={!!errors.shift}>
                <InputLabel>Ca làm việc</InputLabel>
                <Select
                    value={formData.shift}
                    onChange={(e) => handleChange('shift', e.target.value)}
                    label="Ca làm việc"
                >
                    {SHIFT_OPTIONS.map(shift => (
                        <MenuItem key={shift.value} value={shift.value}>
                            <Stack>
                                <Typography variant="body2">{shift.label}</Typography>
                                <Typography variant="caption" color="text.secondary">
                                    {shift.time}
                                </Typography>
                            </Stack>
                        </MenuItem>
                    ))}
                </Select>
                {errors.shift && (
                    <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
                        {errors.shift}
                    </Typography>
                )}
            </FormControl>
            
            <FormControl fullWidth required error={!!errors.technician_id}>
                <Autocomplete
                    options={technicians}
                    getOptionLabel={(option) => option.name || ''}
                    value={formData.technician_id}
                    onChange={(e, value) => handleChange('technician_id', value)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Kỹ thuật viên *"
                            error={!!errors.technician_id}
                            helperText={errors.technician_id}
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
                                            : `${option.current_workload} cv`
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
        </Box>
    );
};

export default ScheduleMaintenanceDialog;
