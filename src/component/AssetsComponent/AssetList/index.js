import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../../redux/slice/assetsSlice";
import {
    Box,
    Typography,
    Chip,
    Avatar
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DevicesIcon from '@mui/icons-material/Devices';
import Loading from '../../Loading';

function AssetList() {
    const dispatch = useDispatch();
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.assets.loading);
    const error = useSelector((state) => state.assets.error);
    
    useEffect(() => {
        dispatch(fetchAssets());
    }, [dispatch]);
    const columns = [
        {
            field: 'avatar',
            headerName: '',
            width: 60,
            sortable: false,
            renderCell: () => (
                <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                    <DevicesIcon fontSize="small" />
                </Avatar>
            ),
        },
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
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'description',
            headerName: 'Mô tả',
            width: 250,
            renderCell: (params) => (
                <Typography variant="body2" noWrap>
                    {params.value || 'Không có mô tả'}
                </Typography>
            )
        },
        {
            field: 'category',
            headerName: 'Loại thiết bị',
            width: 150,
            renderCell: (params) => (
                <Chip 
                    label={params.row.Category?.name || 'Chưa phân loại'} 
                    color="primary" 
                    size="small"
                    variant="outlined"
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
                />
            )
        },
        {
            field: 'creator',
            headerName: 'Người tạo',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2">
                    {params.row.Creator?.name || 'Không xác định'}
                </Typography>
            )
        },
        {
            field: 'created_at',
            headerName: 'Ngày tạo',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2">
                    {new Date(params.value).toLocaleDateString('vi-VN')}
                </Typography>
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
        <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
                rows={assets}
                columns={columns}
                loading={loading}
                error={error}
                pageSize={5}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
            />
        </Box>
    );
}

export default AssetList;