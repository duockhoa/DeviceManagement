import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Alert
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function AcknowledgeDialog({ open, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        notes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError('');
            await onSubmit(formData);
            handleClose();
        } catch (err) {
            setError(err.message || 'Không thể tiếp nhận sự cố');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({ notes: '' });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <CheckCircleIcon color="primary" />
                    Tiếp nhận sự cố
                </Box>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Alert severity="info" sx={{ mb: 2 }}>
                    Xác nhận tiếp nhận và bắt đầu xử lý sự cố này
                </Alert>

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Ghi chú (tùy chọn)"
                    placeholder="Ghi chú về phương án xử lý..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Đang xử lý...' : 'Tiếp nhận'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
