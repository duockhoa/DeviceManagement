import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Alert,
    LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { getPendingApproval, approveWork } from '../../services/maintenanceWorkService';

function MaintenanceResult() {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedWO, setSelectedWO] = useState(null);
    const [approveDialogOpen, setApproveDialogOpen] = useState(false);
    const [approvalData, setApprovalData] = useState({
        approved: true,
        rejection_reason: ''
    });

    useEffect(() => {
        loadWorkOrders();
    }, []);

    const loadWorkOrders = async () => {
        try {
            setLoading(true);
            const data = await getPendingApproval();
            setWorkOrders(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách công việc chờ duyệt');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id) => {
        navigate(`/maintenance-work/${id}`);
    };

    const handleOpenApprove = (wo, approved) => {
        setSelectedWO(wo);
        setApprovalData({
            approved,
            rejection_reason: ''
        });
        setApproveDialogOpen(true);
    };

    const handleCloseApprove = () => {
        setApproveDialogOpen(false);
        setSelectedWO(null);
        setApprovalData({
            approved: true,
            rejection_reason: ''
        });
    };

    const handleSubmitApproval = async () => {
        if (!selectedWO) return;

        if (!approvalData.approved && !approvalData.rejection_reason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }

        try {
            await approveWork(selectedWO.id, approvalData);
            alert(approvalData.approved ? 'Đã phê duyệt công việc thành công' : 'Đã từ chối công việc');
            handleCloseApprove();
            loadWorkOrders();
        } catch (err) {
            alert('Lỗi khi xử lý phê duyệt: ' + err.message);
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'info';
            default: return 'default';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return priority;
        }
    };

    const columns = [
        {
            field: 'maintenance_code',
            headerName: 'Mã bảo trì',
            width: 150,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                    {params.value}
                </Typography>
            )
        },
        {
            field: 'title',
            headerName: 'Tiêu đề',
            width: 300,
            renderCell: (params) => (
                <Box>
                    <Typography sx={{ fontSize: '1.2rem' }}>
                        {params.value}
                    </Typography>
                    {params.row.asset && (
                        <Typography variant="caption" sx={{ fontSize: '1.1rem', color: '#666' }}>
                            TB: {params.row.asset.name}
                        </Typography>
                    )}
                </Box>
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
                    sx={{ fontSize: '1.1rem' }}
                />
            )
        },
        {
            field: 'checklist_progress',
            headerName: 'Tiến độ checklist',
            width: 200,
            renderCell: (params) => (
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ flexGrow: 1 }}>
                        <LinearProgress 
                            variant="determinate" 
                            value={params.value || 0}
                            sx={{ height: 8, borderRadius: 1 }}
                        />
                    </Box>
                    <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                        {params.value || 0}%
                    </Typography>
                </Box>
            )
        },
        {
            field: 'technician',
            headerName: 'Kỹ thuật viên',
            width: 180,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.2rem' }}>
                    {params.value?.name || '-'}
                </Typography>
            )
        },
        {
            field: 'scheduled_date',
            headerName: 'Ngày thực hiện',
            width: 150,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.2rem' }}>
                    {params.value ? new Date(params.value).toLocaleDateString('vi-VN') : '-'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 250,
            sortable: false,
            renderCell: (params) => (
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetail(params.row.id)}
                        title="Xem chi tiết"
                    >
                        <VisibilityIcon />
                    </IconButton>
                    <Button
                        size="small"
                        variant="contained"
                        color="success"
                        startIcon={<CheckCircleIcon />}
                        onClick={() => handleOpenApprove(params.row, true)}
                        sx={{ fontSize: '1rem' }}
                    >
                        Duyệt
                    </Button>
                    <Button
                        size="small"
                        variant="outlined"
                        color="error"
                        startIcon={<CancelIcon />}
                        onClick={() => handleOpenApprove(params.row, false)}
                        sx={{ fontSize: '1rem' }}
                    >
                        Từ chối
                    </Button>
                </Box>
            )
        }
    ];

    if (loading) {
        return (
            <Box sx={{ p: 3 }}>
                <Typography>Đang tải...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <AssignmentTurnedInIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                    Kết quả bảo trì
                </Typography>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Data Grid */}
            <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid
                    rows={workOrders}
                    columns={columns}
                    pageSize={25}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    disableSelectionOnClick
                    sx={{
                        '& .MuiDataGrid-cell': {
                            fontSize: '1.2rem'
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            fontSize: '1.2rem',
                            fontWeight: 'bold',
                            backgroundColor: '#f5f5f5'
                        }
                    }}
                />
            </Paper>

            {/* Approval Dialog */}
            <Dialog open={approveDialogOpen} onClose={handleCloseApprove} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Typography sx={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
                        {approvalData.approved ? 'Phê duyệt công việc' : 'Từ chối công việc'}
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    {selectedWO && (
                        <Box sx={{ mb: 2 }}>
                            <Typography sx={{ fontSize: '1.2rem', mb: 1 }}>
                                <strong>Mã:</strong> {selectedWO.maintenance_code}
                            </Typography>
                            <Typography sx={{ fontSize: '1.2rem', mb: 1 }}>
                                <strong>Tiêu đề:</strong> {selectedWO.title}
                            </Typography>
                            <Typography sx={{ fontSize: '1.2rem', mb: 1 }}>
                                <strong>Kỹ thuật viên:</strong> {selectedWO.technician?.name}
                            </Typography>
                        </Box>
                    )}

                    {!approvalData.approved && (
                        <TextField
                            fullWidth
                            multiline
                            rows={4}
                            label="Lý do từ chối"
                            value={approvalData.rejection_reason}
                            onChange={(e) => setApprovalData({ ...approvalData, rejection_reason: e.target.value })}
                            placeholder="Nhập lý do từ chối công việc..."
                            required
                        />
                    )}

                    {approvalData.approved && (
                        <Alert severity="success">
                            Sau khi phê duyệt, công việc sẽ được chuyển vào Hồ sơ bảo trì.
                        </Alert>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseApprove} sx={{ fontSize: '1.1rem' }}>
                        Hủy
                    </Button>
                    <Button 
                        onClick={handleSubmitApproval} 
                        variant="contained"
                        color={approvalData.approved ? 'success' : 'error'}
                        sx={{ fontSize: '1.1rem' }}
                    >
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MaintenanceResult;
