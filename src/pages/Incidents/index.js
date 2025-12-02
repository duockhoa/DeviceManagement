import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
    Alert,
    Box,
    Button,
    Chip,
    IconButton,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    Paper,
    Stack,
    Switch,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    MenuItem
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchIncidents } from '../../redux/slice/incidentsSlice';
import Loading from '../../component/Loading';
import incidentsService from '../../services/incidentsService';
import { getAllAssets } from '../../services/assetsService';

const severityColor = (s) => ({
    critical: 'error',
    high: 'warning',
    medium: 'info',
    low: 'success'
}[s] || 'default');

function IncidentsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { incidents, loading, error } = useSelector((state) => state.incidents);
    const [openReport, setOpenReport] = useState(false);
    const [assets, setAssets] = useState([]);
    const [reportError, setReportError] = useState(null);
    const [reportSuccess, setReportSuccess] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [isUnlinked, setIsUnlinked] = useState(false);
    const [form, setForm] = useState({
        asset_id: '',
        title: '',
        description: '',
        severity: 'medium',
        impact: '',
        images: '',
        handover_required: false,
        handover_notes: '',
        follow_up_notes: '',
        unlinked_target: '',
        unlinked_location: ''
    });

    const severityOptions = useMemo(() => ([
        { value: 'critical', label: 'Khẩn cấp' },
        { value: 'high', label: 'Cao' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'low', label: 'Thấp' }
    ]), []);

    useEffect(() => {
        dispatch(fetchIncidents());
    }, [dispatch]);

    useEffect(() => {
        const loadAssets = async () => {
            try {
                const data = await getAllAssets();
                setAssets(data || []);
            } catch (_) {
                setAssets([]);
            }
        };
        loadAssets();
    }, []);

    const parseImages = (input) => {
        if (!input) return [];
        return input.split('\n').map((s) => s.trim()).filter(Boolean);
    };

    const handleSubmitReport = async (e) => {
        e.preventDefault();
        setReportError(null);
        setReportSuccess(null);
        if (!isUnlinked && !form.asset_id) {
            setReportError('Vui lòng chọn thiết bị hoặc bật chế độ không gắn thiết bị.');
            return;
        }
        if (isUnlinked && !form.unlinked_target.trim()) {
            setReportError('Vui lòng nhập đối tượng/địa điểm cho yêu cầu không gắn thiết bị.');
            return;
        }
        if (!form.title) {
            setReportError('Vui lòng nhập tiêu đề.');
            return;
        }
        try {
            setSubmitting(true);
            const descriptionPrefix = isUnlinked
                ? `[Không gắn thiết bị] ${form.unlinked_target}${form.unlinked_location ? ` - ${form.unlinked_location}` : ''}`
                : '';
            const composedDescription = descriptionPrefix
                ? `${descriptionPrefix}\n${form.description || ''}`.trim()
                : form.description;
            await incidentsService.createIncident({
                asset_id: isUnlinked ? null : Number(form.asset_id),
                title: form.title,
                description: composedDescription,
                severity: form.severity,
                impact: form.impact,
                images: parseImages(form.images),
                handover_required: form.handover_required,
                handover_notes: form.handover_notes,
                follow_up_notes: form.follow_up_notes
            });
            setReportSuccess('Đã gửi đánh giá sự cố.');
            setForm({
                asset_id: '',
                title: '',
                description: '',
                severity: 'medium',
                impact: '',
                images: '',
                handover_required: false,
                handover_notes: '',
                follow_up_notes: '',
                unlinked_target: '',
                unlinked_location: ''
            });
            setIsUnlinked(false);
            dispatch(fetchIncidents());
            setOpenReport(false);
        } catch (err) {
            setReportError(err?.toString?.() || 'Không thể gửi đánh giá.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Quản lý sự cố</Typography>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>{error.toString()}</Alert>
            )}

            <Paper>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Mã</TableCell>
                            <TableCell>Tiêu đề</TableCell>
                            <TableCell>Thiết bị</TableCell>
                            <TableCell>Mức độ</TableCell>
                            <TableCell>Trạng thái</TableCell>
                            <TableCell>Ngày báo cáo</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {(incidents || []).map(item => (
                            <TableRow key={item.id} hover>
                                <TableCell><strong>{item.incident_code}</strong></TableCell>
                                <TableCell>{item.title}</TableCell>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 500 }}>{item.asset?.name || 'N/A'}</Typography>
                                    <Typography variant="caption" color="text.secondary">{item.asset?.asset_code}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={item.severity} color={severityColor(item.severity)} size="small" />
                                </TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{item.reported_date ? new Date(item.reported_date).toLocaleDateString('vi-VN') : 'N/A'}</TableCell>
                                <TableCell align="center" sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        color="primary"
                                        startIcon={<VisibilityIcon fontSize="small" />}
                                        onClick={() => navigate(`/incidents/${item.id}`)}
                                        sx={{ textTransform: 'none', fontWeight: 600 }}
                                    >
                                        Xem
                                    </Button>
                                    <IconButton
                                        size="small"
                                        color="error"
                                        onClick={async () => {
                                            if (!window.confirm('Xóa sự cố này?')) return;
                                            try {
                                                await incidentsService.deleteIncident(item.id);
                                                dispatch(fetchIncidents());
                                            } catch (err) {
                                                alert(err?.toString?.() || 'Không thể xóa sự cố');
                                            }
                                        }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            <Dialog open={openReport} onClose={() => setOpenReport(false)} maxWidth="lg" fullWidth>
                <DialogTitle>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                        <Box>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Đánh giá sự cố</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ghi nhận thông tin sự cố, đánh giá ban đầu và yêu cầu bàn giao nếu cần.
                            </Typography>
                        </Box>
                        <Button onClick={() => setOpenReport(false)} color="inherit">Đóng</Button>
                    </Stack>
                </DialogTitle>
                <DialogContent dividers>
                    {reportError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {reportError}
                        </Alert>
                    )}
                    {reportSuccess && (
                        <Alert severity="success" sx={{ mb: 2 }}>
                            {reportSuccess}
                        </Alert>
                    )}
                    <Box component="form" onSubmit={handleSubmitReport}>
                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Thông tin sự cố
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Thiết bị"
                                        value={form.asset_id}
                                        onChange={(e) => setForm((p) => ({ ...p, asset_id: e.target.value }))}
                                        helperText="Chọn thiết bị gặp sự cố"
                                        disabled={isUnlinked}
                                    >
                                        {assets.map((asset) => (
                                            <MenuItem key={asset.id} value={asset.id}>
                                                {asset.name} ({asset.asset_code})
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Stack direction="row" alignItems="center" spacing={1} sx={{ height: '100%' }}>
                                        <Typography variant="body2">Không gắn thiết bị</Typography>
                                        <Switch
                                            checked={isUnlinked}
                                            onChange={(e) => setIsUnlinked(e.target.checked)}
                                            inputProps={{ 'aria-label': 'toggle-unlinked-request' }}
                                        />
                                    </Stack>
                                </Grid>
                                {isUnlinked && (
                                    <Grid item xs={12}>
                                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Đối tượng/địa điểm"
                                                value={form.unlinked_target}
                                                onChange={(e) => setForm((p) => ({ ...p, unlinked_target: e.target.value }))}
                                                helperText="Ví dụ: Khu vực sảnh chính, hệ thống HVAC, yêu cầu chung"
                                            />
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label="Thông tin bổ sung"
                                                value={form.unlinked_location}
                                                onChange={(e) => setForm((p) => ({ ...p, unlinked_location: e.target.value }))}
                                                helperText="Địa điểm, liên hệ hoặc ghi chú ngắn"
                                            />
                                        </Stack>
                                    </Grid>
                                )}
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        select
                                        fullWidth
                                        label="Mức độ"
                                        value={form.severity}
                                        onChange={(e) => setForm((p) => ({ ...p, severity: e.target.value }))}
                                    >
                                        {severityOptions.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        required
                                        label="Tiêu đề sự cố"
                                        value={form.title}
                                        onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={4}
                                        label="Mô tả sự cố"
                                        value={form.description}
                                        onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Ảnh hưởng & đính kèm
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Ảnh hưởng (nếu có)"
                                        value={form.impact}
                                        onChange={(e) => setForm((p) => ({ ...p, impact: e.target.value }))}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Ảnh đính kèm (mỗi dòng một URL)"
                                        value={form.images}
                                        onChange={(e) => setForm((p) => ({ ...p, images: e.target.value }))}
                                        placeholder="https://.../image1.jpg\nhttps://.../image2.jpg"
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2 }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Bàn giao (tùy chọn)
                                </Typography>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <Typography variant="body2">Không</Typography>
                                    <Switch
                                        checked={form.handover_required}
                                        onChange={(e) => setForm((p) => ({ ...p, handover_required: e.target.checked }))}
                                    />
                                    <Typography variant="body2">Cần bàn giao</Typography>
                                </Stack>
                            </Stack>
                            {form.handover_required ? (
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            label="Thông tin bàn giao"
                                            helperText="Người nhận, thời gian, địa điểm, hướng dẫn cụ thể..."
                                            value={form.handover_notes}
                                            onChange={(e) => setForm((p) => ({ ...p, handover_notes: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={3}
                                            label="Theo dõi sau bàn giao"
                                            helperText="Kế hoạch kiểm tra/giám sát sau khi bàn giao."
                                            value={form.follow_up_notes}
                                            onChange={(e) => setForm((p) => ({ ...p, follow_up_notes: e.target.value }))}
                                        />
                                    </Grid>
                                </Grid>
                            ) : (
                                <Typography color="text.secondary">
                                    Bật “Cần bàn giao” nếu thiết bị phải chuyển giao cho bộ phận khác.
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenReport(false)}>Đóng</Button>
                    <Button onClick={handleSubmitReport} variant="contained" disabled={submitting}>
                        {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                    </Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}

export default IncidentsPage;
