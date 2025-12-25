import React, { useState } from 'react';
import { TextField, Alert, Box } from '@mui/material';

/**
 * CancelMaintenanceDialog - Cancel maintenance work order with reason
 * Role: MANAGER
 */
export default function CancelMaintenanceDialog({ onSubmit }) {
    const [cancelReason, setCancelReason] = useState('');

    const handleSubmit = () => {
        if (!cancelReason.trim()) {
            alert('Vui lòng nhập lý do hủy');
            return;
        }
        onSubmit({ cancel_reason: cancelReason });
    };

    return (
        <Box>
            <Alert severity="error" sx={{ mb: 2 }}>
                Hành động này không thể hoàn tác. Lệnh bảo trì sẽ bị hủy.
            </Alert>
            
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Lý do hủy *"
                placeholder="Nhập lý do hủy lệnh bảo trì..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                required
            />
        </Box>
    );
}
