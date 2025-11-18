import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Button,
    Alert,
    LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { getMaintenanceResults } from '../../services/maintenanceWorkService';

function MaintenanceResult() {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWorkOrders();
    }, []);

    const loadWorkOrders = async () => {
        try {
            setLoading(true);
            const data = await getMaintenanceResults();
            setWorkOrders(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách kết quả bảo trì');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleViewDetail = (id) => {
        navigate(`/maintenance/${id}`);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'error';
            case 'high': return 'warning';
            case 'medium': return 'info';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const getPriorityLabel = (priority) => {
        switch (priority) {
            case 'critical': return 'Khẩn cấp';
            case 'high': return 'Cao';
            case 'medium': return 'Trung bình';
            case 'low': return 'Thấp';
            default: return priority;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'in_progress': return 'info';
            case 'awaiting_approval': return 'warning';
            case 'completed': return 'success';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'in_progress': return 'Đang thực hiện';
            case 'awaiting_approval': return 'Chờ phê duyệt';
            case 'completed': return 'Hoàn thành';
            default: return status;
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
            width: 250,
            renderCell: (params) => (
                <Box>
                    <Typography sx={{ fontSize: '1.2rem', fontWeight: 500 }}>
                        {params.value}
                    </Typography>
                    {params.row.asset && (
                        <Typography variant="caption" sx={{ fontSize: '1rem', color: '#666' }}>
                            TB: {params.row.asset.name}
                        </Typography>
                    )}
                </Box>
            )
        },
        {
            field: 'status',
            headerName: 'Trạng thái',
            width: 150,
            renderCell: (params) => (
                <Chip 
                    label={getStatusLabel(params.value)}
                    color={getStatusColor(params.value)}
                    size="small"
                    sx={{ fontSize: '1.1rem' }}
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
                    sx={{ fontSize: '1.1rem' }}
                />
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
            headerName: 'Ngày dự kiến',
            width: 130,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.1rem' }}>
                    {params.value ? new Date(params.value).toLocaleDateString('vi-VN') : '-'}
                </Typography>
            )
        },
        {
            field: 'actual_start_date',
            headerName: 'Bắt đầu',
            width: 140,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.1rem' }}>
                    {params.value ? new Date(params.value).toLocaleString('vi-VN', { 
                        day: '2-digit', 
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '-'}
                </Typography>
            )
        },
        {
            field: 'actual_end_date',
            headerName: 'Kết thúc',
            width: 140,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.1rem' }}>
                    {params.value ? new Date(params.value).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                    }) : '-'}
                </Typography>
            )
        },
        {
            field: 'actual_duration',
            headerName: 'Thời gian thực hiện',
            width: 120,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'primary.main' }}>
                    {params.value ? `${parseFloat(params.value).toFixed(1)}h` : '-'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Button
                    size="small"
                    variant="outlined"
                    color="info"
                    startIcon={<VisibilityIcon />}
                    onClick={() => handleViewDetail(params.row.id)}
                    sx={{ fontSize: '1.1rem' }}
                >
                    Xem
                </Button>
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
                <Chip 
                    label={`${workOrders.length} công việc`}
                    color="primary"
                    sx={{ fontSize: '1.2rem' }}
                />
            </Box>

            <Typography variant="body2" sx={{ mb: 3, fontSize: '1.1rem', color: '#666' }}>
                Hiển thị tất cả công việc bảo trì đang thực hiện, chờ phê duyệt và đã hoàn thành
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3, fontSize: '1.2rem' }}>
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
        </Box>
    );
}

export default MaintenanceResult;
