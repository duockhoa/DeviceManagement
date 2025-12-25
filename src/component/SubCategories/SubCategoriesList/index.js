import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { 
    fetchAssetSubCategories, 
    deleteExistingAssetSubCategory 
} from "../../../redux/slice/assetSubCategoriesSlice";
import {
    Box,
    Typography,
    Chip,
    Paper,
    Dialog,
    IconButton,
    Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../Loading';
import SubCategoriesForm from '../SubCategoriesForm';

function AssetList() {
    const dispatch = useDispatch();
    const assetSubCategories = useSelector((state) => state.assetSubCategories.subCategories);
    const loading = useSelector((state) => state.assetSubCategories.loading);
    const error = useSelector((state) => state.assetSubCategories.error);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedSubCategory, setSelectedSubCategory] = useState(null);

    useEffect(() => {
        dispatch(fetchAssetSubCategories());
    }, [dispatch]);

    const handleClose = () => {
        setOpenDialog(false);
        setSelectedSubCategory(null);
        dispatch(fetchAssetSubCategories());
    };

    const handleEdit = (subCategory) => {
        setSelectedSubCategory(subCategory);
        setOpenDialog(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa loại thiết bị này?')) {
            await dispatch(deleteExistingAssetSubCategory(id));
            dispatch(fetchAssetSubCategories());
        }
    };

    const columns = [
        {
            field: 'code',
            headerName: 'Mã',
            width: 120,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'name',
            headerName: 'Tên loại thiết bị',
            width: 250,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'Category',
            headerName: 'Nhóm thiết bị',
            width: 180,
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
            field: 'created_at',
            headerName: 'Ngày tạo',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {new Date(params.value).toLocaleDateString('vi-VN')}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            sortable: false,
            renderCell: (params) => (
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
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>Quản lý loại thiết bị</Typography>
                <Typography variant="body2" color="text.secondary">
                    Quản lý danh mục các loại thiết bị trong hệ thống.
                </Typography>
            </Paper>

            <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <DataGrid
                    rows={assetSubCategories}
                    columns={columns}
                    loading={loading}
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
            </Paper>

            <Dialog
                open={openDialog}
                onClose={handleClose}
                maxWidth="md"
                fullWidth
            >
                <SubCategoriesForm 
                    handleClose={handleClose} 
                    subCategory={selectedSubCategory}
                />
            </Dialog>
        </Box>
    );
}

export default AssetList;