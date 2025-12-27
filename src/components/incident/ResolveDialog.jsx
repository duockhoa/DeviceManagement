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
import TaskAltIcon from '@mui/icons-material/TaskAlt';

export default function ResolveDialog({ open, onClose, onSubmit }) {
    const [formData, setFormData] = useState({
        solution: '',
        root_cause: '',
        downtime_minutes: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async () => {
        if (!formData.solution.trim()) {
            setError('Vui lòng nhập giải pháp đã áp dụng');
            return;
        }

        try {
            setSubmitting(true);
            setError('');
            await onSubmit({
                ...formData,
                downtime_minutes: formData.downtime_minutes ? parseInt(formData.downtime_minutes) : null
            });
            handleClose();
        } catch (err) {
            setError(err.message || 'Không thể đánh dấu đã giải quyết');
        } finally {
            setSubmitting(false);
        }
    };

    const handleClose = () => {
        setFormData({
            solution: '',
            root_cause: '',
            downtime_minutes: ''
        });
        setError('');
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                    <TaskAltIcon color="success" />
                    Đánh dấu đã giải quyết
                </Box>
            </DialogTitle>
            <DialogContent>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                <Alert severity="success" sx={{ mb: 3 }}>
                    Ghi nhận giải pháp đã áp dụng và nguyên nhân gốc
                </Alert>

                <TextField
                    fullWidth
                    required
                    multiline
                    rows={4}
                    label="Giải pháp đã áp dụng"
                    placeholder="Mô tả chi tiết cách thức xử lý..."
                    value={formData.solution}
                    onChange={(e) => setFormData({ ...formData, solution: e.target.value })}
                    sx={{ mb: 2 }}
                    error={!formData.solution.trim() && error}
                />

                <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Nguyên nhân gốc (tùy chọn)"
                    placeholder="Phân tích nguyên nhân..."
                    value={formData.root_cause}
                    onChange={(e) => setFormData({ ...formData, root_cause: e.target.value })}
                    sx={{ mb: 2 }}
                />

                <TextField
                    fullWidth
                    type="number"
                    label="Thời gian downtime (phút)"
                    placeholder="0"
                    value={formData.downtime_minutes}
                    onChange={(e) => setFormData({ ...formData, downtime_minutes: e.target.value })}
                    helperText="Thời gian thiết bị/hệ thống ngừng hoạt động"
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} disabled={submitting}>
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={handleSubmit}
                    disabled={submitting}
                >
                    {submitting ? 'Đang xử lý...' : 'Xác nhận đã giải quyết'}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
