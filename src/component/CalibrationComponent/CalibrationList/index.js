import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchCalibrations, fetchCalibrationById, deleteCalibrationRecord } from "../../../redux/slice/calibrationSlice";
import {
    Box,
    Typography,
    Chip,
    Avatar,
    IconButton,
    Tooltip,
    Dialog,
    Snackbar,
    Alert
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import StraightenIcon from '@mui/icons-material/Straighten';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Loading from '../../Loading';
import EditCalibrationForm from '../EditCalibrationForm';

function CalibrationList() {
    const dispatch = useDispatch();
    const calibrations = useSelector((state) => state.calibration.calibrations);
    const loading = useSelector((state) => state.calibration.loading);
    const error = useSelector((state) => state.calibration.error);

    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedCalibration, setSelectedCalibration] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        dispatch(fetchCalibrations());
    }, [dispatch]);

    // Handle notifications for delete operations
    useEffect(() => {
        if (error) {
            setNotification({
                open: true,
                message: error,
                severity: 'error'
            });
        }
    }, [error]);

    const handleEdit = async (calibration) => {
        // Fetch fresh data from server to avoid DataGrid row ID issues
        try {
            const response = await dispatch(fetchCalibrationById(calibration.id)).unwrap();
            setSelectedCalibration(response);
        } catch (error) {
            setSelectedCalibration(calibration); // Fallback to original data
        }
        
        setEditDialogOpen(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa lịch hiệu chuẩn này?')) {
            try {
                await dispatch(deleteCalibrationRecord(id)).unwrap();
                setNotification({
                    open: true,
                    message: 'Xóa lịch hiệu chuẩn thành công!',
                    severity: 'success'
                });
            } catch (error) {
                // Error is already handled by useEffect above
            }
        }
    };

    const handleEditClose = () => {
        setEditDialogOpen(false);
        setSelectedCalibration(null);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'default';
            case 'scheduled': return 'secondary';
            case 'in_progress': return 'info';
            case 'awaiting_qa_review': return 'warning';
            case 'accepted': return 'success';
            case 'rejected': return 'error';
            case 'out_of_tolerance': return 'error';
            case 'corrective_action': return 'warning';
            case 'closed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'draft': return 'Nháp';
            case 'scheduled': return 'Đã lập lịch';
            case 'in_progress': return 'Đang thực hiện';
            case 'awaiting_qa_review': return 'Chờ QA duyệt';
            case 'accepted': return 'Đã chấp nhận';
            case 'rejected': return 'Bị từ chối';
            case 'out_of_tolerance': return 'Ngoài dung sai';
            case 'corrective_action': return 'Hành động khắc phục';
            case 'closed': return 'Đã đóng';
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

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'low': return 'Thấp';
            case 'medium': return 'Trung bình';
            case 'high': return 'Cao';
            case 'critical': return 'Khẩn cấp';
            default: return 'Không xác định';
        }
    };

    const getResultColor = (result) => {
        switch (result) {
            case 'pass': return 'success';
            case 'fail': return 'error';
            case 'pending': return 'warning';
            default: return 'default';
        }
    };

    const getResultLabel = (result) => {
        switch (result) {
            case 'pass': return 'Đạt';
            case 'fail': return 'Không đạt';
            case 'pending': return 'Chờ kết quả';
            default: return 'Không xác định';
        }
    };

    const columns = [
        {
            field: 'calibration_code',
            headerName: 'Mã hiệu chuẩn',
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'asset_id',
            headerName: 'Thiết bị',
            width: 250,
            renderCell: (params) => {
                const asset = params.row.asset;
                return (
                    <Box>
                        <Typography variant="body2" sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                            {asset?.name || 'N/A'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                            {asset?.asset_code || `ID: ${params.value}`}
                        </Typography>
                    </Box>
                );
            }
        },
        {
            field: 'calibration_type',
            headerName: 'Loại hiệu chuẩn',
            width: 140,
            renderCell: (params) => (
                <Chip
                    label={params.value === 'internal' ? 'Nội bộ' : 'Bên ngoài'}
                    color="primary"
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '1.2rem' }}
                />
            )
        },
        {
            field: 'priority',
            headerName: 'Ưu tiên',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={getPriorityLabel(params.value)}
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
            field: 'result',
            headerName: 'Kết quả',
            width: 120,
            renderCell: (params) => (
                <Chip
                    label={getResultLabel(params.value)}
                    color={getResultColor(params.value)}
                    size="small"
                    sx={{ fontSize: '1.2rem' }}
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
            field: 'technician_id',
            headerName: 'Kỹ thuật viên',
            width: 180,
            renderCell: (params) => {
                const technician = params.row.technician;
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {technician?.name || (params.value ? `ID: ${params.value}` : 'Chưa phân công')}
                    </Typography>
                );
            }
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

    if (!calibrations || calibrations.length === 0) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mx: 'auto', mb: 2 }}>
                    <StraightenIcon sx={{ fontSize: 40 }} />
                </Avatar>
                <Typography variant="h6" gutterBottom>
                    Chưa có lịch hiệu chuẩn nào
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    Tạo lịch hiệu chuẩn đầu tiên để bắt đầu quản lý hiệu chuẩn thiết bị
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
                rows={calibrations}
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
            
            {/* Edit Calibration Dialog */}
            <Dialog
                open={editDialogOpen}
                onClose={handleEditClose}
                aria-labelledby="edit-calibration-dialog-title"
                aria-describedby="edit-calibration-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                {selectedCalibration && (
                    <EditCalibrationForm 
                        handleClose={handleEditClose} 
                        calibrationData={selectedCalibration}
                        onSuccess={() => {
                            dispatch(fetchCalibrations());
                            setNotification({
                                open: true,
                                message: 'Cập nhật lịch hiệu chuẩn thành công!',
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

export default CalibrationList;