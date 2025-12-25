import { useState, useRef } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    List,
    ListItem,
    ListItemText,
    Alert,
    LinearProgress,
    Stack,
    Menu,
    MenuItem,
    ListItemIcon
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import {
    downloadTemplateAsset,
    importAssetsExcel
} from '../../../services/assetsService';

const downloadFile = (blobData, filename) => {
    const url = window.URL.createObjectURL(new Blob([blobData]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
};

function ExcelImportExport({ onImportSuccess }) {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);
    const fileInputRef = useRef(null);

    const handleDownload = async () => {
        try {
            const data = await downloadTemplateAsset();
            downloadFile(data, 'Template_Thiet_Bi.xlsx');
        } catch (error) {
            console.error('Error downloading template:', error);
            alert('Lỗi khi tải template!');
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
            setDialogOpen(true);
            setImportResult(null);
        }
        event.target.value = '';
    };

    const handleImport = async () => {
        if (!selectedFile) return;
        setImporting(true);
        setImportResult(null);
        try {
            const response = await importAssetsExcel(selectedFile);
            setImportResult(response.data || response);

            const assetSuccess = response.data?.success || response.data?.data?.success || response?.data?.success;
            if (Array.isArray(assetSuccess) && assetSuccess.length > 0 && onImportSuccess) {
                onImportSuccess();
            }
        } catch (error) {
            console.error('Error importing file:', error);
            alert('Lỗi khi import: ' + (error.response?.data?.message || error.message));
        } finally {
            setImporting(false);
        }
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setSelectedFile(null);
        setImportResult(null);
    };

    const handleOpenMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const handleMenuItemClick = (action) => {
        if (action === 'download') {
            handleDownload();
        } else if (action === 'import') {
            fileInputRef.current?.click();
        }
        handleCloseMenu();
    };

    const renderResult = () => {
        if (!importResult) return null;

        const resultData = importResult.data || importResult;
        const successCount = resultData.success?.length || resultData.created || 0;
        const skippedCount = resultData.skipped?.length || 0;
        const errorCount = resultData.errors?.length || 0;

        return (
            <Box>
                <Alert severity={errorCount === 0 ? 'success' : 'warning'} sx={{ mb: 2 }}>
                    <Typography variant="body2">
                        ✓ Thành công: {successCount}
                        {skippedCount ? ` | Bỏ qua: ${skippedCount}` : ''}
                        {resultData.updated ? ` | Cập nhật: ${resultData.updated}` : ''}
                        {errorCount ? ` | Lỗi: ${errorCount}` : ''}
                    </Typography>
                </Alert>

                {resultData.success?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'success.main', mb: 1 }}>
                            Dòng thành công
                        </Typography>
                        <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'success.lighter' }}>
                            {resultData.success.map((item, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText 
                                        primary={`${item.asset_code} - ${item.name || ''}`} 
                                        secondary={`Dòng ${item.row}`} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {resultData.skipped?.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                            Dòng bỏ qua (đã tồn tại)
                        </Typography>
                        <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'warning.lighter' }}>
                            {resultData.skipped.map((item, idx) => (
                                <ListItem key={idx}>
                                    <ListItemText 
                                        primary={`${item.asset_code || item.dk_code} - ${item.name || ''}`} 
                                        secondary={item.reason || `Dòng ${item.row}`} 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {resultData.errors?.length > 0 && (
                    <Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'error.main', mb: 1 }}>
                            Dòng lỗi
                        </Typography>
                        <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'error.lighter' }}>
                            {resultData.errors.map((item, idx) => (
                                <ListItem key={idx}>
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
        );
    };

    return (
        <Box>
            <Button
                variant="contained"
                startIcon={<UploadFileIcon />}
                endIcon={<ArrowDropDownIcon />}
                onClick={handleOpenMenu}
                sx={{ textTransform: 'none' }}
            >
                Import Thiết Bị
            </Button>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
                PaperProps={{
                    sx: { minWidth: 250 }
                }}
            >
                <MenuItem onClick={() => handleMenuItemClick('download')}>
                    <ListItemIcon>
                        <DownloadIcon fontSize="small" color="primary" />
                    </ListItemIcon>
                    <Typography variant="body2">Tải Template</Typography>
                </MenuItem>
                <MenuItem onClick={() => handleMenuItemClick('import')}>
                    <ListItemIcon>
                        <UploadFileIcon fontSize="small" color="success" />
                    </ListItemIcon>
                    <Typography variant="body2">Import File Excel</Typography>
                </MenuItem>
            </Menu>

            <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx,.xls"
                onChange={handleFileSelect}
            />

            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
                    Import Thiết Bị từ Excel
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <Alert severity="info">
                            <Typography variant="body2">
                                • asset_code tự động sinh
                                <br />
                                • dk_code có thể trùng (phân biệt theo plant)
                                <br />
                                • Các dòng trùng sẽ bị bỏ qua
                            </Typography>
                        </Alert>

                        {selectedFile && (
                            <Box>
                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                    File đã chọn: {selectedFile.name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                    Kích thước: {(selectedFile.size / 1024).toFixed(2)} KB
                                </Typography>
                            </Box>
                        )}

                        {importing && (
                            <Box>
                                <LinearProgress />
                                <Typography variant="body2" sx={{ mt: 1, textAlign: 'center' }}>
                                    Đang xử lý...
                                </Typography>
                            </Box>
                        )}

                        {renderResult()}
                    </Stack>
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#fafafa' }}>
                    <Button onClick={handleCloseDialog} disabled={importing}>
                        Đóng
                    </Button>
                    {!importResult && (
                        <Button
                            variant="contained"
                            onClick={handleImport}
                            disabled={!selectedFile || importing}
                        >
                            {importing ? 'Đang import...' : 'Xác nhận Import'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default ExcelImportExport;
