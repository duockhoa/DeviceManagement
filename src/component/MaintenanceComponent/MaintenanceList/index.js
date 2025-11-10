import { Box, Button, IconButton, Tooltip, Typography } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon,
    Add as AddIcon,
    BuildCircle as MaintenanceIcon,
    CheckCircle as CompletedIcon,
    Warning as WarningIcon,
    Cancel as CancelIcon
} from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { 
    fetchMaintenances, 
    setSelectedItem, 
    deleteExistingMaintenance 
} from '../../../redux/slice/maintenanceSlice';
import MaintenanceForm from '../MaintenanceForm';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import BatchOperations from '../BatchOperations';
import theme from '../../../theme';

function MaintenanceList() {
    const dispatch = useDispatch();
    
    // Lấy dữ liệu từ Redux store
    const { items: maintenanceList, loading, error } = useSelector(state => state.maintenance);
    const [selectedRows, setSelectedRows] = useState([]);

    // States để quản lý dialog
    const [openForm, setOpenForm] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [selectedId, setSelectedId] = useState(null);

    // Lấy danh sách bảo trì khi component được mount
    useEffect(() => {
        dispatch(fetchMaintenances());
    }, [dispatch]);

    // Cấu hình cho các trạng thái và mức độ ưu tiên
    const statusConfig = {
        pending: {
            color: theme.palette.warning.main,
            icon: <WarningIcon />,
            label: 'Chờ xử lý'
        },
        in_progress: {
            color: theme.palette.info.main,
            icon: <MaintenanceIcon />,
            label: 'Đang thực hiện'
        },
        completed: {
            color: theme.palette.success.main,
            icon: <CompletedIcon />,
            label: 'Hoàn thành'
        },
        cancelled: {
            color: theme.palette.error.main,
            icon: <CancelIcon />,
            label: 'Đã hủy'
        }
    };

    const priorityConfig = {
        low: {
            color: theme.palette.success.main,
            label: 'Thấp'
        },
        medium: {
            color: theme.palette.warning.main,
            label: 'Trung bình'
        },
        high: {
            color: theme.palette.error.main,
            label: 'Cao'
        },
        urgent: {
            color: theme.palette.error.dark,
            label: 'Khẩn cấp'
        }
    };

    // Xử lý các actions
    const handleOpenAddForm = () => {
        dispatch(setSelectedItem(null));
        setOpenForm(true);
    };

    const handleEdit = (maintenance) => {
        dispatch(setSelectedItem(maintenance));
        setOpenForm(true);
    };

    const handleCloseForm = () => {
        dispatch(setSelectedItem(null));
        setOpenForm(false);
    };

    const handleOpenDeleteDialog = (id) => {
        setSelectedId(id);
        setOpenDeleteDialog(true);
    };

    const handleDelete = async () => {
        try {
            await dispatch(deleteExistingMaintenance(selectedId)).unwrap();
            setOpenDeleteDialog(false);
            setSelectedId(null);
        } catch (err) {
            console.error('Lỗi khi xóa:', err);
        }
    };

    // Định nghĩa cột cho DataGrid
    const columns = [
        { 
            field: 'asset_name', 
            headerName: 'Tên thiết bị', 
            width: 200,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span>{params.value}</span>
                </Tooltip>
            )
        },
        {
            field: 'asset_code',
            headerName: 'Mã thiết bị',
            width: 130
        },
        { 
            field: 'scheduled_date', 
            headerName: 'Ngày bảo trì', 
            width: 150,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString('vi-VN');
            }
        },
        { 
            field: 'status', 
            headerName: 'Trạng thái', 
            width: 160,
            renderCell: (params) => (
                <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center',
                    color: statusConfig[params.value].color
                }}>
                    {statusConfig[params.value].icon}
                    <Typography sx={{ ml: 1 }}>
                        {statusConfig[params.value].label}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'priority',
            headerName: 'Độ ưu tiên',
            width: 130,
            renderCell: (params) => (
                <Box
                    sx={{
                        backgroundColor: priorityConfig[params.value].color,
                        color: 'white',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '0.875rem'
                    }}
                >
                    {priorityConfig[params.value].label}
                </Box>
            )
        },
        { 
            field: 'technician', 
            headerName: 'Kỹ thuật viên', 
            width: 160 
        },
        { 
            field: 'description', 
            headerName: 'Mô tả', 
            width: 200,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span>{params.value}</span>
                </Tooltip>
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
                            onClick={() => handleEdit(params.row)}
                            sx={{ color: theme.palette.primary.main }}
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            onClick={() => handleOpenDeleteDialog(params.row.id)}
                            sx={{ color: theme.palette.error.main }}
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    if (loading) {
        return <Typography>Đang tải...</Typography>;
    }

    if (error) {
        return <Typography color="error">Lỗi: {error}</Typography>;
    }

    return (
        <Box sx={{ height: '100%', p: 2 }}>
            {/* Header */}
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    Quản lý bảo trì thiết bị
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <BatchOperations selectedRows={selectedRows} />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={handleOpenAddForm}
                        sx={{ 
                        backgroundColor: theme.palette.primary.main,
                        '&:hover': {
                            backgroundColor: theme.palette.primary.dark
                        }
                    }}
                >
                    Thêm lịch bảo trì
                </Button>
            </Box>

            {/* DataGrid */}
            <Box sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid
                    rows={maintenanceList}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10, 25, 50]}
                    disableSelectionOnClick
                    loading={loading}
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '1rem'
                        },
                        '& .MuiDataGrid-columnHeader': {
                            backgroundColor: '#f5f5f5',
                            fontSize: '1rem',
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Box>

            {/* Form dialog */}
            <MaintenanceForm 
                open={openForm}
                onClose={handleCloseForm}
            />

            {/* Delete confirmation dialog */}
            <DeleteConfirmDialog
                open={openDeleteDialog}
                onClose={() => setOpenDeleteDialog(false)}
                onConfirm={handleDelete}
                title="Xóa lịch bảo trì"
                content="Bạn có chắc chắn muốn xóa lịch bảo trì này không?"
            />
        </Box>
    );
}

export default MaintenanceList;