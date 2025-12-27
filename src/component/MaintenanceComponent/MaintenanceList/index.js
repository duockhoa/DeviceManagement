import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMaintenance, deleteMaintenanceRecord, fetchMaintenanceById } from "../../../redux/slice/maintenanceSlice";
import usePermissions from "../../../hooks/usePermissions";
import { fetchUsers } from "../../../redux/slice/usersSlice";
import { MAINTENANCE_STATUS_LABELS } from "../../../constants/flowMaps";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Button,
    Tooltip,
    Snackbar,
    Alert,
    Dialog,
    Paper
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BuildIcon from '@mui/icons-material/Build';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import Loading from '../../Loading';
import EditMaintenanceForm from '../EditMaintenanceForm';

const MaintenanceList = forwardRef((props, ref) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const maintenance = useSelector((state) => state.maintenance.maintenance);
    const loading = useSelector((state) => state.maintenance.loading);
    const error = useSelector((state) => state.maintenance.error);
    const users = useSelector((state) => state.users.users);
    const user = useSelector((state) => state.user.userInfo);
    const { hasPermission } = usePermissions();

    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedMaintenance, setSelectedMaintenance] = useState(null);

    // Expose reload method to parent component
    useImperativeHandle(ref, () => ({
        reloadData: async () => {
            try {
                console.log('[RELOAD] Reloading all maintenance...');
                await dispatch(fetchMaintenance()).unwrap();
                console.log('All maintenance reloaded');
            } catch (error) {
                console.error('Error reloading maintenance:', error);
            }
        }
    }));

    useEffect(() => {
        // Load tất cả maintenance
        dispatch(fetchMaintenance());
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa lịch bảo trì này?')) return;
        const reason = window.prompt('Nhập lý do xóa (bắt buộc):') || '';
        if (!reason.trim()) {
            setNotification({
                open: true,
                message: 'Cần nhập lý do để xóa lịch bảo trì.',
                severity: 'warning'
            });
            return;
        }

        try {
            await dispatch(deleteMaintenanceRecord({ id, reason })).unwrap();

            // Refresh maintenance list
            await dispatch(fetchMaintenance()).unwrap();

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
    };

    const handleEdit = async (maintenance) => {
        try {
            // Fetch full maintenance details including consumables
            const fullData = await dispatch(fetchMaintenanceById(maintenance.id)).unwrap();
            console.log('Full maintenance data:', fullData);
            setSelectedMaintenance(fullData);
            setEditDialogOpen(true);
        } catch (error) {
            console.error('Error fetching maintenance details:', error);
            // Fallback to using the data from list
            setSelectedMaintenance(maintenance);
            setEditDialogOpen(true);
        }
    };

    const handleEditClose = async () => {
        setEditDialogOpen(false);
        setSelectedMaintenance(null);
        // Reload maintenance
        try {
            await dispatch(fetchMaintenance()).unwrap();
        } catch (error) {
            console.error('Error reloading maintenance:', error);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'default';
            case 'pending': return 'warning';
            case 'approved': return 'primary';
            case 'scheduled': return 'secondary';
            case 'in_progress': return 'info';
            case 'awaiting_acceptance': return 'warning';
            case 'accepted': return 'success';
            case 'closed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        return MAINTENANCE_STATUS_LABELS[status] || 'Không xác định';
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
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
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
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
                        {params.row.asset?.name || 'N/A'}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '1.1rem', color: '#666' }}>
                        {params.row.asset?.asset_code}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'maintenance_type',
            headerName: 'Loại bảo trì',
            width: 140,
            renderCell: (params) => {
                const typeLabels = {
                    'cleaning': 'Vệ sinh',
                    'inspection': 'Kiểm tra',
                    'maintenance': 'Bảo trì',
                    'corrective': 'Sửa chữa'
                };
                return (
                    <Chip
                        label={typeLabels[params.value] || params.value}
                        color="primary"
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '1.2rem' }}
                    />
                );
            }
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
                    sx={{ fontSize: '1.2rem' }}
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
                        fontSize: '1.2rem',
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
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.value ? new Date(params.value).toLocaleDateString('vi-VN') : 'N/A'}
                </Typography>
            )
        },
        {
            field: 'technician',
            headerName: 'Kỹ thuật viên',
            width: 150,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {getTechnicianName(params.row.technician_id)}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 350,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/maintenance/${params.row.id}`)}
                        sx={{ fontSize: '1.1rem' }}
                    >
                        Xem
                    </Button>
                    {hasPermission('maintenance.update') && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="primary"
                            startIcon={<EditIcon />}
                            onClick={() => handleEdit(params.row)}
                            sx={{ fontSize: '1.1rem' }}
                        >
                            Sửa
                        </Button>
                    )}
                    {hasPermission('maintenance.delete') && (
                        <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={<DeleteIcon />}
                            onClick={() => handleDelete(params.row.id)}
                            sx={{ fontSize: '1.1rem' }}
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
            p: 3
        }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 3, backgroundColor: '#f8f9fa' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <CalendarMonthIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                        Lịch bảo trì
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary', mt: 0.5 }}>
                    Quản lý kế hoạch bảo trì thiết bị
                </Typography>
            </Paper>

            <DataGrid
                autoHeight
                rows={maintenance}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick
                sx={{
                    width: '100%',
                    minHeight: 400,
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        borderBottom: '1px solid #f0f0f0',
                        fontSize: '1.2rem'
                    },
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f8f9fa',
                        borderBottom: '2px solid #e0e0e0'
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontSize: '1.2rem',
                        fontWeight: 600
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
});

export default MaintenanceList;
