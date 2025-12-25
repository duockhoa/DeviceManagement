import React, { useState } from 'react';
import {
    Box,
    FormControl,
    RadioGroup,
    FormControlLabel,
    Radio,
    TextField,
    Stack,
    Typography,
    Alert,
    Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { validatePostFixCheck } from '../../utils/validators';

const PostFixCheckDialog = ({ incident, onSubmit }) => {
    const [formData, setFormData] = useState({
        post_fix_result: '',
        post_fix_notes: ''
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
        const validation = validatePostFixCheck(formData, incident);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit
        onSubmit(formData);
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="info" sx={{ mb: 2 }}>
                Kiểm tra thiết bị sau khi kỹ thuật viên hoàn thành sửa chữa
            </Alert>
            
            {incident?.repair_notes && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary">
                        Báo cáo từ kỹ thuật viên:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                        {incident.repair_notes}
                    </Typography>
                    {incident.parts_used && (
                        <>
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                                Vật tư đã sử dụng:
                            </Typography>
                            <Typography variant="body2">
                                {incident.parts_used}
                            </Typography>
                        </>
                    )}
                </Paper>
            )}
            
            <FormControl component="fieldset" required error={!!errors.post_fix_result} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Kết quả kiểm tra *
                </Typography>
                <RadioGroup
                    value={formData.post_fix_result}
                    onChange={(e) => handleChange('post_fix_result', e.target.value)}
                >
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            p: 2, 
                            mb: 1,
                            border: formData.post_fix_result === 'pass' ? 2 : 1,
                            borderColor: formData.post_fix_result === 'pass' ? 'success.main' : 'divider'
                        }}
                    >
                        <FormControlLabel
                            value="pass"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckCircleIcon color="success" />
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            ✓ Đạt
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Thiết bị hoạt động tốt, chuyển sang RESOLVED
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />
                    </Paper>
                    
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            p: 2,
                            border: formData.post_fix_result === 'fail' ? 2 : 1,
                            borderColor: formData.post_fix_result === 'fail' ? 'error.main' : 'divider'
                        }}
                    >
                        <FormControlLabel
                            value="fail"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CancelIcon color="error" />
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            ✗ Không đạt
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Yêu cầu sửa lại, quay về IN_PROGRESS
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />
                    </Paper>
                </RadioGroup>
                {errors.post_fix_result && (
                    <Typography variant="caption" color="error">
                        {errors.post_fix_result}
                    </Typography>
                )}
            </FormControl>
            
            <TextField
                fullWidth
                multiline
                rows={3}
                label={formData.post_fix_result === 'fail' ? 'Ghi chú *' : 'Ghi chú'}
                placeholder={
                    formData.post_fix_result === 'fail'
                        ? 'Nhập chi tiết lý do không đạt và yêu cầu sửa chữa...'
                        : 'Nhập ghi chú kiểm tra (nếu có)...'
                }
                value={formData.post_fix_notes}
                onChange={(e) => handleChange('post_fix_notes', e.target.value)}
                error={!!errors.post_fix_notes}
                helperText={errors.post_fix_notes}
                required={formData.post_fix_result === 'fail'}
            />
        </Box>
    );
};

export default PostFixCheckDialog;
