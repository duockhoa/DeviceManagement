import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    IconButton,
    Button,
    Checkbox,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    Card,
    CardContent,
    CardMedia,
    Alert,
    LinearProgress,
    Tabs,
    Tab
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import AddIcon from '@mui/icons-material/Add';
import ImageIcon from '@mui/icons-material/Image';
import SaveIcon from '@mui/icons-material/Save';
import {
    getWorkOrderById,
    updateChecklistItem,
    addProgressUpdate,
    uploadMaintenanceImage,
    completeWork
} from '../../services/maintenanceWorkService';

function TabPanel({ children, value, index }) {
    return (
        <div hidden={value !== index}>
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function MaintenanceWorkDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [workOrder, setWorkOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    
    // Progress dialog
    const [progressDialogOpen, setProgressDialogOpen] = useState(false);
    const [progressData, setProgressData] = useState({
        progress_percentage: 0,
        work_description: '',
        time_spent: '',
        materials_used: [],
        issues_found: '',
        notes: ''
    });

    // Image upload dialog
    const [imageDialogOpen, setImageDialogOpen] = useState(false);
    const [imageData, setImageData] = useState({
        image_url: '',
        image_type: 'during',
        description: ''
    });

    useEffect(() => {
        loadWorkOrder();
    }, [id]);

    const loadWorkOrder = async () => {
        try {
            setLoading(true);
            const data = await getWorkOrderById(id);
            setWorkOrder(data);
            setError(null);
        } catch (err) {
            setError('Không thể tải thông tin công việc');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleChecklistToggle = async (checklistId, currentStatus, notes) => {
        try {
            await updateChecklistItem(id, checklistId, {
                is_completed: !currentStatus,
                notes: notes || ''
            });
            loadWorkOrder();
        } catch (err) {
            alert('Lỗi khi cập nhật checklist: ' + err.message);
        }
    };

    const handleActualValueChange = async (checklistId, actualValue, currentStatus, notes) => {
        try {
            await updateChecklistItem(id, checklistId, {
                actual_value: actualValue,
                is_completed: currentStatus,
                notes: notes || ''
            });
            loadWorkOrder();
        } catch (err) {
            alert('Lỗi khi cập nhật số liệu: ' + err.message);
        }
    };

    const handleAddProgress = async () => {
        try {
            await addProgressUpdate(id, progressData);
            setProgressDialogOpen(false);
            setProgressData({
                progress_percentage: 0,
                work_description: '',
                time_spent: '',
                materials_used: [],
                issues_found: '',
                notes: ''
            });
            loadWorkOrder();
        } catch (err) {
            alert('Lỗi khi cập nhật tiến độ: ' + err.message);
        }
    };

    const handleUploadImage = async () => {
        try {
            await uploadMaintenanceImage(id, imageData);
            setImageDialogOpen(false);
            setImageData({
                image_url: '',
                image_type: 'during',
                description: ''
            });
            loadWorkOrder();
        } catch (err) {
            alert('Lỗi khi upload hình ảnh: ' + err.message);
        }
    };

    const handleCompleteWork = async () => {
        if (window.confirm('Bạn có chắc muốn hoàn thành công việc này?')) {
            try {
                await completeWork(id, {
                    final_notes: workOrder.notes
                });
                loadWorkOrder();
                alert('Đã hoàn thành công việc. Chờ trưởng bộ phận duyệt.');
            } catch (err) {
                alert(err.response?.data?.message || 'Lỗi khi hoàn thành công việc');
            }
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
            default: return status;
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <Typography variant="h6">Đang tải...</Typography>
            </Box>
        );
    }

    if (error || !workOrder) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error || 'Không tìm thấy công việc'}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/maintenance-work')} sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        );
    }

    const completedTasks = workOrder.checklists?.filter(c => c.is_completed).length || 0;
    const totalTasks = workOrder.checklists?.length || 0;
    const checklistProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <IconButton onClick={() => navigate('/maintenance-work')}>
                            <ArrowBackIcon />
                        </IconButton>
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                                {workOrder.maintenance_code}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                                {workOrder.title}
                            </Typography>
                        </Box>
                        <Chip 
                            label={getPriorityLabel(workOrder.priority)} 
                            color={getPriorityColor(workOrder.priority)}
                            size="small"
                            sx={{ fontSize: '1.2rem' }}
                        />
                        <Chip 
                            label={getStatusLabel(workOrder.status)} 
                            color={getStatusColor(workOrder.status)}
                            size="small"
                            sx={{ fontSize: '1.2rem' }}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button 
                            variant="outlined" 
                            startIcon={<AddIcon />}
                            onClick={() => setProgressDialogOpen(true)}
                            disabled={workOrder.status === 'completed'}
                        >
                            Cập nhật tiến độ
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<ImageIcon />}
                            onClick={() => setImageDialogOpen(true)}
                            disabled={workOrder.status === 'completed'}
                        >
                            Upload hình ảnh
                        </Button>
                        <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleCompleteWork}
                            disabled={workOrder.status === 'completed' || checklistProgress < 100}
                        >
                            Hoàn thành
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* Main Content */}
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Left Column - Info */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        {workOrder.asset?.image && (
                            <CardMedia
                                component="img"
                                height="200"
                                image={workOrder.asset.image}
                                alt={workOrder.asset.name}
                                sx={{ objectFit: 'contain', p: 2, backgroundColor: '#fafafa' }}
                            />
                        )}
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                                Thông tin thiết bị
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Tên thiết bị:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {workOrder.asset?.name || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Mã thiết bị:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {workOrder.asset?.asset_code || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Loại bảo trì:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {workOrder.maintenance_type === 'preventive' ? 'Phòng ngừa' : 'Sửa chữa'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Ngày dự kiến:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {new Date(workOrder.scheduled_date).toLocaleDateString('vi-VN')}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Thời lượng ước tính:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {workOrder.estimated_duration} giờ
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Người tạo:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {workOrder.creator?.name || 'N/A'}
                                </Typography>
                            </Box>

                            {workOrder.description && (
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                        Mô tả:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                        {workOrder.description}
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>

                    {/* Progress Summary */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
                                Tiến độ tổng quan
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ mb: 2 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                                        Checklist
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                        {completedTasks}/{totalTasks} ({checklistProgress}%)
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={checklistProgress} 
                                    sx={{ height: 8, borderRadius: 1 }}
                                />
                            </Box>

                            {workOrder.actual_duration && (
                                <Box sx={{ mb: 1 }}>
                                    <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                        Thời gian đã dùng:
                                    </Typography>
                                    <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                        {workOrder.actual_duration} giờ
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="Checklist" sx={{ fontSize: '1.2rem' }} />
                            <Tab label="Lịch sử cập nhật" sx={{ fontSize: '1.2rem' }} />
                            <Tab label="Hình ảnh" sx={{ fontSize: '1.2rem' }} />
                        </Tabs>

                        {/* Tab 0: Checklist */}
                        <TabPanel value={tabValue} index={0}>
                            {workOrder.checklists && workOrder.checklists.length > 0 ? (
                                <Box sx={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#1976d2' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'left', width: '40px' }}>STT</th>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'left', width: '200px' }}>Nội dung</th>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'left', width: '120px' }}>Hạng mục</th>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'left', width: '100px' }}>Tiêu chuẩn OK</th>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'left', width: '150px' }}>Phương pháp</th>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'left', width: '120px' }}>Số liệu thực tế</th>
                                                <th style={{ border: '1px solid #ddd', padding: '10px', color: '#fff', textAlign: 'center', width: '60px' }}>✓</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workOrder.checklists.map((item, index) => (
                                                <tr key={item.id} style={{ backgroundColor: item.is_completed ? '#f0f9ff' : (index % 2 === 0 ? '#f9f9f9' : '#fff') }}>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        {index + 1}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                                            {item.task_name}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <Typography sx={{ fontSize: '1.1rem' }}>
                                                            {item.check_item || '-'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#1976d2' }}>
                                                            {item.standard_value || '-'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <Typography sx={{ fontSize: '1rem', color: '#666' }}>
                                                            {item.check_method || '-'}
                                                        </Typography>
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <TextField
                                                            fullWidth
                                                            size="small"
                                                            value={item.actual_value || ''}
                                                            onChange={(e) => {
                                                                handleActualValueChange(item.id, e.target.value, item.is_completed, item.notes);
                                                            }}
                                                            placeholder="Nhập số liệu..."
                                                            disabled={workOrder.status === 'completed'}
                                                        />
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        <Checkbox
                                                            checked={item.is_completed}
                                                            onChange={() => handleChecklistToggle(item.id, item.is_completed, item.notes)}
                                                            icon={<RadioButtonUncheckedIcon />}
                                                            checkedIcon={<CheckCircleIcon color="success" />}
                                                            disabled={workOrder.status === 'completed'}
                                                        />
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                            ) : (
                                <Alert severity="info">Chưa có checklist</Alert>
                            )}
                        </TabPanel>

                        {/* Tab 1: Progress Updates */}
                        <TabPanel value={tabValue} index={1}>
                            {workOrder.progress_updates && workOrder.progress_updates.length > 0 ? (
                                <List>
                                    {workOrder.progress_updates.map((update) => (
                                        <Card key={update.id} sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                    <Typography variant="h6" sx={{ fontSize: '1.3rem' }}>
                                                        {update.updater?.name}
                                                    </Typography>
                                                    <Chip 
                                                        label={`${update.progress_percentage}%`} 
                                                        color="primary" 
                                                        size="small"
                                                        sx={{ fontSize: '1.1rem' }}
                                                    />
                                                </Box>
                                                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                                    {new Date(update.created_at).toLocaleString('vi-VN')}
                                                </Typography>
                                                {update.work_description && (
                                                    <Typography variant="body1" sx={{ mt: 1, fontSize: '1.2rem' }}>
                                                        {update.work_description}
                                                    </Typography>
                                                )}
                                                {update.time_spent && (
                                                    <Typography variant="body2" sx={{ mt: 1, fontSize: '1.1rem' }}>
                                                        ⏱️ Thời gian: {update.time_spent} giờ
                                                    </Typography>
                                                )}
                                                {update.issues_found && (
                                                    <Alert severity="warning" sx={{ mt: 1 }}>
                                                        <Typography sx={{ fontSize: '1.1rem' }}>
                                                            {update.issues_found}
                                                        </Typography>
                                                    </Alert>
                                                )}
                                            </CardContent>
                                        </Card>
                                    ))}
                                </List>
                            ) : (
                                <Alert severity="info">Chưa có cập nhật tiến độ</Alert>
                            )}
                        </TabPanel>

                        {/* Tab 2: Images */}
                        <TabPanel value={tabValue} index={2}>
                            <Grid container spacing={2}>
                                {workOrder.images && workOrder.images.length > 0 ? (
                                    workOrder.images.map((img) => (
                                        <Grid item xs={12} sm={6} md={4} key={img.id}>
                                            <Card>
                                                <CardMedia
                                                    component="img"
                                                    height="200"
                                                    image={img.image_url}
                                                    alt={img.description}
                                                />
                                                <CardContent>
                                                    <Chip 
                                                        label={
                                                            img.image_type === 'before' ? 'Trước' :
                                                            img.image_type === 'after' ? 'Sau' : 'Trong quá trình'
                                                        }
                                                        size="small"
                                                        color={
                                                            img.image_type === 'before' ? 'error' :
                                                            img.image_type === 'after' ? 'success' : 'info'
                                                        }
                                                        sx={{ mb: 1, fontSize: '1.1rem' }}
                                                    />
                                                    <Typography variant="body2" sx={{ fontSize: '1.1rem' }}>
                                                        {img.description}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '1rem' }}>
                                                        {img.uploader?.name} - {new Date(img.uploaded_at).toLocaleString('vi-VN')}
                                                    </Typography>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ))
                                ) : (
                                    <Grid item xs={12}>
                                        <Alert severity="info">Chưa có hình ảnh</Alert>
                                    </Grid>
                                )}
                            </Grid>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>

            {/* Progress Dialog */}
            <Dialog open={progressDialogOpen} onClose={() => setProgressDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Cập nhật tiến độ</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="Phần trăm hoàn thành (%)"
                            type="number"
                            fullWidth
                            value={progressData.progress_percentage}
                            onChange={(e) => setProgressData({...progressData, progress_percentage: parseInt(e.target.value) || 0})}
                            inputProps={{ min: 0, max: 100 }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Mô tả công việc đã làm"
                            multiline
                            rows={3}
                            fullWidth
                            value={progressData.work_description}
                            onChange={(e) => setProgressData({...progressData, work_description: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Thời gian đã dùng (giờ)"
                            type="number"
                            fullWidth
                            value={progressData.time_spent}
                            onChange={(e) => setProgressData({...progressData, time_spent: parseFloat(e.target.value) || ''})}
                            inputProps={{ min: 0, step: 0.5 }}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Vấn đề phát hiện (nếu có)"
                            multiline
                            rows={2}
                            fullWidth
                            value={progressData.issues_found}
                            onChange={(e) => setProgressData({...progressData, issues_found: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Ghi chú"
                            multiline
                            rows={2}
                            fullWidth
                            value={progressData.notes}
                            onChange={(e) => setProgressData({...progressData, notes: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProgressDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleAddProgress} variant="contained" startIcon={<SaveIcon />}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Upload Dialog */}
            <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Upload hình ảnh</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="URL hình ảnh"
                            fullWidth
                            value={imageData.image_url}
                            onChange={(e) => setImageData({...imageData, image_url: e.target.value})}
                            sx={{ mb: 2 }}
                            helperText="Nhập URL hình ảnh đã upload lên server"
                        />
                        <TextField
                            select
                            label="Loại hình ảnh"
                            fullWidth
                            value={imageData.image_type}
                            onChange={(e) => setImageData({...imageData, image_type: e.target.value})}
                            sx={{ mb: 2 }}
                            SelectProps={{ native: true }}
                        >
                            <option value="before">Trước bảo trì</option>
                            <option value="during">Trong quá trình</option>
                            <option value="after">Sau bảo trì</option>
                        </TextField>
                        <TextField
                            label="Mô tả"
                            multiline
                            rows={3}
                            fullWidth
                            value={imageData.description}
                            onChange={(e) => setImageData({...imageData, description: e.target.value})}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setImageDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleUploadImage} variant="contained" startIcon={<ImageIcon />}>
                        Upload
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MaintenanceWorkDetail;
