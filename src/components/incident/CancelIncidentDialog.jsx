import React, { useState } from 'react';
import {
    Box,
    TextField,
    Alert,
    AlertTitle
} from '@mui/material';
import { validateCancel } from '../../utils/validators';

const CancelIncidentDialog = ({ incident, onSubmit }) => {
    const [cancelReason, setCancelReason] = useState('');
    const [errors, setErrors] = useState({});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateCancel({ cancel_reason: cancelReason });
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit
        onSubmit({ cancel_reason: cancelReason });
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>⚠️ Hủy sự cố</AlertTitle>
                Hành động này sẽ:
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li>Chuyển sự cố sang trạng thái CANCELLED</li>
                    <li>Không thể hoàn tác</li>
                    <li>Yêu cầu ghi rõ lý do hủy</li>
                </ul>
            </Alert>
            
            {incident && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Sự cố:</strong> {incident.title}
                    <br />
                    <strong>Trạng thái hiện tại:</strong> {incident.status}
                    <br />
                    <strong>Thiết bị:</strong> {incident.asset?.name || 'N/A'}
                </Alert>
            )}
            
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Lý do hủy *"
                placeholder="Nhập lý do chi tiết tại sao hủy sự cố này..."
                value={cancelReason}
                onChange={(e) => {
                    setCancelReason(e.target.value);
                    setErrors({});
                }}
                error={!!errors.cancel_reason}
                helperText={errors.cancel_reason || 'Lý do hủy sẽ được lưu vào lịch sử'}
                required
            />
        </Box>
    );
};

export default CancelIncidentDialog;
