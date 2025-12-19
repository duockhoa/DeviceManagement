import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const ActionZone = ({ title = 'Thao tác', current_status_label, next_role_label, children }) => {
    return (
        <Card sx={{ position: 'sticky', top: 16, zIndex: 1, mb: 2, border: '1px solid #e0e0e0' }}>
            <CardContent>
                <Typography variant="h6" sx={{ mb: 1, fontWeight: 700 }}>
                    {title}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                        Bạn đang ở bước: <strong>{current_status_label || '—'}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Đang chờ: <strong>{next_role_label || '—'}</strong>
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    {children}
                </Box>
            </CardContent>
        </Card>
    );
};

export default ActionZone;
