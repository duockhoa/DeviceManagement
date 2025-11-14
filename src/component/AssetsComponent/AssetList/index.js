import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAssets } from "../../../redux/slice/assetsSlice";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Tooltip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DevicesIcon from '@mui/icons-material/Devices';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../Loading';

function AssetList() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.assets.loading);
    const error = useSelector((state) => state.assets.error);

    useEffect(() => {
        dispatch(fetchAssets());
    }, [dispatch]);

    const handleViewDetail = (id) => {
        navigate(`/devices/${id}`);
    };

    const columns = [
        {
            field: 'asset_code',
            headerName: 'Mã thiết bị',
            width: 120,
            fontWeight: 'bold'
        },
        {
            field: 'name',
            headerName: 'Tên thiết bị',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'subCategory',
            headerName: 'Nhóm thiết bị',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.row.SubCategory?.Category?.name || 'Chưa phân loại'}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '1.2rem' }}
                />
            )
        },
        {
            field: 'department',
            headerName: 'Phòng ban',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={params.row.Department?.name || 'Chưa có'}
                    color="secondary"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '1.2rem' }}
                />
            )
        },
        {
            field: 'area',
            headerName: 'Vị trí',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" sx={{ fontSize: '1.1rem', fontWeight: 'medium' }}>
                        {params.row.Area?.name || 'Chưa có'}
                    </Typography>
                    {params.row.Area?.Plant?.name && (
                        <Typography variant="caption" sx={{ fontSize: '1rem', color: '#666' }}>
                            {params.row.Area.Plant.name}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 120,
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
                            fontSize: '1.1rem',
                            fontWeight: 'medium',
                            minWidth: '100px'
                        }}
                    />
                );
            }
        },
        {
            field: 'creator',
            headerName: 'Người tạo',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.row.Creator?.name || 'Không xác định'}
                </Typography>
            )
        },
        {
            field: 'created_at',
            headerName: 'Ngày tạo',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {new Date(params.value).toLocaleDateString('vi-VN')}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 150,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Xem chi tiết">
                        <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleViewDetail(params.row.id)}
                        >
                            <VisibilityIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton size="small" color="warning">
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton size="small" color="error">
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
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
        <Box sx={{ height: "100%", width: '100%' }}>
            <DataGrid
                rows={assets}
                columns={columns}
                loading={loading}
                error={error}
                disableSelectionOnClick
                hideFooterPagination
                hideFooter
                sx={{
                    '& .MuiDataGrid-cell': {
                        fontSize: '1.2rem',
                        display: 'flex',
                        alignItems: 'center'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        fontSize: '1.2rem',
                        fontWeight: 'bold'
                    },
                    '& .MuiDataGrid-row': {
                        minHeight: '60px !important'
                    }
                }}
            />
        </Box>
    );
}

export default AssetList;