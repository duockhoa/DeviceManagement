import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAssets, fetchAssetById } from "../../../redux/slice/assetsSlice";
import usePermissions from "../../../hooks/usePermissions";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DevicesIcon from '@mui/icons-material/Devices';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../Loading';
import EditAssetForm from '../EditAssetForm';
import ExcelImportExport from '../ExcelImportExport';
import { deleteAsset } from '../../../services/assetsService';

function AssetList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.assets.loading);
    const error = useSelector((state) => state.assets.error);
    const user = useSelector((state) => state.user.userInfo);
    const { hasPermission } = usePermissions();
    
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [assetToDelete, setAssetToDelete] = useState(null);

    useEffect(() => {
        dispatch(fetchAssets());
    }, [dispatch]);

    const handleViewDetail = (id) => {
        navigate(`/devices/${id}`);
    };

    const handleEdit = async (asset) => {
        try {
            console.log('Edit clicked, asset:', asset);
            // Fetch đầy đủ thông tin asset từ backend
            const fullAssetData = await dispatch(fetchAssetById(asset.id)).unwrap();
            console.log('Full asset data loaded:', fullAssetData);
            console.log('Has GeneralInfo?', fullAssetData?.GeneralInfo);
            console.log('Has Components?', fullAssetData?.Components);
            console.log('Has Specifications?', fullAssetData?.Specifications);
            console.log('Has Consumables?', fullAssetData?.Consumables);
            setSelectedAsset(fullAssetData);
            setEditDialogOpen(true);
        } catch (error) {
            console.error('Error loading asset data:', error);
            alert('Lỗi khi tải thông tin thiết bị: ' + error.message);
        }
    };

    const handleCloseEdit = () => {
        console.log('Closing edit dialog');
        setEditDialogOpen(false);
        setSelectedAsset(null);
    };

    const handleImportSuccess = () => {
        // Reload assets after successful import
        dispatch(fetchAssets());
    };

    const handleDeleteClick = (asset) => {
        setAssetToDelete(asset);
        setDeleteDialogOpen(true);
    };

    const handleDeleteConfirm = async () => {
        if (!assetToDelete) return;

        try {
            await deleteAsset(assetToDelete.id);
            setDeleteDialogOpen(false);
            setAssetToDelete(null);
            // Reload danh sách
            dispatch(fetchAssets());
        } catch (error) {
            console.error('Error deleting asset:', error);
            alert('Lỗi khi xóa thiết bị: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleDeleteCancel = () => {
        setDeleteDialogOpen(false);
        setAssetToDelete(null);
    };

    const columns = [
        {
            field: 'asset_code',
            headerName: 'Mã thiết bị',
            width: 130,
            flex: 0.8,
            fontWeight: 'bold'
        },
        {
            field: 'dk_code',
            headerName: 'Mã DK',
            width: 130,
            flex: 0.8,
            valueGetter: (params) => params.row.dk_code || '—'
        },
        {
            field: 'name',
            headerName: 'Tên thiết bị',
            width: 220,
            flex: 1.5,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.3rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'subCategory',
            headerName: 'Nhóm thiết bị',
            width: 160,
            flex: 1,
            renderCell: (params) => (
                <Chip
                    label={params.row.SubCategory?.Category?.name || 'Chưa phân loại'}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '1.3rem' }}
                />
            )
        },
        {
            field: 'department',
            headerName: 'Phòng ban',
            width: 140,
            flex: 0.9,
            renderCell: (params) => (
                <Chip
                    label={params.row.Department?.name || 'Chưa có'}
                    color="secondary"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '1.3rem' }}
                />
            )
        },
        {
            field: 'area',
            headerName: 'Vị trí',
            width: 160,
            flex: 1,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" sx={{ fontSize: '1.2rem', fontWeight: 'medium' }}>
                        {params.row.Area?.name || 'Chưa có'}
                    </Typography>
                    {params.row.Area?.Plant?.name && (
                        <Typography variant="caption" sx={{ fontSize: '1.1rem', color: '#666' }}>
                            {params.row.Area.Plant.name}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 140,
            flex: 0.9,
            renderCell: (params) => {
                const status = params.value;
                const getStatusProps = (status) => {
                    switch (status) {
                        case 'active':
                            return {
                                label: 'Hoạt động',
                                color: 'success',
                                variant: 'filled'
                            };
                        case 'inactive':
                            return {
                                label: 'Ngừng hoạt động',
                                color: 'error',
                                variant: 'filled'
                            };
                        default:
                            return {
                                label: 'Không xác định',
                                color: 'default',
                                variant: 'outlined'
                            };
                    }
                };

                const statusProps = getStatusProps(status);
                return (
                    <Chip
                        label={statusProps.label}
                        color={statusProps.color}
                        size="small"
                        variant={statusProps.variant}
                        sx={{ 
                            fontSize: '1.2rem',
                            fontWeight: 'medium',
                            minWidth: '110px'
                        }}
                    />
                );
            }
        },
        {
            field: 'creator',
            headerName: 'Người tạo',
            width: 150,
            flex: 0.9,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.3rem' }}>
                    {params.row.Creator?.name || 'Không xác định'}
                </Typography>
            )
        },
        {
            field: 'created_at',
            headerName: 'Ngày tạo',
            width: 130,
            flex: 0.8,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.3rem' }}>
                    {new Date(params.value).toLocaleDateString('vi-VN')}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 360,
            flex: 2,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        onClick={() => handleViewDetail(params.row.id)}
                        sx={{ fontSize: '1.2rem', px: 1.5, py: 0.5 }}
                    >
                        Xem
                    </Button>
                    {hasPermission('assets.update') && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(params.row)}
                            sx={{ fontSize: '1.2rem', px: 1.5, py: 0.5 }}
                        >
                            Sửa
                        </Button>
                    )}
                    {hasPermission('assets.delete') && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDeleteClick(params.row)}
                            sx={{ fontSize: '1.2rem', px: 1.5, py: 0.5 }}
                        >
                            Xóa
                        </Button>
                    )}
                </Box>
            )
        }
    ];

    if (loading) {
        return <Loading />;
    }
    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <Box sx={{ height: "100%", width: '100%', display: 'flex', flexDirection: 'column', p: 2 }}>
            {/* Header with Excel buttons */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <ExcelImportExport onImportSuccess={handleImportSuccess} />
            </Box>

            {/* DataGrid */}
            <Box sx={{ flexGrow: 1 }}>
                <DataGrid
                    rows={assets}
                    columns={columns}
                    loading={loading}
                    error={error}
                    disableRowSelectionOnClick
                    hideFooterSelectedRowCount
                    isRowSelectable={() => false}
                    rowSelectionModel={[]}
                    pagination
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25, page: 0 },
                        },
                    }}
                    getRowHeight={() => 'auto'}
                    sx={{
                        backgroundColor: '#fff',
                        '& .MuiDataGrid-virtualScroller': {
                            backgroundColor: '#fff !important'
                        },
                        '& .MuiDataGrid-virtualScrollerRenderZone': {
                            backgroundColor: '#fff !important'
                        },
                        '& .MuiDataGrid-cell': {
                            fontSize: '1.3rem',
                            display: 'flex',
                            alignItems: 'center',
                            py: 1
                        },
                        '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-within': {
                            outline: 'none'
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            fontSize: '1.4rem',
                            fontWeight: 'bold',
                            backgroundColor: '#f5f5f5'
                        },
                        '& .MuiDataGrid-row': {
                            minHeight: '70px !important',
                            backgroundColor: '#fff',
                            borderBottom: '1px solid #f0f0f0'
                        },
                        '& .MuiDataGrid-row.Mui-selected, & .MuiDataGrid-row.Mui-selected:hover': {
                            backgroundColor: 'transparent !important'
                        },
                        '& .MuiDataGrid-row:hover': {
                            backgroundColor: 'transparent'
                        },
                        '& .MuiDataGrid-row--borderBottom': {
                            borderBottom: '1px solid #f0f0f0 !important',
                            backgroundColor: '#fff'
                        },
                        '& .MuiDataGrid-columnSeparator': {
                            visibility: 'hidden'
                        },
                        '& .MuiDataGrid-footerContainer': {
                            fontSize: '1.3rem'
                        }
                    }}
                />
            </Box>

            {/* Dialog chỉnh sửa thiết bị */}
            <Dialog
                open={editDialogOpen}
                onClose={handleCloseEdit}
                maxWidth="xl"
                fullWidth
            >
                {selectedAsset && (
                    <EditAssetForm 
                        handleClose={handleCloseEdit} 
                        assetData={selectedAsset}
                    />
                )}
            </Dialog>

            {/* Dialog xác nhận xóa */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleDeleteCancel}
            >
                <DialogTitle>Xác nhận xóa thiết bị</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa thiết bị <strong>{assetToDelete?.asset_code} - {assetToDelete?.name}</strong>?
                        <br /><br />
                        Hành động này sẽ xóa tất cả thông tin liên quan (thông số kỹ thuật, thành phần, vật tư tiêu hao, lịch sử bảo trì...) và không thể hoàn tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDeleteCancel}>Hủy</Button>
                    <Button onClick={handleDeleteConfirm} color="error" variant="contained" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default AssetList;
