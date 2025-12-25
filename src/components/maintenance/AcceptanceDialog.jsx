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
import { validateAcceptance } from '../../utils/validators';

const AcceptanceDialog = ({ maintenance, onSubmit }) => {
    const [result, setResult] = useState('');
    const [rejectionReason, setRejectionReason] = useState('');
    const [errors, setErrors] = useState({});
    
    const handleResultChange = (value) => {
        setResult(value);
        if (errors.result) {
            setErrors(prev => ({ ...prev, result: null }));
        }
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateAcceptance({ rejection_reason: rejectionReason }, result);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit with different action
        if (result === 'accept') {
            onSubmit({ action: 'accept' });
        } else {
            onSubmit({ action: 'reject_acceptance', rejection_reason: rejectionReason });
        }
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="warning" sx={{ mb: 2 }}>
                Kiểm tra và nghiệm thu kết quả bảo trì
            </Alert>
            
            {maintenance?.work_report && (
                <Paper variant="outlined" sx={{ p: 2, mb: 2, bgcolor: 'grey.50' }}>
                    <Typography variant="caption" color="text.secondary">
                        Báo cáo từ kỹ thuật viên:
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                        {maintenance.work_report}
                    </Typography>
                    
                    {(maintenance.actual_duration || maintenance.actual_cost) && (
                        <Stack direction="row" spacing={3} sx={{ mt: 2 }}>
                            {maintenance.actual_duration && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Thời gian:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {maintenance.actual_duration} phút
                                    </Typography>
                                </Box>
                            )}
                            {maintenance.actual_cost && (
                                <Box>
                                    <Typography variant="caption" color="text.secondary">
                                        Chi phí:
                                    </Typography>
                                    <Typography variant="body2" fontWeight="bold">
                                        {maintenance.actual_cost.toLocaleString('vi-VN')} VND
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    )}
                </Paper>
            )}
            
            <FormControl component="fieldset" required error={!!errors.result} sx={{ mb: 2 }}>
                <Typography variant="subtitle2" gutterBottom>
                    Kết quả nghiệm thu *
                </Typography>
                <RadioGroup
                    value={result}
                    onChange={(e) => handleResultChange(e.target.value)}
                >
                    <Paper 
                        variant="outlined" 
                        sx={{ 
                            p: 2, 
                            mb: 1,
                            border: result === 'accept' ? 2 : 1,
                            borderColor: result === 'accept' ? 'success.main' : 'divider'
                        }}
                    >
                        <FormControlLabel
                            value="accept"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CheckCircleIcon color="success" />
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            ✓ Nghiệm thu đạt
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Công việc hoàn thành tốt, chuyển sang ACCEPTED
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
                            border: result === 'reject' ? 2 : 1,
                            borderColor: result === 'reject' ? 'error.main' : 'divider'
                        }}
                    >
                        <FormControlLabel
                            value="reject"
                            control={<Radio />}
                            label={
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <CancelIcon color="error" />
                                    <Box>
                                        <Typography variant="body2" fontWeight="bold">
                                            ✗ Không đạt
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            Yêu cầu làm lại, quay về IN_PROGRESS
                                        </Typography>
                                    </Box>
                                </Stack>
                            }
                        />
                    </Paper>
                </RadioGroup>
                {errors.result && (
                    <Typography variant="caption" color="error">
                        {errors.result}
                    </Typography>
                )}
            </FormControl>
            
            {result === 'reject' && (
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Lý do từ chối *"
                    placeholder="Nhập chi tiết lý do không đạt nghiệm thu và yêu cầu sửa chữa..."
                    value={rejectionReason}
                    onChange={(e) => {
                        setRejectionReason(e.target.value);
                        if (errors.rejection_reason) {
                            setErrors(prev => ({ ...prev, rejection_reason: null }));
                        }
                    }}
                    error={!!errors.rejection_reason}
                    helperText={errors.rejection_reason}
                    required
                />
            )}
        </Box>
    );
};

export default AcceptanceDialog;
