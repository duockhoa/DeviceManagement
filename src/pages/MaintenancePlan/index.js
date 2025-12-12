import { useEffect, useMemo, useState } from 'react';
import { Box, Card, CardContent, Typography, Button, Stack, Divider, Chip, Paper, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from '../../services/customize-axios';
import MaintenancePlanImport from '../../component/MaintenanceComponent/MaintenancePlanImport';

export default function MaintenancePlan() {
    const [batches, setBatches] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigator = useNavigate();
    const user = useSelector((state) => state.user.userInfo);
    const [detail, setDetail] = useState(null);
    const [detailOpen, setDetailOpen] = useState(false);
    const [detailSelected, setDetailSelected] = useState([]);
    const [message, setMessage] = useState(null);

    const statusColor = useMemo(() => ({
        pending: { label: 'Chờ duyệt', color: 'warning' },
        approved: { label: 'Đã duyệt', color: 'success' },
        rejected: { label: 'Từ chối', color: 'error' },
        partial: { label: 'Một phần', color: 'info' }
    }), []);

    const loadBatches = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/maintenance-plan');
            setBatches(res.data.data || []);
        } catch (error) {
            console.error('Load batches error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadBatches();
    }, []);

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
            <Paper elevation={0} sx={{ mb: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">
                        Kế hoạch bảo trì
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quản lý kế hoạch bảo trì import từ Excel.
                    </Typography>
                </Box>
                <MaintenancePlanImport onApproved={loadBatches} />
            </Paper>

            <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', mb: 2 }}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Kế hoạch bảo trì</Typography>
                            <Typography variant="body2" color="text.secondary">Danh sách kế hoạch đã import</Typography>
                        </Box>
                    </Box>
                    <Divider sx={{ mb: 1 }} />
                    {message && (
                        <Typography variant="body2" color="primary" sx={{ mb: 1 }}>{message}</Typography>
                    )}
                    <Box sx={{ minWidth: 900, overflowX: 'auto' }}>
                        <Box sx={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 220px', fontWeight: 'bold', fontSize: '1.2rem', px: 1, py: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                            <span>#</span><span>Tiêu đề</span><span>Trạng thái</span><span>Ngày tạo</span><span>Người tạo</span><span style={{ textAlign: 'right' }}>Thao tác</span>
                        </Box>
                    {batches.length === 0 && (
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>Chưa có kế hoạch nào.</Typography>
                    )}
                    {batches.map((b, idx) => (
                        <Box key={b.id} sx={{ display: 'grid', gridTemplateColumns: '40px 1.5fr 1fr 1fr 1fr 220px', alignItems: 'center', px: 1, py: 1, borderBottom: '1px solid #eee' }}>
                            <Typography variant="body2">{idx + 1}</Typography>
                            <Typography variant="body2" fontWeight="bold">{b.title}</Typography>
                            <Box>
                                <Chip 
                                    size="small" 
                                    label={statusColor[b.status]?.label || b.status} 
                                    color={statusColor[b.status]?.color || 'default'}
                                    sx={{ 
                                        minWidth: '90px',
                                        height: '24px',
                                        fontWeight: 600
                                    }}
                                />
                            </Box>
                            <Typography variant="body2">{new Date(b.createdAt).toLocaleDateString()}</Typography>
                            <Typography variant="body2">{b.batchCreator?.name || '---'}</Typography>
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                                <Button size="small" variant="outlined" onClick={async () => {
                                    try {
                                        const res = await axios.get(`/maintenance-plan/${b.id}`);
                                        setDetail(res.data.data);
                                        setDetailSelected([]);
                                        setDetailOpen(true);
                                    } catch (err) {
                                        setMessage('Không tải được chi tiết');
                                    }
                                }}>Xem</Button>
                                <Button
                                    size="small"
                                    variant="contained"
                                    onClick={async () => {
                                        try {
                                            const res = await axios.post(`/maintenance-plan/${b.id}/approve`, {});
                                            setMessage(`Đã phê duyệt ${res.data.approved || 0} mục`);
                                            loadBatches();
                                        } catch (err) {
                                            setMessage(err.response?.data?.message || 'Không phê duyệt được');
                                        }
                                    }}
                                >
                                    Phê duyệt
                                </Button>
                                {user?.employee_code === '0947' && (
                                    <Button
                                        size="small"
                                        color="error"
                                        variant="outlined"
                                        onClick={async () => {
                                            if (!window.confirm('Xóa kế hoạch này?')) return;
                                            try {
                                                await axios.delete(`/maintenance-plan/${b.id}`);
                                                loadBatches();
                                            } catch (err) {
                                                alert('Không xóa được: ' + (err.response?.data?.message || err.message));
                                            }
                                        }}
                                    >
                                        Xóa
                                    </Button>
                                )}
                            </Stack>
                        </Box>
                    ))}
                    </Box>
                </CardContent>
            </Card>

            {/* Detail dialog */}
            <Dialog open={detailOpen} onClose={() => setDetailOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết kế hoạch</DialogTitle>
                <DialogContent dividers>
                    {detail ? (
                        <Box>
                            <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>{detail.title}</Typography>
                            <Box sx={{ display: 'grid', gridTemplateColumns: '40px 120px 200px 120px 120px', gap: 1, fontWeight: 'bold', mb: 1 }}>
                                <span></span><span>Thiết bị</span><span>Tiêu đề</span><span>Loại</span><span>Trạng thái</span>
                            </Box>
                            {detail.items?.map((it) => (
                                <Box key={it.id} sx={{ display: 'grid', gridTemplateColumns: '40px 120px 200px 120px 120px', gap: 1, alignItems: 'center', py: 0.5 }}>
                                    <Checkbox
                                        checked={detailSelected.includes(it.id)}
                                        onChange={() =>
                                            setDetailSelected((prev) =>
                                                prev.includes(it.id) ? prev.filter((x) => x !== it.id) : [...prev, it.id]
                                            )
                                        }
                                        disabled={it.status !== 'pending'}
                                    />
                                    <Typography variant="body2">{it.asset?.asset_code || ''}</Typography>
                                    <Typography variant="body2">{it.title}</Typography>
                                    <Typography variant="body2">{it.maintenance_type}</Typography>
                                    <Typography variant="body2">{it.status}</Typography>
                                </Box>
                            ))}
                        </Box>
                    ) : (
                        <Typography variant="body2">Đang tải...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailOpen(false)}>Đóng</Button>
                    <Button variant="outlined" color="error" onClick={async () => {
                        if (!detail || detailSelected.length === 0) return;
                        try {
                            await axios.post(`/maintenance-plan/${detail.id}/reject`, { itemIds: detailSelected });
                            setMessage(`Đã từ chối ${detailSelected.length} mục`);
                            setDetailOpen(false);
                            loadBatches();
                        } catch (err) {
                            setMessage(err.response?.data?.message || 'Không từ chối được');
                        }
                    }} disabled={detailSelected.length === 0}>Từ chối mục đã chọn</Button>
                    <Button variant="contained" onClick={async () => {
                        if (!detail) return;
                        try {
                            const res = await axios.post(`/maintenance-plan/${detail.id}/approve`, { itemIds: detailSelected });
                            setMessage(`Đã phê duyệt ${res.data.approved || 0} mục`);
                            setDetailOpen(false);
                            loadBatches();
                        } catch (err) {
                            setMessage(err.response?.data?.message || 'Không phê duyệt được');
                        }
                    }} disabled={detailSelected.length === 0}>Phê duyệt mục đã chọn</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
