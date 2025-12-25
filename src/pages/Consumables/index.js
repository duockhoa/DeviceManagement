import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../redux/slice/assetsSlice";
import {
    Box,
    Typography,
    Paper,
    Button,
    Autocomplete,
    TextField,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    MenuItem,
    Fab,
    Menu,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import WarningIcon from '@mui/icons-material/Warning';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Loading from '../../component/Loading';
import axios from '../../services/customize-axios';
import { downloadTemplateConsumable, importConsumablesExcel } from '../../services/assetsService';

function AssetConsumables() {
    const dispatch = useDispatch();
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.assets.loading);
    
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [consumables, setConsumables] = useState([]);
    const [consumableCategories, setConsumableCategories] = useState([]);
    const [loadingConsumables, setLoadingConsumables] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState({});
    const [openDialog, setOpenDialog] = useState(false);
    const [newConsumableData, setNewConsumableData] = useState({
        consumable_category_id: '',
        current_quantity: '',
        min_stock_level: '',
        replacement_cycle_hours: '',
        unit_price: '',
        supplier: '',
        specifications: '',
        remarks: ''
    });
    const [importFile, setImportFile] = useState(null);
    const [importing, setImporting] = useState(false);
    const [importResult, setImportResult] = useState(null);
    const [menuAnchor, setMenuAnchor] = useState(null);

    useEffect(() => {
        dispatch(fetchAssets());
        fetchConsumableCategories();
    }, [dispatch]);

    const fetchConsumableCategories = async () => {
        try {
            const response = await axios.get('/consumable-categories');
            setConsumableCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching consumable categories:', error);
        }
    };

    const fetchAssetConsumables = async (assetId) => {
        setLoadingConsumables(true);
        try {
            const response = await axios.get(`/assets/${assetId}/consumables`);
            setConsumables(response.data.data || []);
        } catch (error) {
            console.error('Error fetching consumables:', error);
            setConsumables([]);
        } finally {
            setLoadingConsumables(false);
        }
    };

    const handleAssetChange = (event, value) => {
        setSelectedAsset(value);
        if (value) {
            fetchAssetConsumables(value.id);
        } else {
            setConsumables([]);
        }
    };

    const handleEdit = (consumable) => {
        setEditingId(consumable.id);
        setEditValue({
            current_quantity: consumable.current_quantity || '',
            min_stock_level: consumable.min_stock_level || '',
            replacement_cycle_hours: consumable.replacement_cycle_hours || '',
            unit_price: consumable.unit_price || '',
            supplier: consumable.supplier || '',
            remarks: consumable.remarks || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue({});
    };

    const handleSaveEdit = async (consumableId) => {
        try {
            await axios.put(`/assets/${selectedAsset.id}/consumables/${consumableId}`, editValue);
            fetchAssetConsumables(selectedAsset.id);
            setEditingId(null);
            setEditValue({});
        } catch (error) {
            console.error('Error updating consumable:', error);
            alert('Lỗi khi cập nhật vật tư!');
        }
    };

    const handleDelete = async (consumableId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa vật tư này?')) {
            try {
                await axios.delete(`/assets/${selectedAsset.id}/consumables/${consumableId}`);
                fetchAssetConsumables(selectedAsset.id);
            } catch (error) {
                console.error('Error deleting consumable:', error);
                alert('Lỗi khi xóa vật tư!');
            }
        }
    };

    const handleAddNew = () => {
        setNewConsumableData({
            consumable_category_id: '',
            current_quantity: '',
            min_stock_level: '',
            replacement_cycle_hours: '',
            unit_price: '',
            supplier: '',
            specifications: '',
            remarks: ''
        });
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setNewConsumableData({
            consumable_category_id: '',
            current_quantity: '',
            min_stock_level: '',
            replacement_cycle_hours: '',
            unit_price: '',
            supplier: '',
            specifications: '',
            remarks: ''
        });
    };

    const handleSaveNew = async () => {
        if (!newConsumableData.consumable_category_id) {
            alert('Vui lòng chọn loại vật tư!');
            return;
        }
        
        try {
            await axios.post(`/assets/${selectedAsset.id}/consumables`, newConsumableData);
            fetchAssetConsumables(selectedAsset.id);
            handleCloseDialog();
        } catch (error) {
            console.error('Error creating consumable:', error);
            alert('Lỗi khi thêm vật tư!');
        }
    };

    const handleDownloadTemplate = async () => {
        try {
            const data = await downloadTemplateConsumable();
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Template_Vat_Tu.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
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
            setImportFile(file);
            setImportResult(null);
        }
        event.target.value = '';
    };

    const handleImportExcel = async () => {
        if (!importFile) return;
        setImporting(true);
        setImportResult(null);
        try {
            const response = await importConsumablesExcel(importFile);
            setImportResult(response.data || response);
            if (selectedAsset) {
                fetchAssetConsumables(selectedAsset.id);
            }
            alert('Import thành công!');
            setImportFile(null);
        } catch (error) {
            console.error('Error importing file:', error);
            alert('Lỗi khi import: ' + (error.response?.data?.message || error.message));
        } finally {
            setImporting(false);
        }
    };

    const handleOpenMenu = (event) => {
        setMenuAnchor(event.currentTarget);
    };

    const handleCloseMenu = () => {
        setMenuAnchor(null);
    };

    const columns = [
        {
            field: 'status',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params) => {
                const isLowStock = params.row.current_quantity < params.row.min_stock_level;
                if (isLowStock) {
                    return (
                        <Tooltip title="Dưới ngưỡng dự trù! Cần đặt mua">
                            <WarningIcon color="error" />
                        </Tooltip>
                    );
                }
                return null;
            }
        },
        {
            field: 'ConsumableCategory.name',
            headerName: 'Tên vật tư',
            width: 200,
            valueGetter: (params) => params.row.ConsumableCategory?.name || '',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.row.ConsumableCategory?.name}
                </Typography>
            )
        },
        {
            field: 'specifications',
            headerName: 'Thông số kỹ thuật',
            width: 180,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.row.ConsumableCategory?.specifications || params.row.specifications || '-'}
                </Typography>
            )
        },
        {
            field: 'ConsumableCategory.unit',
            headerName: 'Đơn vị',
            width: 80,
            valueGetter: (params) => params.row.ConsumableCategory?.unit || '',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.row.ConsumableCategory?.unit || '-'}
                </Typography>
            )
        },
        {
            field: 'current_quantity',
            headerName: 'SL hiện tại',
            width: 100,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            type="number"
                            value={editValue.current_quantity}
                            onChange={(e) => setEditValue({ ...editValue, current_quantity: e.target.value })}
                            fullWidth
                        />
                    );
                }
                const isLowStock = params.value < params.row.min_stock_level;
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', color: isLowStock ? 'error.main' : 'inherit', fontWeight: isLowStock ? 'bold' : 'normal' }}>
                        {params.value || '0'}
                    </Typography>
                );
            }
        },
        {
            field: 'min_stock_level',
            headerName: 'Ngưỡng tối thiểu',
            width: 120,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            type="number"
                            value={editValue.min_stock_level}
                            onChange={(e) => setEditValue({ ...editValue, min_stock_level: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'replacement_cycle_hours',
            headerName: 'Chu kỳ thay (giờ)',
            width: 130,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            type="number"
                            value={editValue.replacement_cycle_hours}
                            onChange={(e) => setEditValue({ ...editValue, replacement_cycle_hours: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'unit_price',
            headerName: 'Đơn giá (VND)',
            width: 120,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            type="number"
                            value={editValue.unit_price}
                            onChange={(e) => setEditValue({ ...editValue, unit_price: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value ? new Intl.NumberFormat('vi-VN').format(params.value) : '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'supplier',
            headerName: 'Nhà cung cấp',
            width: 150,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            value={editValue.supplier}
                            onChange={(e) => setEditValue({ ...editValue, supplier: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'remarks',
            headerName: 'Ghi chú',
            width: 180,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            value={editValue.remarks}
                            onChange={(e) => setEditValue({ ...editValue, remarks: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <Box>
                            <Tooltip title="Lưu">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleSaveEdit(params.row.id)}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy">
                                <IconButton
                                    size="small"
                                    color="default"
                                    onClick={handleCancelEdit}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                }
                return (
                    <Box>
                        <Tooltip title="Sửa">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(params.row)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(params.row.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            }
        }
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Vật tư tiêu hao thiết bị
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Chọn thiết bị để xem và quản lý vật tư tiêu hao
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<UploadFileIcon />}
                        endIcon={<ArrowDropDownIcon />}
                        onClick={handleOpenMenu}
                        disabled={importing}
                    >
                        Import Excel
                    </Button>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Autocomplete
                        options={assets}
                        getOptionLabel={(option) => `${option.asset_code} - ${option.name}`}
                        value={selectedAsset}
                        onChange={handleAssetChange}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Chọn thiết bị"
                                placeholder="Tìm kiếm theo mã hoặc tên thiết bị..."
                            />
                        )}
                        sx={{ width: 500 }}
                    />
                    
                    {selectedAsset && (
                        <>
                            <TextField
                                label="Mã TB"
                                value={selectedAsset.asset_code}
                                size="small"
                                InputProps={{
                                    readOnly: true,
                                }}
                                sx={{ 
                                    width: 150,
                                    '& .MuiInputBase-input': {
                                        fontWeight: 'bold',
                                        color: '#1976d2'
                                    }
                                }}
                            />
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => {
                                    navigator.clipboard.writeText(selectedAsset.asset_code);
                                    alert('Đã copy mã thiết bị!');
                                }}
                            >
                                Copy
                            </Button>
                        </>
                    )}
                </Box>
            </Paper>

            <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={handleCloseMenu}
            >
                <MenuItem onClick={() => { handleDownloadTemplate(); handleCloseMenu(); }}>
                    <DownloadIcon fontSize="small" sx={{ mr: 1 }} color="primary" />
                    Tải Template Excel
                </MenuItem>
                <MenuItem component="label">
                    <UploadFileIcon fontSize="small" sx={{ mr: 1 }} color="success" />
                    Chọn File Import
                    <input
                        type="file"
                        hidden
                        accept=".xlsx,.xls"
                        onChange={(e) => { handleFileSelect(e); handleCloseMenu(); }}
                    />
                </MenuItem>
            </Menu>

            {importFile && (
                <Paper sx={{ p: 2, mb: 2, bgcolor: 'info.lighter' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                File đã chọn: {importFile.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                Kích thước: {(importFile.size / 1024).toFixed(2)} KB
                            </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', gap: 1 }}>
                            <Button
                                variant="contained"
                                color="success"
                                onClick={handleImportExcel}
                                disabled={importing}
                                size="small"
                            >
                                {importing ? 'Đang xử lý...' : 'Xác nhận Import'}
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={() => setImportFile(null)}
                                disabled={importing}
                                size="small"
                            >
                                Hủy
                            </Button>
                        </Box>
                    </Box>
                </Paper>
            )}

            <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                {!selectedAsset ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                    }}>
                        <Typography variant="h6" color="text.secondary">
                            Vui lòng chọn thiết bị để xem vật tư tiêu hao
                        </Typography>
                    </Box>
                ) : (
                    <DataGrid
                        rows={consumables}
                        columns={columns}
                        loading={loadingConsumables}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
                        autoHeight={false}
                        sx={{
                            flex: 1,
                            border: 'none',
                            '& .MuiDataGrid-cell': {
                                fontSize: '1.2rem',
                                borderBottom: '1px solid #f0f0f0'
                            },
                            '& .MuiDataGrid-columnHeaders': {
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                backgroundColor: '#f8f9fa',
                                borderBottom: '2px solid #e0e0e0'
                            },
                            '& .MuiDataGrid-row': {
                                minHeight: '60px !important'
                            }
                        }}
                    />
                )}
            </Paper>

            {selectedAsset && (
                <Fab 
                    color="primary" 
                    aria-label="add" 
                    onClick={handleAddNew}
                    sx={{
                        position: 'fixed',
                        bottom: 40,
                        right: 40,
                        zIndex: 1000
                    }}
                >
                    <AddIcon sx={{ fontSize: 30 }} />
                </Fab>
            )}

            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '1.6rem' }}>
                    Thêm vật tư tiêu hao
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
                        <TextField
                            select
                            label="Loại vật tư"
                            value={newConsumableData.consumable_category_id}
                            onChange={(e) => setNewConsumableData({ ...newConsumableData, consumable_category_id: e.target.value })}
                            required
                            fullWidth
                        >
                            {consumableCategories.map((cat) => (
                                <MenuItem key={cat.id} value={cat.id}>
                                    {cat.code} - {cat.name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Số lượng hiện tại"
                                type="number"
                                value={newConsumableData.current_quantity}
                                onChange={(e) => setNewConsumableData({ ...newConsumableData, current_quantity: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Ngưỡng tối thiểu"
                                type="number"
                                value={newConsumableData.min_stock_level}
                                onChange={(e) => setNewConsumableData({ ...newConsumableData, min_stock_level: e.target.value })}
                                fullWidth
                                helperText="Cảnh báo khi dưới ngưỡng này"
                            />
                        </Box>

                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <TextField
                                label="Chu kỳ thay (giờ)"
                                type="number"
                                value={newConsumableData.replacement_cycle_hours}
                                onChange={(e) => setNewConsumableData({ ...newConsumableData, replacement_cycle_hours: e.target.value })}
                                fullWidth
                            />
                            <TextField
                                label="Đơn giá (VND)"
                                type="number"
                                value={newConsumableData.unit_price}
                                onChange={(e) => setNewConsumableData({ ...newConsumableData, unit_price: e.target.value })}
                                fullWidth
                            />
                        </Box>

                        <TextField
                            label="Nhà cung cấp"
                            value={newConsumableData.supplier}
                            onChange={(e) => setNewConsumableData({ ...newConsumableData, supplier: e.target.value })}
                            fullWidth
                        />

                        <TextField
                            label="Thông số kỹ thuật"
                            value={newConsumableData.specifications}
                            onChange={(e) => setNewConsumableData({ ...newConsumableData, specifications: e.target.value })}
                            multiline
                            rows={2}
                            fullWidth
                        />

                        <TextField
                            label="Ghi chú"
                            value={newConsumableData.remarks}
                            onChange={(e) => setNewConsumableData({ ...newConsumableData, remarks: e.target.value })}
                            multiline
                            rows={2}
                            fullWidth
                        />
                    </Box>
                </DialogContent>
                <DialogActions sx={{ p: 2, backgroundColor: '#fafafa' }}>
                    <Button
                        variant="outlined"
                        onClick={handleCloseDialog}
                        startIcon={<CloseIcon />}
                        color="error"
                    >
                        Hủy
                    </Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveNew}
                        startIcon={<SaveIcon />}
                    >
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AssetConsumables;
