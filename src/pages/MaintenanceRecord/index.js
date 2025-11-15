import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DescriptionIcon from '@mui/icons-material/Description';
import { getMaintenanceByStatus } from '../../services/maintenanceService';
import { useNavigate } from 'react-router-dom';

function MaintenanceRecord() {
    const navigate = useNavigate();
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadApprovedRecords();
    }, []);

    const loadApprovedRecords = async () => {
        try {
            setLoading(true);
            // Lấy tất cả WO đã được phê duyệt
            const data = await getMaintenanceByStatus('approved');
            setRecords(data);
        } catch (error) {
            console.error('Error loading approved records:', error);
        } finally {
            setLoading(false);
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

    const getTypeLabel = (type) => {
        switch (type) {
            case 'preventive': return 'Bảo trì dự phòng';
            case 'corrective': return 'Bảo trì sửa chữa';
            case 'emergency': return 'Bảo trì khẩn cấp';
            default: return type;
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
            field: 'maintenance_type',
            headerName: 'Loại bảo trì',
            width: 180,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.1rem' }}>
                    {getTypeLabel(params.value)}
                </Typography>
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
            headerName: 'Ngày thực hiện',
            width: 150,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.2rem' }}>
                    {params.value ? new Date(params.value).toLocaleDateString('vi-VN') : '-'}
                </Typography>
            )
        },
        {
            field: 'actual_duration',
            headerName: 'Thời gian',
            width: 120,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.2rem' }}>
                    {params.value ? `${params.value}h` : '-'}
                </Typography>
            )
        },
        {
            field: 'cost',
            headerName: 'Chi phí',
            width: 130,
            renderCell: (params) => (
                <Typography sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: '#1976d2' }}>
                    {params.value ? `${params.value.toLocaleString()}đ` : '-'}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 100,
            sortable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => navigate(`/maintenance-work/${params.row.id}`)}
                    title="Xem chi tiết"
                >
                    <VisibilityIcon />
                </IconButton>
            )
        }
    ];

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                <DescriptionIcon sx={{ fontSize: '2rem', color: 'primary.main' }} />
                <Typography variant="h5" sx={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
                    Hồ sơ bảo trì
                </Typography>
                <Chip 
                    label={`${records.length} hồ sơ`} 
                    color="primary" 
                    sx={{ fontSize: '1.1rem' }}
                />
            </Box>

            {/* Data Grid */}
            <Paper sx={{ height: 'calc(100vh - 200px)', width: '100%' }}>
                <DataGrid
                    rows={records}
                    columns={columns}
                    loading={loading}
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

export default MaintenanceRecord;
