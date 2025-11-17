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
    completeWork,
    updateWorkTaskReport,
    startWorkTask,
    completeWorkTask,
    startMaintenance,
    saveMaintenanceProgress
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
    
    // Save progress dialog
    const [saveProgressDialogOpen, setSaveProgressDialogOpen] = useState(false);
    const [saveProgressNotes, setSaveProgressNotes] = useState('');

    // Work report dialog
    const [workReportDialogOpen, setWorkReportDialogOpen] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [workReportData, setWorkReportData] = useState({
        work_report: '',
        actual_hours: '',
        issues_found: '',
        materials_used: ''
    });
    const [viewReportDialogOpen, setViewReportDialogOpen] = useState(false);

    // Start/Complete task dialogs
    const [startTaskDialogOpen, setStartTaskDialogOpen] = useState(false);
    const [completeTaskDialogOpen, setCompleteTaskDialogOpen] = useState(false);
    const [taskImageBefore, setTaskImageBefore] = useState('');
    const [taskImageAfter, setTaskImageAfter] = useState('');
    const [taskWorkReport, setTaskWorkReport] = useState('');
    const [uploadingImage, setUploadingImage] = useState(false);

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

    const handleStartMaintenance = async () => {
        if (window.confirm('Bạn có chắc muốn bắt đầu lệnh bảo trì này? Trạng thái sẽ chuyển sang "Đang thực hiện" và ghi nhận thời gian bắt đầu.')) {
            try {
                await startMaintenance(id);
                loadWorkOrder();
                alert('Đã bắt đầu lệnh bảo trì!');
            } catch (err) {
                alert('Lỗi khi bắt đầu lệnh bảo trì: ' + (err.response?.data?.message || err.message));
            }
        }
    };

    const handleSaveProgress = async () => {
        try {
            await saveMaintenanceProgress(id, { notes: saveProgressNotes });
            setSaveProgressDialogOpen(false);
            setSaveProgressNotes('');
            loadWorkOrder();
            alert('Đã lưu tiến độ công việc!');
        } catch (err) {
            alert('Lỗi khi lưu tiến độ: ' + (err.response?.data?.message || err.message));
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

    const handleOpenWorkReportDialog = (task) => {
        setSelectedTask(task);
        setWorkReportData({
            work_report: task.work_report || '',
            actual_hours: task.actual_hours || '',
            issues_found: task.issues_found || '',
            materials_used: task.materials_used || ''
        });
        setWorkReportDialogOpen(true);
    };

    const handleViewWorkReport = (task) => {
        setSelectedTask(task);
        setViewReportDialogOpen(true);
    };

    const handleSubmitWorkReport = async () => {
        try {
            await updateWorkTaskReport(id, selectedTask.id, workReportData);
            setWorkReportDialogOpen(false);
            setSelectedTask(null);
            loadWorkOrder();
            alert('Đã lưu báo cáo công việc');
        } catch (err) {
            alert('Lỗi khi lưu báo cáo: ' + err.message);
        }
    };

    const handleStartTask = (task) => {
        setSelectedTask(task);
        setTaskImageBefore('');
        setStartTaskDialogOpen(true);
    };

    const handleImageCapture = async (event, setImageCallback) => {
        const file = event.target.files[0];
        if (!file) return;

        setUploadingImage(true);
        try {
            // Convert to base64
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageCallback(reader.result);
                setUploadingImage(false);
            };
            reader.onerror = () => {
                alert('Lỗi khi đọc file ảnh');
                setUploadingImage(false);
            };
            reader.readAsDataURL(file);
        } catch (err) {
            alert('Lỗi khi xử lý ảnh: ' + err.message);
            setUploadingImage(false);
        }
    };

    const handleConfirmStartTask = async () => {
        try {
            await startWorkTask(id, selectedTask.id, { 
                image_before: taskImageBefore 
            });
            
            setStartTaskDialogOpen(false);
            setSelectedTask(null);
            setTaskImageBefore('');
            loadWorkOrder();
            alert('Đã bắt đầu công việc');
        } catch (err) {
            alert('Lỗi khi bắt đầu công việc: ' + (err.response?.data?.message || err.message));
        }
    };

    const handleCompleteTask = (task) => {
        setSelectedTask(task);
        setTaskWorkReport('');
        setTaskImageAfter('');
        setCompleteTaskDialogOpen(true);
    };

    const handleConfirmCompleteTask = async () => {
        try {
            await completeWorkTask(id, selectedTask.id, { 
                work_report: taskWorkReport,
                image_after: taskImageAfter 
            });
            
            setCompleteTaskDialogOpen(false);
            setSelectedTask(null);
            setTaskWorkReport('');
            setTaskImageAfter('');
            loadWorkOrder();
            alert('Đã hoàn thành công việc');
        } catch (err) {
            alert('Lỗi khi hoàn thành công việc: ' + (err.response?.data?.message || err.message));
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

    // Tính tiến độ tự động
    // Công thức: (1 nếu checklist hoàn thành + Số công việc hoàn thành) / (1 + Tổng công việc)
    // Checklist được tính như 1 công việc lớn
    const completedChecklistItems = workOrder.checklists?.filter(c => c.is_completed).length || 0;
    const totalChecklistItems = workOrder.checklists?.length || 0;
    const isChecklistCompleted = totalChecklistItems > 0 && completedChecklistItems === totalChecklistItems ? 1 : 0;
    
    // Work tasks
    const completedWorkTasks = workOrder.workTasks?.filter(t => t.status === 'completed').length || 0;
    const totalWorkTasks = workOrder.workTasks?.length || 0;
    
    // Tổng công việc: 1 (checklist) + số work tasks
    const totalJobs = (totalChecklistItems > 0 ? 1 : 0) + totalWorkTasks;
    const completedJobs = isChecklistCompleted + completedWorkTasks;
    const overallProgress = totalJobs > 0 ? Math.round((completedJobs / totalJobs) * 100) : 0;
    
    // Tiến độ checklist riêng (để hiển thị trong tab Checklist)
    const checklistProgress = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 100;

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
                            variant="contained" 
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={handleStartMaintenance}
                            disabled={workOrder.status !== 'pending' && workOrder.status !== 'awaiting_approval'}
                        >
                            Bắt đầu
                        </Button>
                        <Button 
                            variant="outlined" 
                            startIcon={<ImageIcon />}
                            onClick={() => {
                                setSaveProgressNotes(workOrder.notes || '');
                                setSaveProgressDialogOpen(true);
                            }}
                            disabled={workOrder.status !== 'in_progress'}
                        >
                            Lưu tiến độ
                        </Button>
                        <Button 
                            variant="contained" 
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={handleCompleteWork}
                            disabled={workOrder.status === 'completed' || checklistProgress < 100}
                        >
                            Báo cáo hoàn thành
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
                                    {{
                                        'cleaning': 'Vệ sinh',
                                        'inspection': 'Kiểm tra',
                                        'maintenance': 'Bảo trì',
                                        'repair': 'Sửa chữa'
                                    }[workOrder.maintenance_type] || workOrder.maintenance_type}
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
                                        Tổng tiến độ
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
                                        {completedJobs}/{totalJobs} công việc ({overallProgress}%)
                                    </Typography>
                                </Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={overallProgress} 
                                    sx={{ height: 8, borderRadius: 1 }}
                                    color={overallProgress === 100 ? 'success' : 'primary'}
                                />
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            {/* Chi tiết tiến độ */}
                            <Box sx={{ mb: 1 }}>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                                        • Checklist
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                                        {completedChecklistItems}/{totalChecklistItems} mục ({checklistProgress}%)
                                    </Typography>
                                </Box>
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                    <Typography variant="body2" sx={{ fontSize: '1rem', color: 'text.secondary' }}>
                                        • Công việc khác
                                    </Typography>
                                    <Typography variant="body2" sx={{ fontSize: '1rem' }}>
                                        {completedWorkTasks}/{totalWorkTasks} việc
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>

                    {workOrder.actual_duration && (
                        <Card sx={{ mt: 2 }}>
                            <CardContent>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                    Thời gian đã dùng:
                                </Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {workOrder.actual_duration} giờ
                                </Typography>
                            </CardContent>
                        </Card>
                    )}
                </Grid>

                {/* Right Column - Tabs */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab label="Checklist" sx={{ fontSize: '1.2rem' }} />
                            <Tab label="Danh sách công việc" sx={{ fontSize: '1.2rem' }} />
                            <Tab label="Hình ảnh" sx={{ fontSize: '1.2rem' }} />
                            <Tab label="Thao tác" sx={{ fontSize: '1.2rem' }} />
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

                        {/* Tab 1: Work Tasks */}
                        <TabPanel value={tabValue} index={1}>
                            {workOrder.workTasks && workOrder.workTasks.length > 0 ? (
                                <Box>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
                                        <thead>
                                            <tr style={{ backgroundColor: '#f5f5f5' }}>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '50px' }}>STT</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', minWidth: '150px' }}>Tên công việc</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left' }}>Người thực hiện</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '120px' }}>Thời gian bắt đầu</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '120px' }}>Thời gian kết thúc</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'left', minWidth: '200px' }}>Nội dung công việc</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '120px' }}>Ảnh trước</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '120px' }}>Ảnh sau</th>
                                                <th style={{ border: '1px solid #ddd', padding: '12px', textAlign: 'center', width: '180px' }}>Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {workOrder.workTasks.map((task, index) => (
                                                <tr key={task.id}>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        {index + 1}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        <Typography sx={{ fontSize: '1.1rem', fontWeight: 500 }}>
                                                            {task.task_name}
                                                        </Typography>
                                                        <Chip 
                                                            label={
                                                                task.task_type === 'cleaning' ? 'Vệ sinh' :
                                                                task.task_type === 'inspection' ? 'Kiểm tra' :
                                                                task.task_type === 'maintenance' ? 'Bảo trì' : 'Khác'
                                                            }
                                                            size="small"
                                                            sx={{ mt: 0.5, fontSize: '0.9rem' }}
                                                        />
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        {task.assigned_to && task.assigned_to.length > 0 ? (
                                                            <Typography sx={{ fontSize: '1rem' }}>
                                                                {task.assigned_to.join(', ')}
                                                            </Typography>
                                                        ) : (
                                                            <Typography color="text.secondary" sx={{ fontSize: '1rem' }}>-</Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        {task.started_at ? (
                                                            <Typography sx={{ fontSize: '0.95rem' }}>
                                                                {new Date(task.started_at).toLocaleString('vi-VN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </Typography>
                                                        ) : (
                                                            <Typography color="text.secondary">-</Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        {task.completed_at ? (
                                                            <Typography sx={{ fontSize: '0.95rem' }}>
                                                                {new Date(task.completed_at).toLocaleString('vi-VN', {
                                                                    day: '2-digit',
                                                                    month: '2-digit',
                                                                    hour: '2-digit',
                                                                    minute: '2-digit'
                                                                })}
                                                            </Typography>
                                                        ) : (
                                                            <Typography color="text.secondary">-</Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                        {task.work_report ? (
                                                            <Typography sx={{ fontSize: '1rem' }}>
                                                                {task.work_report}
                                                            </Typography>
                                                        ) : (
                                                            <Typography color="text.secondary" sx={{ fontSize: '1rem', fontStyle: 'italic' }}>
                                                                Chưa có nội dung
                                                            </Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        {task.image_before ? (
                                                            <img 
                                                                src={task.image_before} 
                                                                alt="Trước" 
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px' }}
                                                                onClick={() => window.open(task.image_before, '_blank')}
                                                            />
                                                        ) : (
                                                            <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                                                Chưa có
                                                            </Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        {task.image_after ? (
                                                            <img 
                                                                src={task.image_after} 
                                                                alt="Sau" 
                                                                style={{ width: '80px', height: '80px', objectFit: 'cover', cursor: 'pointer', borderRadius: '4px' }}
                                                                onClick={() => window.open(task.image_after, '_blank')}
                                                            />
                                                        ) : (
                                                            <Typography color="text.secondary" sx={{ fontSize: '0.9rem' }}>
                                                                Chưa có
                                                            </Typography>
                                                        )}
                                                    </td>
                                                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                                                            {task.status === 'pending' && (
                                                                <Button 
                                                                    size="small" 
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleStartTask(task)}
                                                                    disabled={workOrder.status === 'completed'}
                                                                    fullWidth
                                                                >
                                                                    Bắt đầu
                                                                </Button>
                                                            )}
                                                            {task.status === 'in_progress' && (
                                                                <Button 
                                                                    size="small" 
                                                                    variant="contained"
                                                                    color="success"
                                                                    onClick={() => handleCompleteTask(task)}
                                                                    disabled={workOrder.status === 'completed'}
                                                                    fullWidth
                                                                >
                                                                    Xong
                                                                </Button>
                                                            )}
                                                            {task.status === 'completed' && (
                                                                <Chip 
                                                                    label="Hoàn thành" 
                                                                    color="success" 
                                                                    size="small"
                                                                />
                                                            )}
                                                        </Box>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </Box>
                            ) : (
                                <Alert severity="info">Chưa có công việc nào được giao</Alert>
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

                        {/* Tab 3: Actions */}
                        <TabPanel value={tabValue} index={3}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
                                <Typography variant="h6" sx={{ mb: 2 }}>
                                    Các thao tác
                                </Typography>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    color="primary"
                                    startIcon={<AddIcon />}
                                    onClick={handleStartMaintenance}
                                    disabled={workOrder.status !== 'pending' && workOrder.status !== 'awaiting_approval'}
                                    sx={{ justifyContent: 'flex-start', py: 2 }}
                                >
                                    Bắt đầu bảo trì
                                </Button>
                                <Button 
                                    variant="outlined"
                                    size="large"
                                    startIcon={<SaveIcon />}
                                    onClick={() => {
                                        setSaveProgressNotes(workOrder.notes || '');
                                        setSaveProgressDialogOpen(true);
                                    }}
                                    disabled={workOrder.status !== 'in_progress'}
                                    sx={{ justifyContent: 'flex-start', py: 2 }}
                                >
                                    Lưu tiến độ công việc
                                </Button>
                                <Button 
                                    variant="contained" 
                                    size="large"
                                    color="success"
                                    startIcon={<CheckCircleIcon />}
                                    onClick={handleCompleteWork}
                                    disabled={workOrder.status === 'completed' || overallProgress < 100}
                                    sx={{ justifyContent: 'flex-start', py: 2 }}
                                >
                                    Báo cáo hoàn thành
                                </Button>
                                {overallProgress < 100 && (
                                    <Alert severity="warning" sx={{ mt: 2 }}>
                                        Vui lòng hoàn thành tất cả công việc ({overallProgress}% hoàn thành) trước khi báo cáo hoàn thành.
                                        <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                            • Checklist: {completedChecklistItems}/{totalChecklistItems} mục ({checklistProgress}%)
                                        </Typography>
                                        <Typography variant="caption" sx={{ display: 'block' }}>
                                            • Công việc khác: {completedWorkTasks}/{totalWorkTasks} việc
                                        </Typography>
                                    </Alert>
                                )}
                            </Box>
                        </TabPanel>
                    </Paper>
                </Grid>
            </Grid>

            {/* Progress Dialog */}
            <Dialog open={progressDialogOpen} onClose={() => setProgressDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Bắt đầu công việc</DialogTitle>
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

            {/* Save Progress Dialog */}
            <Dialog open={saveProgressDialogOpen} onClose={() => setSaveProgressDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Lưu tiến độ công việc</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Alert severity="info" sx={{ mb: 2 }}>
                            Lưu ghi chú về tiến độ hiện tại. Dữ liệu checklist và work tasks sẽ được tự động lưu.
                        </Alert>
                        <TextField
                            label="Ghi chú tiến độ"
                            multiline
                            rows={6}
                            fullWidth
                            value={saveProgressNotes}
                            onChange={(e) => setSaveProgressNotes(e.target.value)}
                            placeholder="Nhập ghi chú về công việc đã làm, vấn đề gặp phải, kế hoạch tiếp theo..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSaveProgressDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleSaveProgress} variant="contained" startIcon={<SaveIcon />}>
                        Lưu tiến độ
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Image Upload Dialog */}
            <Dialog open={imageDialogOpen} onClose={() => setImageDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Lưu tiến độ (Upload hình ảnh)</DialogTitle>
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

            {/* Work Report Dialog */}
            <Dialog open={workReportDialogOpen} onClose={() => setWorkReportDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Báo cáo công việc - {selectedTask?.task_name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="Báo cáo công việc đã thực hiện"
                            multiline
                            rows={4}
                            fullWidth
                            value={workReportData.work_report}
                            onChange={(e) => setWorkReportData({...workReportData, work_report: e.target.value})}
                            sx={{ mb: 2 }}
                            required
                        />
                        <TextField
                            label="Thời gian thực tế (giờ)"
                            type="number"
                            fullWidth
                            value={workReportData.actual_hours}
                            onChange={(e) => setWorkReportData({...workReportData, actual_hours: e.target.value})}
                            inputProps={{ min: 0, step: 0.5 }}
                            sx={{ mb: 2 }}
                            helperText={selectedTask?.estimated_hours ? `Thời gian ước tính: ${selectedTask.estimated_hours}h` : ''}
                        />
                        <TextField
                            label="Vấn đề phát hiện (nếu có)"
                            multiline
                            rows={3}
                            fullWidth
                            value={workReportData.issues_found}
                            onChange={(e) => setWorkReportData({...workReportData, issues_found: e.target.value})}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            label="Vật tư/phụ tùng đã sử dụng"
                            multiline
                            rows={3}
                            fullWidth
                            value={workReportData.materials_used}
                            onChange={(e) => setWorkReportData({...workReportData, materials_used: e.target.value})}
                            placeholder="Ví dụ: Dầu nhớt 2L, Vít M8 x 5 cái, ..."
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setWorkReportDialogOpen(false)}>Hủy</Button>
                    <Button 
                        onClick={handleSubmitWorkReport} 
                        variant="contained" 
                        disabled={!workReportData.work_report}
                    >
                        Lưu báo cáo
                    </Button>
                </DialogActions>
            </Dialog>

            {/* View Work Report Dialog */}
            <Dialog open={viewReportDialogOpen} onClose={() => setViewReportDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chi tiết công việc - {selectedTask?.task_name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">Loại công việc</Typography>
                        <Chip 
                            label={
                                selectedTask?.task_type === 'cleaning' ? 'Vệ sinh' :
                                selectedTask?.task_type === 'inspection' ? 'Kiểm tra' :
                                selectedTask?.task_type === 'maintenance' ? 'Bảo trì' : 'Khác'
                            }
                            size="small"
                            sx={{ mb: 2 }}
                        />
                        
                        {selectedTask?.description && (
                            <>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Mô tả</Typography>
                                <Typography sx={{ mb: 2 }}>{selectedTask.description}</Typography>
                            </>
                        )}

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Người thực hiện</Typography>
                        <Typography sx={{ mb: 2 }}>
                            {selectedTask?.assigned_to?.join(', ') || 'Chưa phân công'}
                        </Typography>

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Thời gian</Typography>
                        <Typography sx={{ mb: 2 }}>
                            Ước tính: {selectedTask?.estimated_hours || 0}h | 
                            Thực tế: {selectedTask?.actual_hours || 0}h
                        </Typography>

                        <Divider sx={{ my: 2 }} />

                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Báo cáo công việc</Typography>
                        <Typography sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                            {selectedTask?.work_report || 'Chưa có báo cáo'}
                        </Typography>

                        {selectedTask?.issues_found && (
                            <>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Vấn đề phát hiện</Typography>
                                <Alert severity="warning" sx={{ mb: 2 }}>
                                    {selectedTask.issues_found}
                                </Alert>
                            </>
                        )}

                        {selectedTask?.materials_used && (
                            <>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Vật tư đã sử dụng</Typography>
                                <Typography sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>
                                    {selectedTask.materials_used}
                                </Typography>
                            </>
                        )}

                        {selectedTask?.completed_at && (
                            <>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Hoàn thành lúc</Typography>
                                <Typography>
                                    {new Date(selectedTask.completed_at).toLocaleString('vi-VN')}
                                </Typography>
                            </>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setViewReportDialogOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>

            {/* Start Task Dialog */}
            <Dialog open={startTaskDialogOpen} onClose={() => setStartTaskDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Bắt đầu công việc: {selectedTask?.task_name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? 'Đang xử lý...' : 'Chụp/Chọn ảnh trước'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => handleImageCapture(e, setTaskImageBefore)}
                            />
                        </Button>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Hoặc nhập URL ảnh:
                        </Typography>
                        <TextField
                            label="URL ảnh"
                            fullWidth
                            value={taskImageBefore}
                            onChange={(e) => setTaskImageBefore(e.target.value)}
                            placeholder="https://..."
                            size="small"
                            sx={{ mb: 2 }}
                        />
                        
                        {taskImageBefore && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img 
                                    src={taskImageBefore} 
                                    alt="Preview" 
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setStartTaskDialogOpen(false)}>Hủy</Button>
                    <Button onClick={handleConfirmStartTask} variant="contained" color="primary" disabled={uploadingImage}>
                        Bắt đầu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Complete Task Dialog */}
            <Dialog open={completeTaskDialogOpen} onClose={() => setCompleteTaskDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Hoàn thành công việc: {selectedTask?.task_name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ pt: 2 }}>
                        <TextField
                            label="Nội dung công việc đã thực hiện"
                            multiline
                            rows={4}
                            fullWidth
                            value={taskWorkReport}
                            onChange={(e) => setTaskWorkReport(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />
                        
                        <Button
                            variant="contained"
                            component="label"
                            fullWidth
                            sx={{ mb: 2 }}
                            disabled={uploadingImage}
                        >
                            {uploadingImage ? 'Đang xử lý...' : 'Chụp/Chọn ảnh sau'}
                            <input
                                type="file"
                                hidden
                                accept="image/*"
                                capture="environment"
                                onChange={(e) => handleImageCapture(e, setTaskImageAfter)}
                            />
                        </Button>
                        
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
                            Hoặc nhập URL ảnh:
                        </Typography>
                        <TextField
                            label="URL ảnh"
                            fullWidth
                            value={taskImageAfter}
                            onChange={(e) => setTaskImageAfter(e.target.value)}
                            placeholder="https://..."
                            size="small"
                        />
                        
                        {taskImageAfter && (
                            <Box sx={{ mt: 2, textAlign: 'center' }}>
                                <img 
                                    src={taskImageAfter} 
                                    alt="Preview" 
                                    style={{ maxWidth: '100%', maxHeight: '300px', borderRadius: '8px' }}
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                />
                            </Box>
                        )}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCompleteTaskDialogOpen(false)}>Hủy</Button>
                    <Button 
                        onClick={handleConfirmCompleteTask} 
                        variant="contained" 
                        color="success"
                        disabled={!taskWorkReport || uploadingImage}
                    >
                        Hoàn thành
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default MaintenanceWorkDetail;
