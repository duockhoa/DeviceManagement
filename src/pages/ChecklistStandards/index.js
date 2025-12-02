import { useEffect, useRef, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    Stack,
    Checkbox,
    MenuItem,
    Chip,
    Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import RefreshIcon from '@mui/icons-material/Refresh';
import * as XLSX from 'xlsx';
import checklistStandardService from '../../services/checklistStandardService';
import SubSidebarSpecification from '../../component/LayoutComponent/SubSidebarSpecification';

const emptyItem = () => ({
    id: Date.now(),
    task: '',
    check_item: '',
    standard_value: '',
    method: '',
    required: false
});

const MAINTENANCE_TYPES = [
    { value: 'all', label: 'Tất cả', color: 'default' },
    { value: 'cleaning', label: 'Vệ sinh', color: 'info' },
    { value: 'inspection', label: 'Kiểm tra', color: 'primary' },
    { value: 'maintenance', label: 'Bảo trì', color: 'warning' },
    { value: 'corrective', label: 'Sửa chữa', color: 'error' }
];

function ChecklistStandards() {
    const [standards, setStandards] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [maintenanceType, setMaintenanceType] = useState('all');
    const [items, setItems] = useState([emptyItem()]);
    const [importMessage, setImportMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef(null);

    const load = async () => {
        try {
            setLoading(true);
            setError('');
            const data = await checklistStandardService.list();
            setStandards(data);
        } catch (err) {
            setError('Lỗi khi tải dữ liệu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setMaintenanceType('all');
        setItems([emptyItem()]);
    };

    const handleSave = async () => {
        if (!name.trim()) {
            setError('Vui lòng nhập tên checklist');
            return;
        }
        if (items.length === 0 || !items.some(i => i.task?.trim())) {
            setError('Vui lòng thêm ít nhất 1 hạng mục');
            return;
        }

        try {
            setLoading(true);
            setError('');
            const payload = {
                name,
                description,
                maintenance_type: maintenanceType,
                items: items.filter(i => i.task?.trim()).map(({ id, ...rest }) => rest)
            };
            
            if (editingId) {
                await checklistStandardService.update(editingId, payload);
            } else {
                await checklistStandardService.create(payload);
            }
            resetForm();
            setOpen(false);
            load();
        } catch (err) {
            setError('Lỗi khi lưu: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (std) => {
        setEditingId(std.id);
        setName(std.name || '');
        setDescription(std.description || '');
        setMaintenanceType(std.maintenance_type || 'all');
        setItems(
            (std.items || []).map((it, idx) => ({
                id: Date.now() + idx,
                task: it.task || it.name || '',
                check_item: it.check_item || '',
                standard_value: it.standard_value || '',
                method: it.method || '',
                required: Boolean(it.required)
            }))
        );
        setOpen(true);
    };

    const handleSeedDefaults = async () => {
        if (!window.confirm('Tạo 4 mẫu checklist mặc định?\n(Vệ sinh, Kiểm tra, Bảo trì, Sửa chữa)')) {
            return;
        }
        try {
            setLoading(true);
            setError('');
            await checklistStandardService.seedDefaults();
            setImportMessage('✅ Đã tạo 4 mẫu checklist mặc định thành công!');
            setTimeout(() => setImportMessage(''), 5000);
            load();
        } catch (err) {
            setError('Lỗi khi tạo mẫu mặc định: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const addItem = () => {
        setItems((prev) => [...prev, emptyItem()]);
    };

    const updateItem = (id, field, value) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            <Box sx={{ width: '300px', minWidth: '300px' }}>
                <SubSidebarSpecification />
            </Box>

            <Box sx={{ flex: 1, p: 2, backgroundColor: '#f6f8fb' }}>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                        {error}
                    </Alert>
                )}

                <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tiêu chuẩn checklist</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tạo nhóm checklist chuẩn (nhiều hạng mục) để dùng khi lập lịch bảo trì.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            color="secondary"
                            startIcon={<RefreshIcon />}
                            onClick={handleSeedDefaults}
                            disabled={loading}
                        >
                            Tạo mẫu mặc định
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            onClick={() => {
                                const wb = XLSX.utils.book_new();
                                const sample = [
                                    {
                                        'Tên checklist': 'Checklist mẫu 1',
                                        'Mô tả': 'Mô tả checklist 1',
                                        'Nội dung': 'Kiểm tra nguồn',
                                        'Hạng mục': 'Điện áp',
                                        'Tiêu chuẩn OK': '220V ±10%',
                                        'Phương pháp': 'Dùng đồng hồ',
                                        'Bắt buộc': 1
                                    },
                                    {
                                        'Tên checklist': 'Checklist mẫu 1',
                                        'Mô tả': 'Mô tả checklist 1',
                                        'Nội dung': 'Kiểm tra vệ sinh',
                                        'Hạng mục': 'Bụi bẩn',
                                        'Tiêu chuẩn OK': 'Sạch sẽ',
                                        'Phương pháp': 'Quan sát',
                                        'Bắt buộc': 0
                                    },
                                    {
                                        'Tên checklist': 'Checklist mẫu 2',
                                        'Mô tả': 'Mô tả checklist 2',
                                        'Nội dung': 'Bôi trơn',
                                        'Hạng mục': 'Vòng bi',
                                        'Tiêu chuẩn OK': 'Đầy đủ dầu mỡ',
                                        'Phương pháp': 'Quan sát',
                                        'Bắt buộc': 1
                                    }
                                ];
                                const ws = XLSX.utils.json_to_sheet(sample);
                                XLSX.utils.book_append_sheet(wb, ws, 'Checklist');
                                XLSX.writeFile(wb, 'mau-checklist.xlsx');
                            }}
                        >
                            Tải mẫu Excel
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            onClick={() => fileInputRef.current?.click()}
                        >
                            Import Excel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => {
                                resetForm();
                                setOpen(true);
                            }}
                        >
                            Thêm checklist chuẩn
                        </Button>
                    </Stack>
                </Paper>

                {importMessage && (
                    <Paper sx={{ p: 2, mb: 2 }} variant="outlined">
                        <Typography variant="body2" color="text.secondary">
                            {importMessage}
                        </Typography>
                    </Paper>
                )}

                <Paper sx={{ p: 2 }}>
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Tên checklist</TableCell>
                                <TableCell>Loại bảo trì</TableCell>
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Số hạng mục</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {standards.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} align="center">
                                        <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                                            {loading ? 'Đang tải...' : 'Chưa có checklist nào. Nhấn "Tạo mẫu mặc định" để bắt đầu.'}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                standards.map((std) => {
                                    const typeInfo = MAINTENANCE_TYPES.find(t => t.value === std.maintenance_type) || MAINTENANCE_TYPES[0];
                                    return (
                                        <TableRow key={std.id} hover>
                                            <TableCell>{std.name}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={typeInfo.label} 
                                                    color={typeInfo.color}
                                                    size="small"
                                                />
                                            </TableCell>
                                            <TableCell>{std.description}</TableCell>
                                            <TableCell>{std.items?.length || 0}</TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleEdit(std)}>
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton 
                                                    size="small" 
                                                    onClick={async () => { 
                                                        if (window.confirm('Xóa checklist này?')) {
                                                            await checklistStandardService.remove(std.id); 
                                                            load(); 
                                                        }
                                                    }}
                                                >
                                                    <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            </Box>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>{editingId ? 'Sửa checklist chuẩn' : 'Thêm checklist chuẩn'}</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Tên checklist"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            select
                            label="Loại bảo trì áp dụng"
                            value={maintenanceType}
                            onChange={(e) => setMaintenanceType(e.target.value)}
                            fullWidth
                            required
                        >
                            {MAINTENANCE_TYPES.map(type => (
                                <MenuItem key={type.value} value={type.value}>
                                    {type.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Mô tả"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            minRows={2}
                        />
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Hạng mục tiêu chuẩn</Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nội dung</TableCell>
                                    <TableCell>Hạng mục</TableCell>
                                    <TableCell>Tiêu chuẩn OK</TableCell>
                                    <TableCell>Phương pháp</TableCell>
                                    <TableCell>Bắt buộc</TableCell>
                                    <TableCell></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {items.map((it) => (
                                    <TableRow key={it.id}>
                                        <TableCell width="20%">
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={it.task}
                                                onChange={(e) => updateItem(it.id, 'task', e.target.value)}
                                                placeholder="Nội dung"
                                            />
                                        </TableCell>
                                        <TableCell width="20%">
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={it.check_item}
                                                onChange={(e) => updateItem(it.id, 'check_item', e.target.value)}
                                                placeholder="Hạng mục"
                                            />
                                        </TableCell>
                                        <TableCell width="20%">
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={it.standard_value}
                                                onChange={(e) => updateItem(it.id, 'standard_value', e.target.value)}
                                                placeholder="Tiêu chuẩn OK"
                                            />
                                        </TableCell>
                                        <TableCell width="20%">
                                            <TextField
                                                size="small"
                                                fullWidth
                                                value={it.method}
                                                onChange={(e) => updateItem(it.id, 'method', e.target.value)}
                                                placeholder="Phương pháp"
                                            />
                                        </TableCell>
                                        <TableCell width="10%">
                                            <Checkbox
                                                checked={it.required}
                                                onChange={(e) => updateItem(it.id, 'required', e.target.checked)}
                                            />
                                        </TableCell>
                                        <TableCell width="10%">
                                            <IconButton size="small" onClick={() => removeItem(it.id)}>
                                                <DeleteIcon fontSize="small" />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Button startIcon={<AddIcon />} onClick={addItem} variant="outlined" size="small" sx={{ alignSelf: 'flex-start' }}>
                            Thêm hạng mục
                        </Button>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Hủy</Button>
                    <Button variant="contained" onClick={handleSave}>Lưu</Button>
                </DialogActions>
            </Dialog>

            {/* Hidden input for Excel import */}
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    try {
                        const data = await file.arrayBuffer();
                        const wb = XLSX.read(data);
                        const sheet = wb.Sheets[wb.SheetNames[0]];
                        const rows = XLSX.utils.sheet_to_json(sheet, { defval: '' });
                        const grouped = {};
                        rows.forEach((r) => {
                            const checklistName = r['Tên checklist'] || r.checklist_name || r.name || 'Checklist';
                            const desc = r['Mô tả'] || r.description || '';
                            const task = r['Nội dung'] || r.task || r.name || '';
                            const checkItem = r['Hạng mục'] || r.check_item || '';
                            const stdVal = r['Tiêu chuẩn OK'] || r.standard_value || '';
                            const method = r['Phương pháp'] || r.method || '';
                            const requiredVal = r['Bắt buộc'] ?? r.required;

                            if (!grouped[checklistName]) {
                                grouped[checklistName] = {
                                    name: checklistName,
                                    description: desc,
                                    items: []
                                };
                            }
                            grouped[checklistName].items.push({
                                task,
                                check_item: checkItem,
                                standard_value: stdVal,
                                method,
                                required: String(requiredVal).toLowerCase() === 'true' || requiredVal === 1 || requiredVal === '1'
                            });
                        });
                        const standards = Object.values(grouped);
                        await Promise.all(standards.map((std) => checklistStandardService.create(std)));
                        setImportMessage(`Đã import ${standards.length} checklist từ file ${file.name}`);
                        load();
                    } catch (err) {
                        setImportMessage(`Import thất bại: ${err.message || err}`);
                    } finally {
                        e.target.value = '';
                    }
                }}
            />
        </Box>
    );
}

export default ChecklistStandards;
