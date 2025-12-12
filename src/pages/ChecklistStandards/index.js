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
    Menu,
    MenuItem,
    useMediaQuery,
    useTheme
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import UploadIcon from '@mui/icons-material/Upload';
import DownloadIcon from '@mui/icons-material/Download';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
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

function ChecklistStandards() {
    const [standards, setStandards] = useState([]);
    const [open, setOpen] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [items, setItems] = useState([emptyItem()]);
    const [importMessage, setImportMessage] = useState('');
    const [anchorEl, setAnchorEl] = useState(null);
    const fileInputRef = useRef(null);

    const load = async () => {
        const data = await checklistStandardService.list();
        setStandards(data);
    };

    useEffect(() => {
        load();
    }, []);

    const resetForm = () => {
        setEditingId(null);
        setName('');
        setDescription('');
        setItems([emptyItem()]);
    };

    const handleSave = async () => {
        if (!name.trim()) return;
        const payload = {
            name,
            description,
            items: items.map(({ id, ...rest }) => rest)
        };
        if (editingId) {
            await checklistStandardService.update(editingId, payload);
        } else {
            await checklistStandardService.create(payload);
        }
        resetForm();
        setOpen(false);
        load();
    };

    const handleEdit = (std) => {
        setEditingId(std.id);
        setName(std.name || '');
        setDescription(std.description || '');
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

    const addItem = () => {
        setItems((prev) => [...prev, emptyItem()]);
    };

    const updateItem = (id, field, value) => {
        setItems((prev) => prev.map((it) => (it.id === id ? { ...it, [field]: value } : it)));
    };

    const removeItem = (id) => {
        setItems((prev) => prev.filter((it) => it.id !== id));
    };

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownloadTemplate = () => {
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
        handleMenuClose();
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
        handleMenuClose();
    };

    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {isLargeScreen && (
                <Box sx={{ width: '300px', minWidth: '300px' }}>
                    <SubSidebarSpecification />
                </Box>
            )}

            <Box sx={{ flex: 1, p: 2, backgroundColor: '#f6f8fb' }}>
                <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Tiêu chuẩn checklist</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Tạo nhóm checklist chuẩn (nhiều hạng mục) để dùng khi lập lịch bảo trì.
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<FileDownloadIcon />}
                            onClick={handleMenuOpen}
                        >
                            Excel
                        </Button>
                        <Menu 
                            anchorEl={anchorEl} 
                            open={Boolean(anchorEl)} 
                            onClose={handleMenuClose}
                        >
                            <MenuItem onClick={handleDownloadTemplate}>
                                <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
                                Tải mẫu Excel
                            </MenuItem>
                            <MenuItem onClick={handleImportClick}>
                                <UploadIcon fontSize="small" sx={{ mr: 1 }} />
                                Import Excel
                            </MenuItem>
                        </Menu>
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
                                <TableCell>Mô tả</TableCell>
                                <TableCell>Số hạng mục</TableCell>
                                <TableCell align="right">Thao tác</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {standards.map((std) => (
                                <TableRow key={std.id} hover>
                                    <TableCell>{std.name}</TableCell>
                                    <TableCell>{std.description}</TableCell>
                                    <TableCell>{std.items?.length || 0}</TableCell>
                                    <TableCell align="right">
                                        <IconButton size="small" onClick={() => handleEdit(std)}>
                                            <EditIcon fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small" onClick={async () => { await checklistStandardService.remove(std.id); load(); }}>
                                            <DeleteIcon fontSize="small" sx={{ color: 'error.main' }} />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
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
                        />
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
