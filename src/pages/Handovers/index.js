import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Fab,
    Grid,
    IconButton,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import handoversService from '../../services/handoversService';
import { getAllAssets } from '../../services/assetsService';
import { getAllDepartments } from '../../services/departmentService';

const emptyItem = { name: '', condition: '', quantity: 1, note: '' };

function Handovers() {
    const [list, setList] = useState([]);
    const [assets, setAssets] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [form, setForm] = useState({
        asset_id: '',
        fromDept: '',
        toDept: '',
        reason: '',
        items: [emptyItem]
    });

    const load = async () => {
        const data = await handoversService.list();
        setList(data);
    };

    useEffect(() => {
        const init = async () => {
            load();
            try {
                const [assetsData, deptData] = await Promise.all([getAllAssets(), getAllDepartments()]);
                setAssets(assetsData || []);
                setDepartments(deptData || []);
            } catch (err) {
                setError('Không tải được danh sách thiết bị hoặc bộ phận. Vui lòng thử lại.');
            }
        };
        init();
    }, []);

    const updateItem = (idx, field, value) => {
        setForm((prev) => {
            const items = prev.items.map((item, i) => (i === idx ? { ...item, [field]: value } : item));
            return { ...prev, items };
        });
    };

    const addItem = () => setForm((prev) => ({ ...prev, items: [...prev.items, emptyItem] }));
    const removeItem = (idx) =>
        setForm((prev) => ({ ...prev, items: prev.items.filter((_, i) => i !== idx) }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.asset_id || !form.fromDept || !form.toDept || !form.reason) {
            setError('Vui lòng chọn thiết bị và nhập đầy đủ bộ phận bàn giao, tiếp nhận và lý do.');
            return;
        }
        if (form.items.some((i) => !i.name || !i.condition)) {
            setError('Mọi hạng mục bàn giao cần ghi rõ tên và tình trạng.');
            return;
        }

        const asset = assets.find((a) => Number(a.id) === Number(form.asset_id));
        await handoversService.create({
            ...form,
            asset_code: asset?.asset_code,
            asset_name: asset?.name
        });
        setSuccess('Đã tạo lệnh bàn giao.');
        setForm({ asset_id: '', fromDept: '', toDept: '', reason: '', items: [emptyItem] });
        setOpenDialog(false);
        load();
    };

    const handleAccept = async (id) => {
        await handoversService.accept(id);
        load();
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f6fa', position: 'relative', minHeight: '100vh' }}>
            <Paper elevation={0} sx={{ mb: 2, p: 2, bgcolor: '#fff', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem', mb: 0.5 }}>
                    Lệnh bàn giao thiết bị
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                    Ghi nhận bộ phận bàn giao, bộ phận tiếp nhận và danh sách hạng mục bàn giao kèm tình trạng.
                </Typography>
            </Paper>

            {success && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess(null)}>
                    {success}
                </Alert>
            )}

            <Paper variant="outlined" sx={{ p: 2 }}>
                <Table size="small" sx={{ '& .MuiTableCell-root': { fontSize: '1.2rem' } }}>
                    <TableHead>
                        <TableRow sx={{ backgroundColor: '#f8f9fa' }}>
                            <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Bộ phận bàn giao</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Bộ phận tiếp nhận</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Thiết bị</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Lý do</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', borderBottom: '2px solid #e0e0e0' }}>Trạng thái</TableCell>
                            <TableCell sx={{ borderBottom: '2px solid #e0e0e0' }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {list.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                                    <Typography color="text.secondary">Chưa có lệnh bàn giao nào</Typography>
                                </TableCell>
                            </TableRow>
                        )}
                        {list.map((h) => (
                            <TableRow key={h.id} hover sx={{ '& .MuiTableCell-root': { borderBottom: '1px solid #f0f0f0' } }}>
                                <TableCell>{h.fromDept}</TableCell>
                                <TableCell>{h.toDept}</TableCell>
                                <TableCell>
                                    <Typography sx={{ fontWeight: 500, fontSize: '1.2rem' }}>{h.asset_name || 'N/A'}</Typography>
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                        {h.asset_code}
                                    </Typography>
                                </TableCell>
                                <TableCell>{h.reason}</TableCell>
                                <TableCell>
                                    {h.status === 'pending' && 'Chờ tiếp nhận'}
                                    {h.status === 'accepted' && 'Đã tiếp nhận'}
                                    {h.status === 'follow_up' && 'Đang theo dõi'}
                                    {h.status === 'closed' && 'Đã đóng'}
                                </TableCell>
                                <TableCell>
                                    {h.status === 'pending' && (
                                        <Button size="small" onClick={() => handleAccept(h.id)}>
                                            Tiếp nhận
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>

            {/* Dialog tạo lệnh bàn giao */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>
                    <Typography variant="h6" fontWeight="bold">Tạo lệnh bàn giao mới</Typography>
                </DialogTitle>
                <DialogContent dividers>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} id="handover-form">
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Thiết bị bàn giao"
                                value={form.asset_id}
                                onChange={(e) => setForm((p) => ({ ...p, asset_id: e.target.value }))}
                            >
                                {assets.map((asset) => (
                                    <MenuItem key={asset.id} value={asset.id}>
                                        {asset.name} ({asset.asset_code})
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Bộ phận bàn giao"
                                value={form.fromDept}
                                onChange={(e) => setForm((p) => ({ ...p, fromDept: e.target.value }))}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id || dept.name} value={dept.name}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <TextField
                                select
                                fullWidth
                                label="Bộ phận tiếp nhận"
                                value={form.toDept}
                                onChange={(e) => setForm((p) => ({ ...p, toDept: e.target.value }))}
                            >
                                {departments.map((dept) => (
                                    <MenuItem key={dept.id || dept.name} value={dept.name}>
                                        {dept.name}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                multiline
                                minRows={2}
                                label="Lý do bàn giao"
                                value={form.reason}
                                onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    Hạng mục bàn giao
                                </Typography>
                                <Button startIcon={<AddIcon />} onClick={addItem}>
                                    Thêm hạng mục
                                </Button>
                            </Stack>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên hạng mục</TableCell>
                                        <TableCell>Tình trạng</TableCell>
                                        <TableCell>Số lượng</TableCell>
                                        <TableCell>Ghi chú</TableCell>
                                        <TableCell></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {form.items.map((item, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={item.name}
                                                    onChange={(e) => updateItem(idx, 'name', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={item.condition}
                                                    onChange={(e) => updateItem(idx, 'condition', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    type="number"
                                                    size="small"
                                                    inputProps={{ min: 1 }}
                                                    value={item.quantity}
                                                    onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={item.note}
                                                    onChange={(e) => updateItem(idx, 'note', e.target.value)}
                                                />
                                            </TableCell>
                                            <TableCell width={60}>
                                                <IconButton onClick={() => removeItem(idx)} disabled={form.items.length === 1}>
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                    </Grid>
                </Box>
                </DialogContent>
                <DialogActions sx={{ px: 3, py: 2 }}>
                    <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
                    <Button type="submit" form="handover-form" variant="contained">
                        Tạo lệnh bàn giao
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Floating Action Button */}
            <Fab
                color="primary"
                aria-label="add"
                onClick={() => setOpenDialog(true)}
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

export default Handovers;
