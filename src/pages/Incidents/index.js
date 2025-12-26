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
    MenuItem,
    Autocomplete,
    FormControl,
    InputLabel,
    Select
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import { fetchIncidents } from '../../redux/slice/incidentsSlice';
import Loading from '../../component/Loading';
import incidentsService from '../../services/incidentsService';
import { getAllAssets } from '../../services/assetsService';
import {
    INCIDENT_CATEGORY_LABELS,
    INCIDENT_STATUS_LABELS,
    FACILITY_TYPE_LABELS,
    SYSTEM_TYPE_LABELS,
    OPERATION_TYPE_LABELS,
    NOTIFICATION_TYPE_LABELS
} from '../../constants/flowMaps';

const severityColor = (s) => ({
    critical: 'error',
    high: 'warning',
    medium: 'info',
    low: 'success'
}[s] || 'default');

const severityLabel = (s) => ({
    critical: 'Khẩn cấp',
    high: 'Cao',
    medium: 'Trung bình',
    low: 'Thấp'
}[s] || s);

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
        incident_category: 'EQUIPMENT',
        notification_type: 'M2',
        asset_id: '',
        facility_type: '',
        system_type: '',
        operation_type: '',
        building: '',
        floor: '',
        room: '',
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
        
        // Validation theo category
        const category = form.incident_category;
        if (category === 'EQUIPMENT' && !form.asset_id) {
            setReportError('Vui lòng chọn thiết bị.');
            return;
        }
        if (category === 'FACILITY' && !form.facility_type) {
            setReportError('Vui lòng chọn loại cơ sở.');
            return;
        }
        if (category === 'SYSTEM' && !form.system_type) {
            setReportError('Vui lòng chọn loại hệ thống.');
            return;
        }
        if (category === 'OPERATION' && !form.operation_type) {
            setReportError('Vui lòng chọn loại yêu cầu.');
            return;
        }
        if (!form.title) {
            setReportError('Vui lòng nhập tiêu đề.');
            return;
        }
        
        try {
            setSubmitting(true);
            await incidentsService.createIncident({
                incident_category: form.incident_category,
                notification_type: form.notification_type || null,
                asset_id: category === 'EQUIPMENT' ? Number(form.asset_id) : null,
                facility_type: category === 'FACILITY' ? form.facility_type : null,
                system_type: category === 'SYSTEM' ? form.system_type : null,
                operation_type: category === 'OPERATION' ? form.operation_type : null,
                building: form.building || null,
                floor: form.floor || null,
                room: form.room || null,
                title: form.title,
                description: form.description,
                severity: form.severity,
                impact: form.impact,
                images: parseImages(form.images),
                handover_required: form.handover_required,
                handover_notes: form.handover_notes,
                follow_up_notes: form.follow_up_notes
            });
            setReportSuccess('Đã tạo sự cố thành công!');
            setForm({
                incident_category: 'EQUIPMENT',
                notification_type: 'M2',
                asset_id: '',
                facility_type: '',
                system_type: '',
                operation_type: '',
                building: '',
                floor: '',
                room: '',
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
        <Box sx={{ p: 3, position: 'relative' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
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
                            <TableCell>Loại</TableCell>
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
                                    <Chip 
                                        label={INCIDENT_CATEGORY_LABELS[item.incident_category] || item.incident_category} 
                                        size="small" 
                                        color={
                                            item.incident_category === 'EQUIPMENT' ? 'primary' :
                                            item.incident_category === 'FACILITY' ? 'secondary' :
                                            item.incident_category === 'SYSTEM' ? 'warning' : 'info'
                                        }
                                    />
                                </TableCell>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 500 }}>{item.asset?.name || 'N/A'}</Typography>
                                    <Typography variant="caption" color="text.secondary">{item.asset?.asset_code}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Chip label={severityLabel(item.severity)} color={severityColor(item.severity)} size="small" />
                                </TableCell>
                                <TableCell>
                                    <Chip 
                                        label={INCIDENT_STATUS_LABELS[item.status] || item.status}
                                        size="small"
                                        variant="outlined"
                                    />
                                </TableCell>
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
                                Loại sự cố
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        select
                                        fullWidth
                                        required
                                        label="Phân loại sự cố"
                                        value={form.incident_category}
                                        onChange={(e) => {
                                            const cat = e.target.value;
                                            setForm((p) => ({ 
                                                ...p, 
                                                incident_category: cat,
                                                // Clear category-specific fields
                                                asset_id: cat === 'EQUIPMENT' ? p.asset_id : '',
                                                facility_type: '',
                                                system_type: '',
                                                operation_type: ''
                                            }));
                                            setIsUnlinked(cat !== 'EQUIPMENT');
                                        }}
                                    >
                                        {Object.entries(INCIDENT_CATEGORY_LABELS).map(([key, label]) => (
                                            <MenuItem key={key} value={key}>
                                                {label}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Grid>
                            </Grid>
                        </Paper>

                        <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Thông tin chi tiết
                            </Typography>
                            <Grid container spacing={2}>
                                {/* EQUIPMENT - Thiết bị */}
                                {form.incident_category === 'EQUIPMENT' && (
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            fullWidth
                                            required
                                            label="Thiết bị"
                                            value={form.asset_id}
                                            onChange={(e) => setForm((p) => ({ ...p, asset_id: e.target.value }))}
                                            helperText="Chọn thiết bị gặp sự cố"
                                        >
                                            {assets.map((asset) => (
                                                <MenuItem key={asset.id} value={asset.id}>
                                                    {asset.name} ({asset.asset_code})
                                                </MenuItem>
                                            ))}
                                        </TextField>
                                    </Grid>
                                )}

                                {/* FACILITY - Nhà xưởng/Cơ sở hạ tầng */}
                                {form.incident_category === 'FACILITY' && (
                                    <>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                required
                                                label="Loại cơ sở"
                                                value={form.facility_type}
                                                onChange={(e) => setForm((p) => ({ ...p, facility_type: e.target.value }))}
                                            >
                                                {Object.entries(FACILITY_TYPE_LABELS).map(([key, label]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Tòa nhà"
                                                value={form.building}
                                                onChange={(e) => setForm((p) => ({ ...p, building: e.target.value }))}
                                                placeholder="Ví dụ: Nhà A, Kho B"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Tầng"
                                                value={form.floor}
                                                onChange={(e) => setForm((p) => ({ ...p, floor: e.target.value }))}
                                                placeholder="Ví dụ: Tầng 2, Tầng trệt"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Phòng/Khu vực"
                                                value={form.room}
                                                onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
                                                placeholder="Ví dụ: P201, Hành lang"
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* SYSTEM - Hệ thống điện/nước/khí */}
                                {form.incident_category === 'SYSTEM' && (
                                    <>
                                        <Grid item xs={12}>
                                            <TextField
                                                select
                                                fullWidth
                                                required
                                                label="Loại hệ thống"
                                                value={form.system_type}
                                                onChange={(e) => setForm((p) => ({ ...p, system_type: e.target.value }))}
                                            >
                                                {Object.entries(SYSTEM_TYPE_LABELS).map(([key, label]) => (
                                                    <MenuItem key={key} value={key}>
                                                        {label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Tòa nhà"
                                                value={form.building}
                                                onChange={(e) => setForm((p) => ({ ...p, building: e.target.value }))}
                                                placeholder="Ví dụ: Nhà A, Toàn nhà máy"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Tầng"
                                                value={form.floor}
                                                onChange={(e) => setForm((p) => ({ ...p, floor: e.target.value }))}
                                                placeholder="Ví dụ: Tầng 2, Tất cả"
                                            />
                                        </Grid>
                                        <Grid item xs={12} md={4}>
                                            <TextField
                                                fullWidth
                                                label="Khu vực"
                                                value={form.room}
                                                onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
                                                placeholder="Ví dụ: Khu vực sản xuất"
                                            />
                                        </Grid>
                                    </>
                                )}

                                {/* OPERATION - Vận hành/Yêu cầu */}
                                {form.incident_category === 'OPERATION' && (
                                    <Grid item xs={12}>
                                        <TextField
                                            select
                                            fullWidth
                                            required
                                            label="Loại yêu cầu"
                                            value={form.operation_type}
                                            onChange={(e) => setForm((p) => ({ ...p, operation_type: e.target.value }))}
                                        >
                                            {Object.entries(OPERATION_TYPE_LABELS).map(([key, label]) => (
                                                <MenuItem key={key} value={key}>
                                                    {label}
                                                </MenuItem>
                                            ))}
                                        </TextField>
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

            <Fab 
                color="primary" 
                aria-label="add"
                onClick={() => setOpenReport(true)}
                sx={{
                    position: 'fixed',
                    bottom: 24,
                    right: 24,
                    zIndex: 1000
                }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}

export default IncidentsPage;
