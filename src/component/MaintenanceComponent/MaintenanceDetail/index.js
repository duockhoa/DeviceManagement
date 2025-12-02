import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMaintenanceById, approveMaintenanceRecord, rejectMaintenanceRecord } from '../../../redux/slice/maintenanceSlice';
import usePermissions from '../../../hooks/usePermissions';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    IconButton,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Avatar,
    Stack,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import BuildIcon from '@mui/icons-material/Build';
import PersonIcon from '@mui/icons-material/Person';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import AssignmentIcon from '@mui/icons-material/Assignment';
import Loading from '../../Loading';

function MaintenanceDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const { hasPermission } = usePermissions();
    
    const [maintenanceData, setMaintenanceData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [spareParts, setSpareParts] = useState([]);
    const [openRejectDialog, setOpenRejectDialog] = useState(false);
    const [rejectReason, setRejectReason] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const loadMaintenanceDetail = async () => {
            try {
                setLoading(true);
                const data = await dispatch(fetchMaintenanceById(id)).unwrap();
                console.log('Maintenance detail:', data);
                setMaintenanceData(data);
                
                // Parse spare_parts if exists
                if (data.spare_parts) {
                    try {
                        const parsed = typeof data.spare_parts === 'string' 
                            ? JSON.parse(data.spare_parts) 
                            : data.spare_parts;
                        setSpareParts(Array.isArray(parsed) ? parsed : []);
                    } catch (error) {
                        console.error('Error parsing spare_parts:', error);
                        setSpareParts([]);
                    }
                }
            } catch (error) {
                console.error('Error loading maintenance:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadMaintenanceDetail();
        }
    }, [id, dispatch]);

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

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'low': return 'success';
            case 'medium': return 'info';
            case 'high': return 'warning';
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
            default: return priority;
        }
    };

    const getMaintenanceTypeLabel = (type) => {
        const typeLabels = {
            'cleaning': 'Vệ sinh',
            'inspection': 'Kiểm tra',
            'maintenance': 'Bảo trì',
            'corrective': 'Sửa chữa'
        };
        return typeLabels[type] || type;
    };

    const handleApprove = async () => {
        try {
            setActionLoading(true);
            await dispatch(approveMaintenanceRecord({ 
                id, 
                data: { actual_end_date: new Date() }
            })).unwrap();
            
            alert('Phê duyệt bảo trì thành công!');
            
            // Reload data
            const data = await dispatch(fetchMaintenanceById(id)).unwrap();
            setMaintenanceData(data);
        } catch (error) {
            console.error('Error approving maintenance:', error);
            alert('Lỗi khi phê duyệt: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    const handleReject = async () => {
        if (!rejectReason.trim()) {
            alert('Vui lòng nhập lý do từ chối');
            return;
        }

        try {
            setActionLoading(true);
            await dispatch(rejectMaintenanceRecord({ 
                id, 
                reason: rejectReason 
            })).unwrap();
            
            alert('Đã từ chối phê duyệt. Lịch bảo trì được chuyển về trạng thái "Đang thực hiện"');
            
            // Reload data
            const data = await dispatch(fetchMaintenanceById(id)).unwrap();
            setMaintenanceData(data);
            
            setOpenRejectDialog(false);
            setRejectReason('');
        } catch (error) {
            console.error('Error rejecting maintenance:', error);
            alert('Lỗi khi từ chối: ' + error.message);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!maintenanceData) {
        return (
            <Box sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6">Không tìm thấy lịch bảo trì</Typography>
                <Button onClick={() => navigate('/maintenance')} sx={{ mt: 2 }}>
                    Quay lại danh sách
                </Button>
            </Box>
        );
    }

    const totalSparePartsCost = spareParts.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0);
    const totalConsumablesCost = maintenanceData.maintenanceConsumables?.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0) || 0;
    const totalEstimatedCost = totalSparePartsCost + totalConsumablesCost;

    return (
        <Box sx={{ p: 3, backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate('/maintenance')} sx={{ color: 'primary.main' }}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold', fontSize: '2rem' }}>
                                Chi tiết lịch bảo trì
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                {maintenanceData.maintenance_code}
                            </Typography>
                        </Box>
                    </Box>
                    <Stack direction="row" spacing={2}>
                        <Chip 
                            label={getStatusLabel(maintenanceData.status)} 
                            color={getStatusColor(maintenanceData.status)}
                            sx={{ fontSize: '1rem', height: 36 }}
                        />
                        <Chip 
                            label={getPriorityLabel(maintenanceData.priority)} 
                            color={getPriorityColor(maintenanceData.priority)}
                            sx={{ fontSize: '1rem', height: 36 }}
                        />
                    </Stack>
                </Box>

                {/* Nút phê duyệt - chỉ hiện khi status là awaiting_approval VÀ user có quyền approve */}
                {maintenanceData.status === 'awaiting_approval' && hasPermission('maintenance.approve') && (
                    <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<ThumbUpIcon />}
                            onClick={handleApprove}
                            disabled={actionLoading}
                            sx={{ fontSize: '1rem', px: 3 }}
                        >
                            Phê duyệt
                        </Button>
                        <Button
                            variant="outlined"
                            color="error"
                            startIcon={<ThumbDownIcon />}
                            onClick={() => setOpenRejectDialog(true)}
                            disabled={actionLoading}
                            sx={{ fontSize: '1rem', px: 3 }}
                        >
                            Từ chối
                        </Button>
                    </Box>
                )}
            </Paper>

            <Grid container spacing={2} alignItems="stretch">
                {/* Left Column */}
                <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Thông tin chính */}
                    <Paper sx={{ p: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thông tin bảo trì
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        
                        <Grid container spacing={1.5}>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Tiêu đề
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                    {maintenanceData.title}
                                </Typography>
                            </Grid>
                            
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Loại bảo trì
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {getMaintenanceTypeLabel(maintenanceData.maintenance_type)}
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Thiết bị
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {maintenanceData.asset?.name || 'N/A'}
                                </Typography>
                            </Grid>

                            {maintenanceData.description && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                        Mô tả
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1rem', whiteSpace: 'pre-wrap' }}>
                                        {maintenanceData.description}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Paper>

                    {/* Thời gian thực hiện */}
                    <Paper sx={{ p: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <AccessTimeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thời gian thực hiện
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Grid container spacing={1.5}>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Bắt đầu thực tế
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                    {maintenanceData.actual_start_date ? 
                                        new Date(maintenanceData.actual_start_date).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-'
                                    }
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Kết thúc thực tế
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                    {maintenanceData.actual_end_date ? 
                                        new Date(maintenanceData.actual_end_date).toLocaleString('vi-VN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) : '-'
                                    }
                                </Typography>
                            </Grid>

                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Tổng thời gian
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#1976d2' }}>
                                    {maintenanceData.actual_duration ? 
                                        `${parseFloat(maintenanceData.actual_duration).toFixed(2)} giờ` : '-'
                                    }
                                </Typography>
                            </Grid>
                        </Grid>
                    </Paper>

                    {/* Phụ tùng thay thế */}
                    {spareParts.length > 0 && (
                        <Paper sx={{ p: 2.5 }}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.2rem' }}>
                                🔩 Phụ tùng thay thế
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tên phụ tùng</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Quy cách</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Số lượng</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Đơn giá</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {spareParts.map((part, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.95rem' }}>{index + 1}</TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }}>{part.part_name}</TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }}>{part.specification || '-'}</TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }} align="right">{part.quantity}</TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }} align="right">
                                                    {parseFloat(part.unit_price || 0).toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }} align="right">
                                                    {parseFloat(part.total_price || 0).toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ fontSize: '1rem', fontWeight: 'bold' }} align="right">
                                                Tổng cộng:
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'primary.main' }} align="right">
                                                {totalSparePartsCost.toLocaleString('vi-VN')} VNĐ
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}

                    {/* Vật tư tiêu hao */}
                    {maintenanceData.maintenanceConsumables && maintenanceData.maintenanceConsumables.length > 0 && (
                        <Paper sx={{ p: 2.5 }}>
                            <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.2rem' }}>
                                🧪 Vật tư tiêu hao
                            </Typography>
                            <Divider sx={{ mb: 1.5 }} />
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                            <TableCell sx={{ fontWeight: 'bold' }}>STT</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Tên vật tư</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }}>Quy cách</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">SL yêu cầu</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Đơn giá</TableCell>
                                            <TableCell sx={{ fontWeight: 'bold' }} align="right">Thành tiền</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {maintenanceData.maintenanceConsumables.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell sx={{ fontSize: '0.95rem' }}>{index + 1}</TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }}>
                                                    {item.assetConsumable?.item_name || item.item_name || 'N/A'}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }}>
                                                    {item.assetConsumable?.specification || item.specification || '-'}
                                                </TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }} align="right">{item.quantity_required}</TableCell>
                                                <TableCell sx={{ fontSize: '0.95rem' }} align="right">
                                                    {parseFloat(item.unit_cost || 0).toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                                <TableCell sx={{ fontWeight: 500 }} align="right">
                                                    {parseFloat(item.total_cost || 0).toLocaleString('vi-VN')} VNĐ
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow>
                                            <TableCell colSpan={5} sx={{ fontSize: '1rem', fontWeight: 'bold' }} align="right">
                                                Tổng cộng:
                                            </TableCell>
                                            <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'primary.main' }} align="right">
                                                {totalConsumablesCost.toLocaleString('vi-VN')} VNĐ
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </Grid>

                {/* Right Column */}
                <Grid item xs={12} md={4} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {/* Thời gian */}
                    <Paper sx={{ p: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thời gian
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Stack spacing={1.5}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Ngày dự kiến
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {new Date(maintenanceData.scheduled_date).toLocaleString('vi-VN')}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Thời gian ước tính
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {maintenanceData.estimated_duration} giờ
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Nhân sự */}
                    <Paper sx={{ p: 2.5 }}>
                        <Typography variant="h6" sx={{ mb: 1.5, fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Nhân sự
                        </Typography>
                        <Divider sx={{ mb: 1.5 }} />
                        <Stack spacing={1.5}>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Kỹ thuật viên
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {maintenanceData.technician?.name || 'Chưa phân công'}
                                </Typography>
                            </Box>
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ fontSize: '0.95rem' }}>
                                    Người tạo
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                                    {maintenanceData.creator?.name || 'N/A'}
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Chi phí */}
                    <Paper sx={{ p: 3, mb: 3, backgroundColor: '#e3f2fd' }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
                            <AttachMoneyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Chi phí
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Stack spacing={1.5}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontSize: '1rem' }}>Phụ tùng:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                    {totalSparePartsCost.toLocaleString('vi-VN')} VNĐ
                                </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="body2" sx={{ fontSize: '1rem' }}>Vật tư tiêu hao:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1rem', fontWeight: 500 }}>
                                    {totalConsumablesCost.toLocaleString('vi-VN')} VNĐ
                                </Typography>
                            </Box>
                            <Divider />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                    Tổng ước tính:
                                </Typography>
                                <Typography variant="h6" sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'primary.main' }}>
                                    {totalEstimatedCost.toLocaleString('vi-VN')} VNĐ
                                </Typography>
                            </Box>
                        </Stack>
                    </Paper>

                    {/* Vị trí */}
                    {maintenanceData.location && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
                                <LocationOnIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                                Vị trí
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ fontSize: '1.1rem' }}>
                                {maintenanceData.location}
                            </Typography>
                        </Paper>
                    )}

                    {/* Ghi chú */}
                    {maintenanceData.notes && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
                                Ghi chú
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography variant="body1" sx={{ fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
                                {maintenanceData.notes}
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>

            {/* Checklist - Full Width */}
            {maintenanceData.checklists && maintenanceData.checklists.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
                        <CheckCircleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Checklist bảo trì
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '60px' }}>STT</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minWidth: '200px' }}>Nội dung</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minWidth: '150px' }}>Hạng mục</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '120px' }}>Tiêu chuẩn OK</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minWidth: '180px' }}>Phương pháp</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '150px' }}>Kết quả</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '100px', textAlign: 'center' }}>Đánh giá</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {maintenanceData.checklists.map((item, index) => (
                                    <TableRow key={item.id} sx={{ 
                                        backgroundColor: item.is_completed ? '#f0f9ff' : (index % 2 === 0 ? '#f9f9f9' : '#fff'),
                                        '&:hover': { backgroundColor: '#e3f2fd' }
                                    }}>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', border: '1px solid #ddd', padding: '12px' }}>
                                            {item.task_name}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px' }}>
                                            {item.check_item || '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd', padding: '12px' }}>
                                            {item.standard_value || '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem', color: '#666', border: '1px solid #ddd', padding: '12px' }}>
                                            {item.check_method || '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 500, border: '1px solid #ddd', padding: '12px' }}>
                                            {item.actual_value || (
                                                <Typography color="text.secondary" sx={{ fontSize: '1rem', fontStyle: 'italic' }}>
                                                    Chưa nhập
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                            {item.actual_value ? (
                                                item.is_completed ? (
                                                    <Chip 
                                                        icon={<CheckCircleIcon />}
                                                        label="OK" 
                                                        color="success" 
                                                        size="small"
                                                        sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                                                    />
                                                ) : (
                                                    <Chip 
                                                        label="NG" 
                                                        color="error" 
                                                        size="small"
                                                        sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                                                    />
                                                )
                                            ) : (
                                                <Chip 
                                                    label="NG" 
                                                    color="error" 
                                                    size="small"
                                                    sx={{ fontSize: '1rem', fontWeight: 'bold' }}
                                                />
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Danh sách công việc - Full Width */}
            {maintenanceData.workTasks && maintenanceData.workTasks.length > 0 && (
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', fontSize: '1.3rem' }}>
                        <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Danh sách công việc
                    </Typography>
                    <Divider sx={{ mb: 2 }} />
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '60px' }}>STT</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minWidth: '200px' }}>Tên công việc</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minWidth: '150px' }}>Người thực hiện</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '160px' }}>Bắt đầu</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '160px' }}>Kết thúc</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '120px' }}>Thời gian thực hiện</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', minWidth: '200px' }}>Nội dung</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '120px' }}>Ảnh trước</TableCell>
                                    <TableCell sx={{ fontSize: '1rem', fontWeight: 'bold', color: '#fff', width: '120px' }}>Ảnh sau</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {maintenanceData.workTasks.map((task, index) => (
                                    <TableRow key={task.id} sx={{ 
                                        backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff',
                                        '&:hover': { backgroundColor: '#e3f2fd' }
                                    }}>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                            {index + 1}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', border: '1px solid #ddd', padding: '12px' }}>
                                            {task.task_name}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px' }}>
                                            {task.assigned_to_name || '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px' }}>
                                            {task.started_at ? new Date(task.started_at).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px' }}>
                                            {task.completed_at ? new Date(task.completed_at).toLocaleString('vi-VN', {
                                                day: '2-digit',
                                                month: '2-digit',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            }) : '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1976d2', border: '1px solid #ddd', padding: '12px' }}>
                                            {task.actual_hours ? `${parseFloat(task.actual_hours).toFixed(2)}h` : '-'}
                                        </TableCell>
                                        <TableCell sx={{ fontSize: '1rem', border: '1px solid #ddd', padding: '12px', whiteSpace: 'pre-wrap' }}>
                                            {task.description || '-'}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                            {task.image_before ? (
                                                <img 
                                                    src={task.image_before} 
                                                    alt="Ảnh trước" 
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '2px solid #ddd',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(task.image_before, '_blank')}
                                                />
                                            ) : (
                                                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                    Chưa có
                                                </Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center' }}>
                                            {task.image_after ? (
                                                <img 
                                                    src={task.image_after} 
                                                    alt="Ảnh sau" 
                                                    style={{ 
                                                        width: '100px', 
                                                        height: '100px', 
                                                        objectFit: 'cover',
                                                        borderRadius: '8px',
                                                        border: '2px solid #ddd',
                                                        cursor: 'pointer'
                                                    }}
                                                    onClick={() => window.open(task.image_after, '_blank')}
                                                />
                                            ) : (
                                                <Typography color="text.secondary" sx={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                                                    Chưa có
                                                </Typography>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Dialog từ chối */}
            <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Từ chối phê duyệt</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Lý do từ chối"
                        fullWidth
                        multiline
                        rows={4}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Nhập lý do từ chối phê duyệt..."
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRejectDialog(false)} disabled={actionLoading}>
                        Hủy
                    </Button>
                    <Button onClick={handleReject} variant="contained" color="error" disabled={actionLoading}>
                        Xác nhận từ chối
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MaintenanceDetail;
