import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../../redux/slice/assetsSlice";
import {
    Box,
    Typography,
    Chip,
    Paper,
    Button,
    Stack,
    Dialog,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import Loading from '../../Loading';
import SubCategoriesForm from '../SubCategoriesForm';

function AssetList() {
    const dispatch = useDispatch();
    const assetSubCategories = useSelector((state) => state.assetSubCategories.subCategories);
    const loading = useSelector((state) => state.assetSubCategories.loading);
    const error = useSelector((state) => state.assetSubCategories.error);
    const [openDialog, setOpenDialog] = useState(false);

    useEffect(() => {
        dispatch(fetchAssets());
    }, [dispatch]);

    const handleClose = () => {
        setOpenDialog(false);
        dispatch(fetchAssets());
    };

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
        <>
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Thông số kỹ thuật thiết bị</Typography>
                    <Typography variant="body2" color="text.secondary">
                        Quản lý danh mục và thông số kỹ thuật của các loại thiết bị.
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        startIcon={<DownloadIcon />}
                        onClick={() => {
                            // TODO: Export to Excel
                        }}
                    >
                        Xuất Excel
                    </Button>
                    <Button
                        variant="outlined"
                        startIcon={<UploadIcon />}
                        onClick={() => {
                            // TODO: Import from Excel
                        }}
                    >
                        Nhập Excel
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setOpenDialog(true)}
                    >
                        Thêm loại thiết bị
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ height: "100%", width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <DataGrid
                        rows={assetSubCategories}
                        columns={columns}
                        loading={loading}
                        pageSize={10}
                        rowsPerPageOptions={[10, 25, 50]}
                        disableSelectionOnClick
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
                </Box>
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="lg"
                fullWidth
            >
                <SubCategoriesForm handleClose={handleClose} />
            </Dialog>
        </>
    );
}

export default AssetList;