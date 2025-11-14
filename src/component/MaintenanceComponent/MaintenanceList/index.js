import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMaintenance, deleteMaintenanceRecord } from "../../../redux/slice/maintenanceSlice";
import { fetchUsers } from "../../../redux/slice/usersSlice";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Snackbar,
    Alert,
    Dialog
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../Loading';
import EditMaintenanceForm from '../EditMaintenanceForm';

function MaintenanceList() {
    const dispatch = useDispatch();
    const maintenance = useSelector((state) => state.maintenance.maintenance);
    const loading = useSelector((state) => state.maintenance.loading);
    const error = useSelector((state) => state.maintenance.error);
    const users = useSelector((state) => state.users.users);

    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);

    useEffect(() => {
        dispatch(fetchMaintenance());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa lịch bảo trì này?')) {
            try {
                await dispatch(deleteMaintenanceRecord(id)).unwrap();
                
                // Refresh data from server to ensure consistency
                await dispatch(fetchMaintenance());
                
                setNotification({
                    open: true,
                    message: 'Xóa lịch bảo trì thành công!',
                    severity: 'success'
                });
            } catch (error) {
                setNotification({
                    open: true,
                    message: error || 'Không thể xóa lịch bảo trì. Vui lòng thử lại.',
                    severity: 'error'
                });
            }
        }
    };

    const handleEdit = (maintenance) => {
        setSelectedMaintenance(maintenance);
        setEditDialogOpen(true);
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedMaintenance(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'in_progress': return 'info';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'in_progress': return 'Đang thực hiện';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return 'Không xác định';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return 'success';
            case 'medium': return 'warning';
            case 'high': return 'error';
            case 'critical': return 'error';
            default: return 'default';
        }
    };

    const getPriorityText = (priority) => {
        switch (priority) {
            case 'low': return 'Thấp';
            case 'medium': return 'Trung bình';
            case 'high': return 'Cao';
            case 'critical': return 'Khẩn cấp';
            default: return 'Không xác định';
        }
    };

    const getTechnicianName = (technicianId) => {
        if (!technicianId || !users || users.length === 0) {
            return 'Chưa phân công';
        }
        
        // Try both string and number comparison
        const technician = users.find(user => 
            user.id === technicianId || 
            user.id === String(technicianId) || 
            String(user.id) === String(technicianId)
        );
        
        return technician ? technician.name : 'Chưa phân công';
    };

    const columns = [
        {
            field: 'maintenance_code',
            headerName: 'Mã bảo trì',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'asset',
            headerName: 'Thiết bị',
            width: 200,
            renderCell: (params) => (
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.1rem' }}>
                        {params.row.asset?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '1rem', color: '#666' }}>
                        {params.row.asset?.asset_code}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'maintenance_type',
            headerName: 'Loại bảo trì',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'preventive' ? 'Phòng ngừa' : 'Sửa chữa'}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '1rem' }}
                />
            )
        },
        {
            field: 'priority',
            headerName: 'Ưu tiên',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={getPriorityText(params.value)}
                    color={getPriorityColor(params.value)}
                    size="small"
                    sx={{ fontSize: '1rem' }}
                />
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={getStatusLabel(params.value)}
                    color={getStatusColor(params.value)}
                    size="small"
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 'medium',
                        minWidth: '110px'
                    }}
                />
            )
        },
        {
            field: 'scheduled_date',
            headerName: 'Ngày dự kiến',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                    {params.value ? new Date(params.value).toLocaleDateString('vi-VN') : 'N/A'}
                </Typography>
            )
        },
        {
            field: 'technician',
            headerName: 'Kỹ thuật viên',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                    {getTechnicianName(params.row.technician_id)}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Chỉnh sửa">
                        <IconButton 
                            size="small" 
                            color="primary"
                            onClick={() => handleEdit(params.row)}
                        >
                            <EditIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton 
                            size="small" 
                            color="error"
                            onClick={() => handleDelete(params.row.id)}
                        >
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
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="body1" color="error">
                    {error}
                </Typography>
            </Box>
        );
    }

    if (!maintenance || maintenance.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <BuildIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                    Chưa có lịch bảo trì nào
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Tạo lịch bảo trì đầu tiên để bắt đầu quản lý bảo trì thiết bị
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
        }}>
            <DataGrid
                rows={maintenance}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                    width: '100%',
                    flex: 1,
                    minHeight: 400,
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f0f0f0'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0'
                    }
                }}
            />

            {/* Edit Maintenance Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-maintenance-dialog-title"
                aria-describedby="edit-maintenance-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                {selectedMaintenance && (
                    <EditMaintenanceForm 
                        handleClose={handleEditClose} 
                        maintenanceData={selectedMaintenance}
                        onSuccess={() => {
                            dispatch(fetchMaintenance());
                            setNotification({
                                open: true,
                                message: 'Cập nhật lịch bảo trì thành công!',
                                severity: 'success'
                            });
                        }}
                    />
                )}
            </Dialog>

            {/* Notification Snackbar */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={() => setNotification({ ...notification, open: false })}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setNotification({ ...notification, open: false })} 
                    severity={notification.severity} 
                    sx={{ width: '100%' }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default MaintenanceList;