import { useState, useRef } from 'react';
import { 
    Box, 
    Button, 
    Menu, 
    MenuItem, 
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    List,
    ListItem,
    ListItemText,
    Alert,
    CircularProgress,
    LinearProgress
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import axios from '../../../services/customize-axios';

function ExcelImportExport({ onImportSuccess }) {
    const [anchorEl, setAnchorEl] = useState(null);
    const [importDialogOpen, setImportDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const fileInputRef = useRef(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleDownloadTemplate = async () => {
        try {
            const response = await axios.get('/assets/export/template', {
                responseType: 'blob'
            });
            
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Template_Thiet_Bi.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
            
            handleMenuClose();
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Lỗi khi tải template: ' + error.message);
        }
    };

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
                return;
            }
            setSelectedFile(file);
            setImportDialogOpen(true);
        }
    };

    const handleImport = async () => {
        if (!selectedFile) return;

        setImporting(true);
        setImportResult(null);

        try {
            const formData = new FormData();
            formData.append('file', selectedFile);

            const response = await axios.post('/assets/import/excel', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setImportResult(response.data.data);
            
            if (response.data.data.errors.length === 0) {
                setTimeout(() => {
                    setImportDialogOpen(false);
                    setSelectedFile(null);
                    setImportResult(null);
                    if (onImportSuccess) {
                        onImportSuccess();
                    }
                }, 2000);
            }
        } catch (error) {
            console.error('Error importing file:', error);
            alert('Lỗi khi import: ' + (error.response?.data?.message || error.message));
        } finally {
            setImporting(false);
        }
    };

    const handleCloseImportDialog = () => {
        setImportDialogOpen(false);
        setSelectedFile(null);
        setImportResult(null);
    };

    return (
        <Box>
            <Button
                variant="contained"
                color="success"
                startIcon={<FileDownloadIcon />}
                onClick={handleMenuOpen}
                sx={{ mr: 1 }}
            >
                Excel
            </Button>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleDownloadTemplate}>
                    <DownloadIcon sx={{ mr: 1 }} />
                    Tải file mẫu
                </MenuItem>
                <MenuItem onClick={() => {
                    handleMenuClose();
                    fileInputRef.current?.click();
                }}>
                    <UploadFileIcon sx={{ mr: 1 }} />
                    Import dữ liệu
                </MenuItem>
            </Menu>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
            />

            {/* Import Dialog */}
            <Dialog 
                open={importDialogOpen} 
                onClose={handleCloseImportDialog}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>Import thiết bị từ Excel</DialogTitle>
                <DialogContent>
                    {importing && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Đang import dữ liệu...
                            </Typography>
                            <LinearProgress />
                        </Box>
                    )}

                    {selectedFile && !importResult && (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            <Typography variant="body2">
                                <strong>File đã chọn:</strong> {selectedFile.name}
                            </Typography>
                            <Typography variant="body2">
                                <strong>Kích thước:</strong> {(selectedFile.size / 1024).toFixed(2)} KB
                            </Typography>
                        </Alert>
                    )}

                    {importResult && (
                        <Box>
                            <Alert 
                                severity={importResult.errors.length === 0 ? 'success' : 'warning'}
                                sx={{ mb: 2 }}
                            >
                                <Typography variant="body2">
                                    <strong>Kết quả import:</strong><br />
                                    ✓ Thành công: {importResult.success.length} thiết bị<br />
                                    ✗ Lỗi: {importResult.errors.length} dòng
                                </Typography>
                            </Alert>

                            {importResult.success.length > 0 && (
                                <Box sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                                        Thiết bị đã import thành công:
                                    </Typography>
                                    <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        {importResult.success.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={`${item.asset_code} - ${item.name}`}
                                                    secondary={`Dòng ${item.row}`}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}

                            {importResult.errors.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold', color: 'error.main' }}>
                                        Các lỗi cần xử lý:
                                    </Typography>
                                    <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                        {importResult.errors.map((item, index) => (
                                            <ListItem key={index}>
                                                <ListItemText
                                                    primary={`Dòng ${item.row}`}
                                                    secondary={item.error}
                                                />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseImportDialog}>
                        {importResult ? 'Đóng' : 'Hủy'}
                    </Button>
                    {!importResult && (
                        <Button 
                            onClick={handleImport} 
                            variant="contained"
                            disabled={importing || !selectedFile}
                            startIcon={importing ? <CircularProgress size={16} /> : <UploadFileIcon />}
                        >
                            {importing ? 'Đang import...' : 'Import'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ExcelImportExport;
