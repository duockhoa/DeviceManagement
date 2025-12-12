import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Button,
    Fab,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Stack,
    MenuItem,
    Divider,
    Autocomplete,
    Switch,
    Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import axios from '../../services/customize-axios';
import { fetchUsers } from '../../redux/slice/usersSlice';
import { fetchAssets } from '../../redux/slice/assetsSlice';
import { getAllAreas } from '../../services/areasService';
import { getMechanicalElectricalTechniciansService } from '../../services/usersService';

const priorityMeta = {
    low: { label: 'Thấp', color: 'default' },
    medium: { label: 'Trung bình', color: 'info' },
    high: { label: 'Cao', color: 'warning' },
    critical: { label: 'Khẩn cấp', color: 'error' }
};

const statusMeta = {
    pending: { label: 'Chưa xử lý', color: 'warning' },
    assigned: { label: 'Đã phân công', color: 'info' },
    in_progress: { label: 'Đang xử lý', color: 'primary' },
    awaiting_confirm: { label: 'Chờ xác nhận', color: 'default' },
    closed: { label: 'Đã xử lý', color: 'success' },
    cancelled: { label: 'Hủy', color: 'default' },
    new: { label: 'Mới', color: 'info' }
};

const typeMeta = {
    support: 'Hỗ trợ',
    inspection: 'Kiểm tra',
    cleaning: 'Vệ sinh',
    repair_request: 'Sửa chữa',
    other: 'Khác'
};

export default function WorkRequests() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [openCreate, setOpenCreate] = useState(false);
    const [form, setForm] = useState({
        title: '',
        asset_id: '',
        type: 'support',
        priority: 'medium',
        description: '',
        due_date: '',
        unlinked_target: '',
        location: ''
    });
    const [detail, setDetail] = useState(null);
    const [openDetail, setOpenDetail] = useState(false);
    const [progressNote, setProgressNote] = useState('');
    const [progressStatus, setProgressStatus] = useState('');
    const [assignTech, setAssignTech] = useState('');
    const [isUnlinked, setIsUnlinked] = useState(false);
    const [areas, setAreas] = useState([]);
    const [technicians, setTechnicians] = useState([]);
    const user = useSelector((state) => state.user.userInfo);
    const users = useSelector((state) => state.users.users);
    const assets = useSelector((state) => state.assets.assets);
    const dispatch = useDispatch();
    const isAdmin = user?.employee_code === '0947';
    const location = useLocation();
    const isOpsView = location.pathname.includes('/work-requests/ops');

    const loadData = async () => {
        setLoading(true);
        try {
            const res = await axios.get('/work-requests');
            setItems(res.data.data || []);
        } catch (error) {
            console.error('Load work requests error:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
        dispatch(fetchUsers());
        dispatch(fetchAssets());
        getAllAreas()
            .then((res) => setAreas(Array.isArray(res) ? res : []))
            .catch(() => setAreas([]));
        getMechanicalElectricalTechniciansService()
            .then((res) => {
                const list = Array.isArray(res) ? res : [];
                // Bổ sung tài khoản 0947 để test tính năng
                if (user?.employee_code === '0947' && !list.find((u) => u.id === user.id)) {
                    list.unshift({ id: user.id, name: user.name, employee_code: user.employee_code });
                }
                setTechnicians(list);
            })
            .catch(() => setTechnicians([]));
    }, []);

    const columns = useMemo(
        () => ['#', 'Mã yêu cầu', 'Thiết bị', 'Loại', 'Ưu tiên', 'Trạng thái', 'Hạn', 'Tạo lúc', 'Hoàn thành', 'Người yêu cầu', 'KTV', 'Thao tác'],
        []
    );

    const handleCreate = async () => {
        if (!isUnlinked && !form.asset_id) {
            alert('Vui lòng chọn thiết bị hoặc bật chế độ không gắn thiết bị.');
            return;
        }
        if (isUnlinked && !form.unlinked_target.trim()) {
            alert('Vui lòng nhập đối tượng/địa điểm cho yêu cầu không gắn thiết bị.');
            return;
        }
        if (!form.title?.trim()) {
            alert('Vui lòng nhập tiêu đề yêu cầu.');
            return;
        }
        try {
            const descriptionPrefix = isUnlinked
                ? `[Không gắn thiết bị] ${form.unlinked_target}`
                : '';
            const composedDescription = descriptionPrefix
                ? `${descriptionPrefix}\n${form.description || ''}`.trim()
                : form.description;
            await axios.post('/work-requests', {
                ...form,
                asset_id: isUnlinked ? null : form.asset_id,
                description: composedDescription,
                location: form.location || null,
            });
            setOpenCreate(false);
            setForm({
                title: '',
                asset_id: '',
                type: 'support',
                priority: 'medium',
                description: '',
                due_date: '',
                unlinked_target: '',
                location: ''
            });
            setIsUnlinked(false);
            loadData();
        } catch (error) {
            alert('Không tạo được yêu cầu: ' + (error.response?.data?.message || error.message));
        }
    };

    const statusOptions = useMemo(
        () => [
            { value: 'pending', label: 'Chờ xử lý' },
            { value: 'assigned', label: 'Đã phân công' },
            { value: 'in_progress', label: 'Đang xử lý' },
            { value: 'awaiting_confirm', label: 'Chờ xác nhận' },
            { value: 'closed', label: 'Đã xử lý' },
            { value: 'cancelled', label: 'Hủy' }
        ],
        []
    );

    const openDetailDialog = async (id) => {
        try {
            const res = await axios.get(`/work-requests/${id}`);
            setDetail(res.data.data);
            setAssignTech(res.data.data.technician_id || '');
            setProgressStatus(res.data.data.status || '');
            setProgressNote('');
            setOpenDetail(true);
        } catch (error) {
            alert('Không tải được chi tiết: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUpdate = async () => {
        if (!detail) return;
        try {
            await axios.patch(`/work-requests/${detail.id}`, {
                technician_id: assignTech || null,
                status: progressStatus || detail.status
            });
            await loadData();
            const refreshed = await axios.get(`/work-requests/${detail.id}`);
            setDetail(refreshed.data.data);
            alert('Đã cập nhật yêu cầu');
        } catch (error) {
            alert('Không cập nhật được: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleAddProgress = async () => {};
    const handleCloseRequest = async () => {};

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
            <Paper elevation={0} sx={{ mb: 2, p: 2, bgcolor: '#fff', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                <Typography variant="h5" fontWeight="bold">
                    Yêu cầu xử lý
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Danh sách yêu cầu từ xưởng/đội cơ điện.
                </Typography>
            </Paper>

            <Paper variant="outlined" sx={{ p: 2, overflow: 'auto' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1" fontWeight="bold">
                        Danh sách yêu cầu
                    </Typography>
                </Box>

                <Box sx={{ minWidth: 1400, overflowX: 'auto' }}>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '40px 120px 140px 100px 100px 110px 110px 140px 140px 120px 120px 160px', fontWeight: 'bold', fontSize: '1.1rem', px: 1, py: 1, bgcolor: '#f8f9fa', borderRadius: 1, borderBottom: '2px solid #e0e0e0' }}>
                        {columns.map((c) => (
                            <span key={c} style={{ textAlign: 'center', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c}</span>
                        ))}
                    </Box>

                {items.length === 0 && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: 'center' }}>
                        Chưa có yêu cầu.
                    </Typography>
                )}

                {items.map((it, idx) => (
                    <Box
                        key={it.id}
                        sx={{
                            display: 'grid',
                            gridTemplateColumns: '40px 120px 140px 100px 100px 110px 110px 140px 140px 120px 120px 160px',
                            alignItems: 'center',
                            px: 1,
                            py: 1.5,
                            borderBottom: '1px solid #f0f0f0',
                            '&:hover': { bgcolor: '#f8f9fa' }
                        }}
                    >
                        <Typography variant="body2" textAlign="center" fontSize="1.1rem">{idx + 1}</Typography>
                        <Typography variant="body2" fontWeight="bold" textAlign="center" fontSize="1.1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.request_code}</Typography>
                        <Typography variant="body2" textAlign="center" fontSize="1.1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.asset?.asset_code || ''}</Typography>
                        <Typography variant="body2" textAlign="center" fontSize="1.1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{typeMeta[it.type] || it.type}</Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Chip size="small" label={priorityMeta[it.priority]?.label || it.priority} color={priorityMeta[it.priority]?.color || 'default'} sx={{ fontSize: '1rem', minWidth: 70 }} />
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Chip size="small" label={statusMeta[it.status]?.label || it.status} color={statusMeta[it.status]?.color || 'default'} sx={{ fontSize: '1rem', minWidth: 85 }} />
                        </Box>
                        <Typography variant="body2" textAlign="center" fontSize="1.1rem">{it.due_date ? new Date(it.due_date).toLocaleDateString('vi-VN') : '--'}</Typography>
                        <Typography variant="body2" textAlign="center" fontSize="1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.createdAt ? new Date(it.createdAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--'}</Typography>
                        <Typography variant="body2" textAlign="center" fontSize="1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.status === 'closed' && it.updatedAt ? new Date(it.updatedAt).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '--'}</Typography>
                        <Typography variant="body2" textAlign="center" fontSize="1.1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.requester?.name || ''}</Typography>
                        <Typography variant="body2" textAlign="center" fontSize="1.1rem" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.technician?.name || '--'}</Typography>
                        <Stack direction="row" spacing={1} justifyContent="center">
                            {isOpsView && (
                                <>
                                    <Button size="small" variant="outlined" onClick={() => openDetailDialog(it.id)}>Xem</Button>
                                    {isAdmin && (
                                        <Button
                                            size="small"
                                            color="error"
                                            variant="outlined"
                                            onClick={async () => {
                                                if (!window.confirm('Xóa yêu cầu này?')) return;
                                                try {
                                                    await axios.delete(`/work-requests/${it.id}`);
                                                    loadData();
                                                } catch (error) {
                                                    alert('Không xóa được: ' + (error.response?.data?.message || error.message));
                                                }
                                            }}
                                        >
                                            Xóa
                                        </Button>
                                    )}
                                </>
                            )}
                        </Stack>
                    </Box>
                ))}
                </Box>
            </Paper>

            <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Tạo yêu cầu xử lý</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField label="Tiêu đề" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} fullWidth />
                        <Autocomplete
                            options={assets}
                            getOptionLabel={(a) => `${a.asset_code || ''} - ${a.name || ''}`}
                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                            value={assets.find((a) => a.id === form.asset_id) || null}
                            onChange={(_, v) => setForm({ ...form, asset_id: v?.id || '' })}
                            disabled={isUnlinked}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.asset_code} - {option.name}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} label="Thiết bị" size="small" />}
                        />
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <Typography variant="body2">Không gắn thiết bị</Typography>
                            <Switch
                                checked={isUnlinked}
                                onChange={(e) => setIsUnlinked(e.target.checked)}
                                inputProps={{ 'aria-label': 'toggle-unlinked-work-request' }}
                            />
                        </Stack>
                        {isUnlinked && (
                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <TextField
                                    fullWidth
                                    size="small"
                                    label="Đối tượng/địa điểm"
                                    value={form.unlinked_target}
                                    onChange={(e) => setForm({ ...form, unlinked_target: e.target.value })}
                                    helperText="Ví dụ: Khu vực sơn, kho NVL, yêu cầu chung"
                                />
                            </Stack>
                        )}
                        <TextField select label="Loại" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} size="small">
                            {['support', 'inspection', 'cleaning', 'repair_request', 'other'].map((t) => (
                                <MenuItem key={t} value={t}>{typeMeta[t] || t}</MenuItem>
                            ))}
                        </TextField>
                        <TextField select label="Ưu tiên" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} size="small">
                            {['low', 'medium', 'high', 'critical'].map((p) => (
                                <MenuItem key={p} value={p}>{priorityMeta[p]?.label || p}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Ngày hạn xử lý"
                            type="date"
                            value={form.due_date}
                            onChange={(e) => setForm({ ...form, due_date: e.target.value })}
                            fullWidth
                            size="small"
                            InputLabelProps={{ shrink: true }}
                            helperText="Chọn ngày hạn xử lý"
                        />
                        <Autocomplete
                            options={areas}
                            getOptionLabel={(a) => a.name || ''}
                            isOptionEqualToValue={(opt, val) => opt.id === val.id}
                            value={areas.find((a) => a.name === form.location) || null}
                            onChange={(_, v) => setForm({ ...form, location: v?.name || '' })}
                            renderOption={(props, option) => (
                                <li {...props} key={option.id}>
                                    {option.name}
                                </li>
                            )}
                            renderInput={(params) => <TextField {...params} label="Địa điểm (khu vực)" size="small" helperText="Chọn khu vực trong xưởng" />}
                        />
                        <TextField label="Mô tả" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} fullWidth multiline rows={3} />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleCreate}>Tạo</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openDetail} onClose={() => setOpenDetail(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết yêu cầu</DialogTitle>
                <DialogContent dividers>
                    {detail ? (
                        <Box>
                            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} justifyContent="space-between" alignItems="flex-start">
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {detail.request_code} - {detail.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {typeMeta[detail.type] || detail.type} • Ưu tiên: {priorityMeta[detail.priority]?.label || detail.priority}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={statusMeta[detail.status]?.label || detail.status}
                                    color={statusMeta[detail.status]?.color || 'default'}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Stack>

                            <Grid container spacing={2} sx={{ mt: 2 }}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2"><strong>Thiết bị:</strong> {detail.asset?.asset_code ? `${detail.asset.asset_code} - ${detail.asset?.name}` : 'Không gắn thiết bị'}</Typography>
                                    <Typography variant="body2"><strong>Địa điểm:</strong> {detail.location || 'Chưa cập nhật'}</Typography>
                                    <Typography variant="body2"><strong>Người yêu cầu:</strong> {detail.requester?.name || 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Kỹ thuật viên:</strong> {detail.technician?.name || 'Chưa phân công'}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2"><strong>Ngày tạo:</strong> {detail.createdAt ? new Date(detail.createdAt).toLocaleString('vi-VN') : 'N/A'}</Typography>
                                    <Typography variant="body2"><strong>Hạn xử lý:</strong> {detail.due_date ? new Date(detail.due_date).toLocaleDateString('vi-VN') : 'Chưa đặt'}</Typography>
                                    <Typography variant="body2"><strong>Hoàn thành:</strong> {detail.status === 'closed' && detail.updatedAt ? new Date(detail.updatedAt).toLocaleString('vi-VN') : 'Chưa hoàn thành'}</Typography>
                                </Grid>
                                {detail.description && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>
                                            <strong>Mô tả:</strong> {detail.description}
                                        </Typography>
                                    </Grid>
                                )}
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Phân công</Typography>
                            <Stack spacing={2} sx={{ mb: 2 }}>
                                <TextField
                                    select
                                    label="Trạng thái"
                                    size="small"
                                    value={progressStatus}
                                    onChange={(e) => setProgressStatus(e.target.value)}
                                    disabled={!isAdmin}
                                >
                                    {statusOptions.map((s) => (
                                        <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                                    ))}
                                </TextField>
                                <Autocomplete
                                    options={technicians}
                                    getOptionLabel={(u) => u.name || ''}
                                    isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                    value={technicians.find((u) => u.id === assignTech) || null}
                                    onChange={(_, v) => setAssignTech(v?.id || '')}
                                    renderInput={(params) => <TextField {...params} label="Kỹ thuật viên (cơ điện)" size="small" disabled={!isAdmin} />}
                                    disabled={!isAdmin}
                                />
                                {isAdmin && (
                                    <Stack direction="row" spacing={1} flexWrap="wrap">
                                        <Button variant="contained" onClick={handleUpdate}>Cập nhật</Button>
                                        <Button variant="outlined" onClick={async () => {
                                            try {
                                                const res = await axios.post(`/work-requests/${detail.id}/create-maintenance`);
                                                alert(`Đã tạo lịch bảo trì: ${res.data.code}`);
                                            } catch (error) {
                                                alert('Không tạo được lịch: ' + (error.response?.data?.message || error.message));
                                            }
                                        }}>Tạo lịch bảo trì</Button>
                                        <Button variant="outlined" onClick={async () => {
                                            try {
                                                const res = await axios.post(`/work-requests/${detail.id}/create-incident-maintenance`);
                                                alert(`Đã tạo sự cố: ${res.data.incident_code} và lệnh bảo trì: ${res.data.maintenance_code}`);
                                            } catch (error) {
                                                alert('Không tạo được sự cố/bảo trì: ' + (error.response?.data?.message || error.message));
                                            }
                                        }}>Tạo sự cố</Button>
                                    </Stack>
                                )}
                            </Stack>

                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2" fontWeight="bold" sx={{ mb: 1 }}>Lịch sử tiến độ</Typography>
                            {detail.progress && detail.progress.length > 0 ? (
                                detail.progress.map((p) => (
                                    <Box key={p.id} sx={{ mb: 1, p: 1, bgcolor: '#fafafa', borderRadius: 1 }}>
                                        <Typography variant="body2" fontWeight="bold">{statusMeta[p.status]?.label || p.status}</Typography>
                                        {p.note && <Typography variant="body2">{p.note}</Typography>}
                                        <Typography variant="caption" color="text.secondary">
                                            {new Date(p.createdAt).toLocaleString('vi-VN')} - {p.creator?.name || ''}
                                        </Typography>
                                    </Box>
                                ))
                            ) : (
                                <Typography variant="body2" color="text.secondary">Chưa có tiến độ.</Typography>
                            )}
                        </Box>
                    ) : (
                        <Typography variant="body2">Đang tải...</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDetail(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Fab
                color="primary"
                aria-label="create-work-request"
                onClick={() => setOpenCreate(true)}
                sx={{ position: 'fixed', bottom: 24, right: 24, boxShadow: 6 }}
            >
                <AddIcon />
            </Fab>
        </Box>
    );
}
