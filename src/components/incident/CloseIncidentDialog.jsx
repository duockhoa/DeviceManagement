import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Alert
} from '@mui/material';

const CloseIncidentDialog = ({ open, onClose, incident, onSubmit }) => {
    console.log('[DEBUG CloseIncidentDialog]', 'open:', open, 'incident:', incident?.id);
    
    const [formData, setFormData] = useState({
        close_notes: '',
        downtime_minutes: incident?.downtime_minutes || ''
    });
    const [errors, setErrors] = useState({});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate M1 requires downtime
        if (incident?.notification_type === 'M1' && !formData.downtime_minutes) {
            setErrors({ downtime_minutes: 'Vui lòng nhập thời gian downtime cho sự cố M1' });
            return;
        }
        
        const payload = {
            close_notes: formData.close_notes,
            downtime_minutes: formData.downtime_minutes ? Number(formData.downtime_minutes) : null
        };
        
        // Call parent onSubmit
        onSubmit(payload);
    };
    
    return (
        <Dialog 
            open={open} 
            onClose={onClose}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle>Đóng sự cố</DialogTitle>
            <DialogContent>
                <Box component="form" id="close-incident-form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <Alert severity="success" sx={{ mb: 2 }}>
                        Đóng sự cố sau khi đã giải quyết hoàn toàn. Sự cố sẽ chuyển sang CLOSED.
                    </Alert>
                    
                    {incident?.notification_type === 'M1' && (
                        <Alert severity="warning" sx={{ mb: 2 }}>
                            ⚠️ Sự cố M1 yêu cầu nhập thời gian downtime trước khi đóng
                        </Alert>
                    )}
                    
                    {incident?.notification_type === 'M1' && (
                        <TextField
                            fullWidth
                            type="number"
                            label="Thời gian downtime (phút) *"
                            placeholder="120"
                            value={formData.downtime_minutes}
                            onChange={(e) => setFormData(prev => ({ ...prev, downtime_minutes: e.target.value }))}
                            error={!!errors.downtime_minutes}
                            helperText={errors.downtime_minutes || 'Tổng thời gian thiết bị ngừng hoạt động'}
                            inputProps={{ min: 0, step: 1 }}
                            required
                            sx={{ mb: 2 }}
                        />
                    )}
                    
                    <TextField
                        fullWidth
                        multiline
                        rows={3}
                        label="Ghi chú đóng"
                        placeholder="Nhập ghi chú khi đóng sự cố (nếu có)..."
                        value={formData.close_notes}
                        onChange={(e) => setFormData(prev => ({ ...prev, close_notes: e.target.value }))}
                    />
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="inherit">
                    Hủy
                </Button>
                <Button 
                    type="submit" 
                    form="close-incident-form"
                    variant="contained" 
                    color="success"
                >
                    Đóng sự cố
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CloseIncidentDialog;
