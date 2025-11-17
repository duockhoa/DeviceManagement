import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Tooltip,
    Alert,
    LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getMyWorkOrders } from '../../services/maintenanceWorkService';

function MaintenanceWork() {
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
            const data = await getMyWorkOrders();
            setWorkOrders(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải danh sách công việc. Vui lòng thử lại.');
            console.error(err);
        } finally {
            setLoading(false);
        }
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
            case 'pending': return 'warning';
            case 'in_progress': return 'info';
            case 'awaiting_approval': return 'secondary';
            case 'completed': return 'success';
            case 'cancelled': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return 'Chờ xử lý';
            case 'in_progress': return 'Đang thực hiện';
            case 'awaiting_approval': return 'Chờ phê duyệt';
            case 'completed': return 'Hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    const columns = [
        {
            field: 'maintenance_code',
            headerName: 'Mã công việc',
            width: 140,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
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
                    <Typography variant="body2" sx={{ fontWeight: 'medium', fontSize: '1.2rem' }}>
                        {params.value}
                    </Typography>
                    <Typography variant="caption" sx={{ fontSize: '1.1rem', color: '#666' }}>
                        {params.row.asset?.name}
                    </Typography>
                </Box>
            )
        },
        {
            field: 'priority',
            headerName: 'Ưu tiên',
            width: 130,
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
            width: 150,
            renderCell: (params) => (
                <Chip
                    label={getStatusLabel(params.value)}
                    color={getStatusColor(params.value)}
                    size="small"
                    sx={{ fontSize: '1.2rem', fontWeight: 'medium' }}
                />
            )
        },
        {
            field: 'checklist_progress',
            headerName: 'Tiến độ',
            width: 180,
            renderCell: (params) => (
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="caption" sx={{ fontSize: '1.1rem' }}>
                            Checklist
                        </Typography>
                        <Typography variant="caption" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                            {params.value}%
                        </Typography>
                    </Box>
                    <LinearProgress 
                        variant="determinate" 
                        value={params.value} 
                        sx={{ height: 6, borderRadius: 1 }}
                    />
                </Box>
            )
        },
        {
            field: 'scheduled_date',
            headerName: 'Ngày hẹn',
            width: 130,
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.value ? new Date(params.value).toLocaleDateString('vi-VN') : 'N/A'}
                </Typography>
            )
        },
        {
            field: 'estimated_duration',
            headerName: 'Thời lượng (giờ)',
            width: 130,
            align: 'center',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.value || 'N/A'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <Tooltip title="Xem chi tiết">
                    <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => navigate(`/maintenance-work/${params.row.id}`)}
                    >
                        <VisibilityIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            )
        }
    ];

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, backgroundColor: '#f5f5f5' }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <BuildIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
                    <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                        Công việc bảo trì của tôi
                    </Typography>
                </Box>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: 'text.secondary' }}>
                    Danh sách công việc bảo trì được giao
                </Typography>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Paper sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <DataGrid
                    rows={workOrders}
                    columns={columns}
                    loading={loading}
                    pageSizeOptions={[10, 25, 50, 100]}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 25 }
                        }
                    }}
                    disableRowSelectionOnClick
                    getRowHeight={() => 'auto'}
                    sx={{
                        border: 'none',
                        '& .MuiDataGrid-cell': {
                            py: 1.5
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontSize: '1.2rem',
                            fontWeight: 'bold'
                        }
                    }}
                />
            </Paper>
        </Box>
    );
}

export default MaintenanceWork;
