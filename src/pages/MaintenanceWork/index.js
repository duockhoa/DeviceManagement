import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Chip,
    IconButton,
    Button,
    Tooltip,
    Alert,
    LinearProgress
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import BuildIcon from '@mui/icons-material/Build';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { getMyWorkOrders, getMyRequestTasks } from '../../services/maintenanceWorkService';
import axios from '../../services/customize-axios';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Stack
} from '@mui/material';

function MaintenanceWork() {
    const navigate = useNavigate();
    const [workOrders, setWorkOrders] = useState([]);
    const [requestTasks, setRequestTasks] = useState([]);
    const [reportOpen, setReportOpen] = useState(false);
    const [reportingRequest, setReportingRequest] = useState(null);
    const [reportStatus, setReportStatus] = useState('in_progress');
    const [reportNote, setReportNote] = useState('');
    const [reportLoading, setReportLoading] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadWorkOrders();
    }, []);

    const loadWorkOrders = async () => {
        try {
            setLoading(true);
            const data = await getMyWorkOrders();
            const reqTasks = await getMyRequestTasks();
            // Chuẩn hóa dữ liệu yêu cầu để hiển thị chung
            const mappedReq = (reqTasks || []).map((req) => ({
                id: `req-${req.id}`,
                type: 'request',
                maintenance_code: req.request_code,
                title: req.title,
                asset: req.asset,
                priority: req.priority || 'medium',
                status: req.status || 'pending',
                checklist_progress: 0,
                scheduled_date: req.due_date,
                estimated_duration: null,
                technician_id: req.technician_id,
                requester: req.requester,
                request_id: req.id
            }));
            setWorkOrders([...(data || []), ...mappedReq]);
            setRequestTasks(reqTasks || []);
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
            case 'assigned': return 'info';
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
            case 'assigned': return 'Đã phân công';
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
            renderCell: (params) => {
                if (params.row.type === 'request') {
                    return <Typography variant="caption" sx={{ fontSize: '1.1rem' }}>N/A</Typography>;
                }
                const progress = params.value || 0; // Đảm bảo luôn có giá trị số
                return (
                    <Box sx={{ width: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                            <Typography variant="caption" sx={{ fontSize: '1.1rem' }}>
                                Checklist
                            </Typography>
                            <Typography variant="caption" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                {progress}%
                            </Typography>
                        </Box>
                        <LinearProgress 
                            variant="determinate" 
                            value={progress} 
                            sx={{ height: 6, borderRadius: 1 }}
                        />
                    </Box>
                );
            }
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
                    {params.value || (params.row.type === 'request' ? '--' : 'N/A')}
                </Typography>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                if (params.row.type === 'request') {
                    return (
                        <Stack direction="row" spacing={1}>
                            <Button
                                size="small"
                                variant="outlined"
                                color="info"
                                startIcon={<VisibilityIcon />}
                                onClick={() => navigate('/work-requests/ops')}
                                sx={{ fontSize: '1.1rem' }}
                            >
                                Xem yêu cầu
                            </Button>
                            <Button
                                size="small"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    setReportingRequest(params.row);
                                    setReportStatus(params.row.status === 'pending' ? 'in_progress' : params.row.status);
                                    setReportNote('');
                                    setReportOpen(true);
                                }}
                                sx={{ fontSize: '1.1rem' }}
                            >
                                Báo cáo
                            </Button>
                        </Stack>
                    );
                }
                return (
                    <Button
                        size="small"
                        variant="outlined"
                        color="info"
                        startIcon={<VisibilityIcon />}
                        onClick={() => navigate(`/maintenance-work/${params.row.id}`)}
                        sx={{ fontSize: '1.1rem' }}
                    >
                        Xem
                    </Button>
                );
            }
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
            <Dialog open={reportOpen} onClose={() => setReportOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Báo cáo xử lý yêu cầu</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Trạng thái"
                            value={reportStatus}
                            onChange={(e) => setReportStatus(e.target.value)}
                            size="small"
                        >
                            {[
                                { value: 'in_progress', label: 'Đang xử lý' },
                                { value: 'closed', label: 'Đã hoàn thành' },
                                { value: 'assigned', label: 'Đã phân công' }
                            ].map((opt) => (
                                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Ghi chú/tiến độ"
                            multiline
                            minRows={3}
                            value={reportNote}
                            onChange={(e) => setReportNote(e.target.value)}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReportOpen(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={async () => {
                            if (!reportingRequest) return;
                            try {
                                setReportLoading(true);
                                await axios.post(`/work-requests/${reportingRequest.request_id}/progress`, {
                                    status: reportStatus,
                                    note: reportNote
                                });
                                await loadWorkOrders();
                                setReportOpen(false);
                            } catch (err) {
                                alert(err?.toString?.() || 'Không thể cập nhật yêu cầu');
                            } finally {
                                setReportLoading(false);
                            }
                        }}
                        disabled={reportLoading}
                    >
                        {reportLoading ? 'Đang lưu...' : 'Lưu'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MaintenanceWork;
