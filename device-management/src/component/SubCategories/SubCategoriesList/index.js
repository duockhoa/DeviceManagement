import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../../redux/slice/assetsSlice";
import {
    Box,
    Typography,
    Chip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Loading from '../../Loading';

function AssetList() {
    const dispatch = useDispatch();
    const assetSubCategories = useSelector((state) => state.assetSubCategories.subCategories);
    const loading = useSelector((state) => state.assetSubCategories.loading);
    const error = useSelector((state) => state.assetSubCategories.error);

    useEffect(() => {
        dispatch(fetchAssets());
    }, [dispatch]);

    const columns = [
        {
            field: 'name',
            headerName: 'Tên loại thiết bị',
            width: 200,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'Category',
            headerName: 'Nhóm thiết bị',
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={params.row.Category?.name || 'Chưa phân loại'}
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
            field: 'created_at',
            headerName: 'Ngày tạo',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
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
        <Box sx={{ height: "100%", width: '100%' }}>
            <DataGrid
                rows={assetSubCategories}
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