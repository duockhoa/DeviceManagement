import React, { useState } from 'react';
import {
    Box,
    TextField,
    Alert,
    AlertTitle
} from '@mui/material';
import { validateIsolate } from '../../utils/validators';

const IsolateDialog = ({ incident, onSubmit }) => {
    const [formData, setFormData] = useState({
        isolation_notes: ''
    });
    const [errors, setErrors] = useState({});
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Validate
        const validation = validateIsolate(formData);
        if (!validation.isValid) {
            setErrors(validation.errors);
            return;
        }
        
        // Call parent onSubmit
        onSubmit(formData);
    };
    
    return (
        <Box component="form" id="action-form" onSubmit={handleSubmit}>
            <Alert severity="error" sx={{ mb: 2 }}>
                <AlertTitle>⚠️ Cô lập thiết bị</AlertTitle>
                Hành động này sẽ:
                <ul style={{ marginTop: 8, marginBottom: 0, paddingLeft: 20 }}>
                    <li>Chuyển operational status của thiết bị sang DOWN</li>
                    <li>Chuyển trạng thái sự cố sang OUT_OF_SERVICE</li>
                    <li>Ngăn chặn các hoạt động khác trên thiết bị</li>
                </ul>
            </Alert>
            
            {incident?.asset && (
                <Alert severity="info" sx={{ mb: 2 }}>
                    <strong>Thiết bị:</strong> {incident.asset.name} ({incident.asset.dk_code})
                    <br />
                    <strong>Vị trí:</strong> {incident.asset.area?.name || 'N/A'}
                </Alert>
            )}
            
            <TextField
                fullWidth
                multiline
                rows={4}
                label="Ghi chú cô lập"
                placeholder="Nhập lý do và chi tiết về việc cô lập thiết bị..."
                value={formData.isolation_notes}
                onChange={(e) => setFormData({ isolation_notes: e.target.value })}
                error={!!errors.isolation_notes}
                helperText={errors.isolation_notes || 'Khuyến nghị ghi rõ nguyên nhân và biện pháp an toàn'}
            />
        </Box>
    );
};

export default IsolateDialog;
