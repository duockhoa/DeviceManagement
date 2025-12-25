import { useState, useRef, useMemo } from 'react';
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
    Card,
    CardContent
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DescriptionIcon from '@mui/icons-material/Description';
import TuneIcon from '@mui/icons-material/Tune';
import InventoryIcon from '@mui/icons-material/Inventory';
import usePermissions from '../../../hooks/usePermissions';
import {
    downloadTemplateAsset,
    downloadTemplateSpec,
    downloadTemplateConsumable,
    importAssetsExcel,
    importSpecsExcel,
    importConsumablesExcel
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
    const { hasAnyPermission } = usePermissions();
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [activeType, setActiveType] = useState('asset');
    const fileInputRef = useRef(null);

        const canSeeSpecConsumable = useMemo(
            () => hasAnyPermission(['rbac.manage', 'assets.update', 'assets.manage', 'assets.import.spec']),
            [hasAnyPermission]
        );

        const importConfigs = useMemo(() => ({
            asset: {
                key: 'asset',
                title: 'Import Thiết Bị',
                icon: <DescriptionIcon />,
                templateLabel: 'Tải Template Thiết Bị',
                templateNote: 'asset_code tự sinh, dk_code có thể trùng',
                filename: 'Template_Thiet_Bi.xlsx',
                download: downloadTemplateAsset,
                importFn: importAssetsExcel
            },
            spec: {
                key: 'spec',
                title: 'Import Thông Số',
                icon: <TuneIcon />,
                templateLabel: 'Tải Template Thông Số',
                templateNote: 'Bắt buộc có asset_code',
                filename: 'Template_Thong_So.xlsx',
                download: downloadTemplateSpec,
                importFn: importSpecsExcel,
                requirePermission: true
            },
            consumable: {
                key: 'consumable',
                title: 'Import Vật Tư',
                icon: <InventoryIcon />,
                templateLabel: 'Tải Template Vật Tư',
                templateNote: 'Bắt buộc có asset_code',
                filename: 'Template_Vat_Tu.xlsx',
                download: downloadTemplateConsumable,
                importFn: importConsumablesExcel,
                requirePermission: true
            }
        }), []);

        const handleDownload = async (type) => {
            try {
                const cfg = importConfigs[type];
                const data = await cfg.download();
                downloadFile(data, cfg.filename);
            } catch (error) {
                console.error('Error downloading template:', error);
                alert('Lỗi khi tải template: ' + (error.response?.data?.message || error.message));
            }
        };

        const handleFileSelect = (event, type) => {
            const file = event.target.files[0];
            if (file) {
                if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
                    alert('Vui lòng chọn file Excel (.xlsx hoặc .xls)');
                    return;
                }
                setSelectedFile(file);
                setImportResult(null);
                setActiveType(type);
                setDialogOpen(true);
            }
            event.target.value = '';
        };

        const handleImport = async () => {
            if (!selectedFile || !activeType) return;
            setImporting(true);
            setImportResult(null);
            try {
                const cfg = importConfigs[activeType];
                const response = await cfg.importFn(selectedFile);
                setImportResult(response.data || response); // backend returns {success:true,data:{}}

                const assetSuccess = response.data?.success || response.data?.data?.success || response?.data?.success;
                if (activeType === 'asset' && Array.isArray(assetSuccess) && assetSuccess.length > 0 && onImportSuccess) {
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

        const renderResult = () => {
            if (!importResult) return null;

            // asset import shape: { success:[], skipped:[], errors:[] }
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
                                        <ListItemText primary={`${item.asset_code} - ${item.name || ''}`} secondary={`Dòng ${item.row}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {resultData.skipped?.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'warning.main', mb: 1 }}>
                                Dòng bỏ qua
                            </Typography>
                            <List dense sx={{ maxHeight: 200, overflow: 'auto', bgcolor: 'warning.lighter' }}>
                                {resultData.skipped.map((item, idx) => (
                                    <ListItem key={idx}>
                                        <ListItemText primary={`${item.asset_code} - ${item.name || ''}`} secondary={`Dòng ${item.row} - ${item.reason || ''}`} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}

                    {resultData.errors?.length > 0 && (
                        <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'error.main', mb: 1 }}>
                                Lỗi cần xử lý
                            </Typography>
                            <List dense sx={{ maxHeight: 240, overflow: 'auto', bgcolor: 'error.lighter' }}>
                                {resultData.errors.map((item, idx) => (
                                    <ListItem key={idx}>
                                        <ListItemText primary={`Dòng ${item.row || '—'}`} secondary={item.error || item.message} />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            );
        };

        const cards = [importConfigs.asset];
        if (canSeeSpecConsumable) {
            cards.push(importConfigs.spec, importConfigs.consumable);
        }

        const steps = [
            { label: 'Import/Tạo thiết bị', note: 'asset_code tự sinh, dk_code có thể trùng' },
            { label: 'Thêm thông số kỹ thuật', note: 'theo asset_code đã tạo' },
            { label: 'Thêm vật tư tiêu hao', note: 'theo asset_code đã tạo' }
        ];

        return (
            <Box sx={{
                p: 2,
                borderRadius: 2,
                border: '1px solid #e2e8f0',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e0f2fe 100%)',
                boxShadow: '0 18px 40px rgba(15,23,42,0.12)'
            }}>
                <Stack spacing={2}>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        justifyContent: 'space-between',
                        gap: 2,
                        alignItems: { xs: 'flex-start', md: 'center' }
                    }}>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 800, color: '#0f172a' }}>
                                Import dữ liệu thiết bị nhanh
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Chọn đúng bước, dùng template tương ứng và để hệ thống tự sinh asset_code.
                            </Typography>
                        </Box>
                        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
                            {steps.map((step, idx) => (
                                <Box
                                    key={step.label}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 1,
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 2,
                                        bgcolor: 'white',
                                        border: '1px dashed #cbd5e1',
                                        boxShadow: '0 6px 16px rgba(15,23,42,0.08)'
                                    }}
                                >
                                    <Box sx={{
                                        width: 28,
                                        height: 28,
                                        borderRadius: '50%',
                                        bgcolor: '#0ea5e9',
                                        color: 'white',
                                        fontWeight: 700,
                                        display: 'grid',
                                        placeItems: 'center'
                                    }}>
                                        {idx + 1}
                                    </Box>
                                    <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{step.label}</Typography>
                                        <Typography variant="caption" color="text.secondary">{step.note}</Typography>
                                    </Box>
                                </Box>
                            ))}
                        </Stack>
                    </Box>

                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="stretch">
                        {cards.map((cfg) => (
                            <Card
                                key={cfg.key}
                                variant="outlined"
                                sx={{
                                    minWidth: 260,
                                    flex: 1,
                                    position: 'relative',
                                    overflow: 'hidden',
                                    borderRadius: 2,
                                    border: '1px solid #d0e1f3',
                                    boxShadow: '0 20px 48px rgba(15,23,42,0.14)',
                                    background: 'linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)'
                                }}
                            >
                                <CardContent>
                                    <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1.5 }}>
                                        <Box sx={{
                                            width: 40,
                                            height: 40,
                                            borderRadius: 2,
                                            bgcolor: '#0f766e',
                                            display: 'grid',
                                            placeItems: 'center',
                                            color: 'white'
                                        }}>
                                            {cfg.icon}
                                        </Box>
                                        <Typography variant="h6" sx={{ fontWeight: 800, fontSize: '1.35rem' }}>{cfg.title}</Typography>
                                    </Stack>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                        {cfg.templateNote}
                                    </Typography>
                                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mb: 1.5 }}>
                                        <Button
                                            fullWidth
                                            size="medium"
                                            variant="outlined"
                                            startIcon={<DownloadIcon />}
                                            onClick={() => handleDownload(cfg.key)}
                                        >
                                            {cfg.templateLabel}
                                        </Button>
                                        <Button
                                            fullWidth
                                            size="medium"
                                            variant="contained"
                                            color="success"
                                            startIcon={<UploadFileIcon />}
                                            onClick={() => {
                                                setActiveType(cfg.key);
                                                fileInputRef.current?.click();
                                            }}
                                        >
                                            Import
                                        </Button>
                                    </Stack>
                                    <Typography variant="caption" color="text.secondary">
                                        File tên: {cfg.filename}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))}
                    </Stack>

                    <Alert severity="info" icon={false} sx={{ borderRadius: 2, border: '1px solid #bfdbfe', backgroundColor: '#e0f2fe' }}>
                        Quy trình chuẩn: Import/Tạo thiết bị (asset_code tự sinh) → Thêm thông số kỹ thuật theo asset_code → Thêm vật tư tiêu hao theo asset_code.
                    </Alert>
                </Stack>

                <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    accept=".xlsx,.xls"
                    onClick={(e) => setActiveType(activeType)}
                    onChange={(e) => handleFileSelect(e, activeType)}
                />

                <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                    <DialogTitle>Import {importConfigs[activeType]?.title}</DialogTitle>
                    <DialogContent>
                        {importing && (
                            <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" sx={{ mb: 1 }}>Đang import dữ liệu...</Typography>
                                <LinearProgress />
                            </Box>
                        )}

                        {selectedFile && !importResult && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                                <Typography variant="body2"><strong>File đã chọn:</strong> {selectedFile.name}</Typography>
                                <Typography variant="body2"><strong>Kích thước:</strong> {(selectedFile.size / 1024).toFixed(2)} KB</Typography>
                            </Alert>
                        )}

                        {renderResult()}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog} disabled={importing}>Hủy</Button>
                        <Button
                            onClick={handleImport}
                            variant="contained"
                            color="success"
                            startIcon={<UploadFileIcon />}
                            disabled={!selectedFile || importing}
                        >
                            {importing ? 'Đang import...' : 'Import'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        );
}

export default ExcelImportExport;
