import { useRef, useState } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
    List,
    ListItem,
    ListItemText,
    Stack,
    LinearProgress,
    Menu,
    MenuItem
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from '../../../services/customize-axios';

// Import/Export Excel cho Kế hoạch bảo trì
export default function MaintenancePlanImport({ onApproved }) {
    const fileInputRef = useRef(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [rows, setRows] = useState([]);
    const [approveResult, setApproveResult] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get('/maintenance-plan/template', { responseType: 'blob' });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'KeHoachBaoTri.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            handleMenuClose();
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Không tải được file mẫu: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleFileSelect = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
            alert('Vui lòng chọn file Excel (.xlsx/.xls)');
            return;
        }
        setSelectedFile(file);
        setRows([]);
        setApproveResult(null);
        setOpen(true);
        handleMenuClose();
        e.target.value = '';
    };

    const handleImport = async () => {
        if (!selectedFile) return;
        setLoading(true);
        setApproveResult(null);
        try {
            const formData = new FormData();
            formData.append('file', selectedFile);
            const res = await axios.post('/maintenance-plan/import', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            setRows(res.data.data || []);
        } catch (error) {
            console.error('Error importing plan:', error);
            alert('Không đọc được file: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async () => {
        const validItems = rows.filter((r) => !r.errors || r.errors.length === 0).map((r) => r.mapped);
        if (validItems.length === 0) {
            alert('Không có dòng hợp lệ để lưu kế hoạch');
            return;
        }
        setLoading(true);
        try {
            const res = await axios.post('/maintenance-plan/save', { items: validItems });
            setApproveResult(res.data);
            if (onApproved) onApproved();
            // Tự động đóng sau khi lưu thành công
            setTimeout(() => {
                setOpen(false);
                setSelectedFile(null);
                setRows([]);
                setApproveResult(null);
            }, 1200);
        } catch (error) {
            console.error('Error saving plan:', error);
            alert('Không lưu được kế hoạch: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    const validCount = rows.filter((r) => !r.errors || r.errors.length === 0).length;
    const errorCount = rows.filter((r) => r.errors && r.errors.length > 0).length;

    return (
        <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <Button
                variant="contained"
                color="success"
                startIcon={<FileDownloadIcon />}
                onClick={handleMenuOpen}
                sx={{ minWidth: 150 }}
            >
                Excel
            </Button>

            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={handleDownloadTemplate}>
                    <DownloadIcon fontSize="small" sx={{ mr: 1 }} />
                    Tải file mẫu
                </MenuItem>
                <MenuItem onClick={() => fileInputRef.current?.click()}>
                    <UploadFileIcon fontSize="small" sx={{ mr: 1 }} />
                    Import kế hoạch
                </MenuItem>
            </Menu>
            <input
                ref={fileInputRef}
                type="file"
                accept=".xlsx,.xls"
                style={{ display: 'none' }}
                onChange={handleFileSelect}
            />

            <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Import kế hoạch bảo trì</DialogTitle>
                <DialogContent dividers>
                    {loading && (
                        <Box sx={{ mb: 2 }}>
                            <LinearProgress />
                        </Box>
                    )}
                    {selectedFile && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            File: {selectedFile.name}
                        </Alert>
                    )}

                    {rows.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Stack direction="row" spacing={2}>
                                <Alert icon={<CheckCircleIcon fontSize="inherit" />} severity="success">
                                    Hợp lệ: {validCount} dòng
                                </Alert>
                                <Alert icon={<ErrorOutlineIcon fontSize="inherit" />} severity="warning">
                                    Lỗi: {errorCount} dòng
                                </Alert>
                            </Stack>
                        </Box>
                    )}

                    {rows.length > 0 && (
                        <Box sx={{ display: 'grid', gap: 1 }}>
                            {rows.map((row) => (
                                <Alert
                                    key={row.rowNumber}
                                    severity={row.errors && row.errors.length > 0 ? 'warning' : 'success'}
                                    icon={row.errors && row.errors.length > 0 ? <ErrorOutlineIcon /> : <TaskAltIcon />}
                                    sx={{ alignItems: 'flex-start' }}
                                >
                                    <Typography variant="subtitle2">
                                        Dòng {row.rowNumber}: {row.mapped?.title || '(chưa có tiêu đề)'}
                                    </Typography>
                                    <Typography variant="body2">
                                        Thiết bị: {row.raw?.ma_thiet_bi || row.raw?.mathietbi || 'N/A'} | Loại: {row.mapped?.maintenance_type} | Ngày: {row.raw?.ngay_du_kien || row.raw?.ngaydukien}
                                    </Typography>
                                    {row.errors && row.errors.length > 0 && (
                                        <List dense sx={{ pl: 2, mb: 0 }}>
                                            {row.errors.map((err, idx) => (
                                                <ListItem key={idx} sx={{ py: 0 }}>
                                                    <ListItemText primary={`- ${err}`} />
                                                </ListItem>
                                            ))}
                                        </List>
                                    )}
                                </Alert>
                            ))}
                        </Box>
                    )}

                    {approveResult && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            Đã lưu {approveResult.data?.length || 0} kế hoạch.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>Đóng</Button>
                    {!rows.length && (
                        <Button variant="contained" onClick={handleImport} disabled={loading || !selectedFile}>
                            Đọc file
                        </Button>
                    )}
                    {rows.length > 0 && (
                        <Button variant="contained" onClick={handleApprove} disabled={loading || validCount === 0}>
                            Lưu kế hoạch
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Stack>
    );
}
