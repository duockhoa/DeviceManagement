import { useState, useEffect } from 'react';
import {
    Button,
    Typography,
    Box,
    Alert,
    Snackbar,
    Tabs,
    Tab,
    Divider,
    Stack,
    IconButton,
    Checkbox,
    FormControlLabel,
    TextField,
    Card,
    CardContent,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip
} from '@mui/material';
import { Unstable_Grid2 as Grid2 } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { useDispatch, useSelector } from 'react-redux';
import { createMaintenanceRecord } from '../../../redux/slice/maintenanceSlice';
import { fetchAssets } from '../../../redux/slice/assetsSlice';
import { fetchUsers } from '../../../redux/slice/usersSlice';
import { getActiveConsumableCategories } from '../../../services/consumableCategoriesService';
import InputField from '../../InputComponent/InputField';
import SelectField from '../../InputComponent/SelectField';
import InputDate from '../../InputComponent/InputDate';
import InputNumber from '../../InputComponent/InputNumber';
import { useTheme } from '@mui/material/styles';

// Custom TabPanel component
function CustomTabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ flexGrow: 1, overflow: 'auto', padding: '20px', backgroundColor: '#fff' }}
            {...other}
        >
            {value === index && (
                <Box>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AddMaintenanceForm({ handleClose }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const assets = useSelector((state) => state.assets.assets);
    const users = useSelector((state) => state.users.users);
    const loading = useSelector((state) => state.maintenance.loading);

    const [formData, setFormData] = useState({
        maintenance_code: '',
        asset_id: '',
        maintenance_type: 'preventive',
        priority: 'medium',
        title: '',
        description: '',
        scheduled_date: '',
        estimated_duration: '',
        technician_id: '',
        cost: '',
        location: '',
        safety_requirements: '',
        tools_required: '',
        measuring_tools: '',
        safety_tools: '',
        spare_parts: '',
        consumables: [], // Changed from string to array
        estimated_cost: '',
        notes: ''
    });

    // State cho danh mục vật tư tiêu hao
    const [consumableCategories, setConsumableCategories] = useState([]);

    // State cho checklist bảo trì
    const [maintenanceChecklist, setMaintenanceChecklist] = useState([
        { id: 1, task: 'Kiểm tra nguồn điện', completed: false, required: true },
        { id: 2, task: 'Vệ sinh thiết bị', completed: false, required: true },
        { id: 3, task: 'Kiểm tra các bộ phận chuyển động', completed: false, required: true },
        { id: 4, task: 'Bôi trơn các khớp nối', completed: false, required: false },
        { id: 5, task: 'Kiểm tra hệ thống an toàn', completed: false, required: true },
        { id: 6, task: 'Cập nhật nhật ký bảo trì', completed: false, required: true }
    ]);

    // State cho danh sách công việc
    const [workTasks, setWorkTasks] = useState([]);

    const [formErrors, setFormErrors] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    
    // State cho tài liệu đính kèm
    const [attachedFiles, setAttachedFiles] = useState([]);

    useEffect(() => {
        // Fetch assets if not already loaded
        if (!assets || assets.length === 0) {
            dispatch(fetchAssets());
        }

        // Fetch users if not already loaded
        if (!users || users.length === 0) {
            dispatch(fetchUsers());
        }

        // Generate maintenance code
        const timestamp = Date.now();
        const random = Math.floor(Math.random() * 1000);
        setFormData(prev => ({
            ...prev,
            maintenance_code: `MT-${timestamp}-${random}`
        }));

        // Load consumable categories
        const loadConsumableCategories = async () => {
            try {
                const categories = await getActiveConsumableCategories();
                setConsumableCategories(categories);
            } catch (error) {
                console.error('Error loading consumable categories:', error);
            }
        };
        loadConsumableCategories();
    }, [dispatch, assets, users]);

    const validateForm = () => {
        const errors = {};

        if (!formData.asset_id) {
            errors.asset_id = 'Vui lòng chọn thiết bị';
        }

        if (!formData.title.trim()) {
            errors.title = 'Vui lòng nhập tiêu đề bảo trì';
        }

        if (!formData.scheduled_date) {
            errors.scheduled_date = 'Vui lòng chọn ngày dự kiến';
        }

        if (!formData.estimated_duration || formData.estimated_duration <= 0) {
            errors.estimated_duration = 'Vui lòng nhập thời gian ước tính hợp lệ';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange2 = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error for this field
        if (formErrors[field]) {
            setFormErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle consumables array
    const addConsumable = () => {
        setFormData(prev => ({
            ...prev,
            consumables: [
                ...prev.consumables,
                {
                    consumable_category_id: '',
                    quantity_required: 1,
                    unit_cost: '',
                    total_cost: '',
                    notes: '',
                    status: 'planned'
                }
            ]
        }));
    };

    const updateConsumable = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            consumables: prev.consumables.map((item, i) =>
                i === index
                    ? {
                        ...item,
                        [field]: value,
                        // Auto calculate total_cost if quantity_required or unit_cost changes
                        total_cost: field === 'quantity_required' || field === 'unit_cost'
                            ? (field === 'quantity_required' ? value : item.quantity_required || 0) *
                              (field === 'unit_cost' ? value : item.unit_cost || 0)
                            : item.total_cost
                    }
                    : item
            )
        }));
    };

    const removeConsumable = (index) => {
        setFormData(prev => ({
            ...prev,
            consumables: prev.consumables.filter((_, i) => i !== index)
        }));
    };

    // Handle upload files
    const handleFilesSelect = (event) => {
        const files = Array.from(event.target.files);
        const maxSize = 10 * 1024 * 1024; // 10MB
        const allowedTypes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'image/jpeg',
            'image/png',
            'image/gif'
        ];

        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                alert(`File "${file.name}" quá lớn. Vui lòng chọn file dưới 10MB`);
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                alert(`File "${file.name}" không được hỗ trợ. Chỉ chấp nhận: PDF, DOC, DOCX, JPG, PNG, GIF`);
                return false;
            }
            return true;
        });

        const newFiles = validFiles.map(file => ({
            id: Date.now() + Math.random(),
            file: file,
            name: file.name,
            size: file.size,
            type: file.type
        }));

        setAttachedFiles(prev => [...prev, ...newFiles]);
    };

    // Handle remove file
    const handleRemoveFile = (fileId) => {
        setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
    };

    // Format file size helper
    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const submitData = {
                ...formData,
                scheduled_date: new Date(formData.scheduled_date).toISOString(),
                estimated_duration: parseInt(formData.estimated_duration),
                estimated_cost: formData.estimated_cost ? parseFloat(formData.estimated_cost) : null,
                status: 'pending'
                // Tạm thời không gửi attachedFiles
            };

            console.log('Submit data:', submitData); // Debug log
            console.log('Form data before submit:', formData); // Debug log

            await dispatch(createMaintenanceRecord(submitData)).unwrap();
            setSuccessMessage('Tạo lịch bảo trì thành công!');
            setShowSuccess(true);
            
            // Close after delay
            setTimeout(() => {
                handleClose();
            }, 1500);
        } catch (error) {
            console.error('Error creating maintenance:', error);
        }
    };

    // Helper functions cho checklist
    const handleChecklistChange = (id, checked) => {
        setMaintenanceChecklist(prev => 
            prev.map(item => 
                item.id === id ? { ...item, completed: checked } : item
            )
        );
    };

    const addChecklistItem = () => {
        const newId = Math.max(...maintenanceChecklist.map(item => item.id)) + 1;
        setMaintenanceChecklist(prev => [...prev, {
            id: newId,
            task: '',
            completed: false,
            required: false
        }]);
    };

    const updateChecklistItem = (id, task) => {
        setMaintenanceChecklist(prev =>
            prev.map(item =>
                item.id === id ? { ...item, task } : item
            )
        );
    };

    const removeChecklistItem = (id) => {
        setMaintenanceChecklist(prev => prev.filter(item => item.id !== id));
    };

    // Helper functions cho work tasks  
    const addWorkTask = () => {
        const newId = Date.now();
        setWorkTasks(prev => [...prev, {
            id: newId,
            task_name: '',
            description: '',
            assigned_to: '',
            estimated_hours: '',
            priority: 'medium',
            status: 'pending'
        }]);
    };

    const updateWorkTask = (id, field, value) => {
        setWorkTasks(prev =>
            prev.map(task =>
                task.id === id ? { ...task, [field]: value } : task
            )
        );
    };

    const removeWorkTask = (id) => {
        setWorkTasks(prev => prev.filter(task => task.id !== id));
    };

    const maintenanceTypes = [
        { value: 'preventive', label: 'Bảo trì phòng ngừa' },
        { value: 'corrective', label: 'Bảo trì sửa chữa' }
    ];

    const priorities = [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Khẩn cấp' }
    ];

    return (
        <Box sx={{ width: "100%", height: "95vh", display: 'flex', flexDirection: 'column', backgroundColor: '#f0f7ff' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                backgroundColor: theme.palette.primary.main
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    color: '#fff'
                }}>
                    TẠO LỊCH BẢO TRÌ MỚI
                </Typography>

                <IconButton onClick={handleClose} sx={{ color: '#fff', p: 0.5 }}>
                    <CloseIcon sx={{ fontSize: "1.8rem" }} />
                </IconButton>
            </Box>

            {/* Form Content */}
            <Stack sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Nhập thông tin cơ bản */}
                <Box sx={{ p: 3, borderRadius: 1, backgroundColor: '#fff', border: '2px solid #e0e0e0' }}>
                    <Grid2 container spacing={2}>
                        {/* Hàng 1: Mã bảo trì và Tiêu đề */}
                        <Grid2 xs={12} md={2}>
                            <InputField
                                label="Mã bảo trì"
                                name="maintenance_code"
                                value={formData.maintenance_code}
                                onChange={handleInputChange2}
                                required
                                disabled
                                placeholder="Tự động tạo"
                            />
                        </Grid2>

                        <Grid2 xs={12} md={10}>
                            <InputField
                                label="Tiêu đề bảo trì"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange2}
                                placeholder="Nhập tiêu đề chi tiết (VD: Bảo trì định kỳ máy X-ray phòng A12)"
                                required
                                error={!!formErrors.title}
                                helperText={formErrors.title}
                            />
                        </Grid2>

                        {/* Hàng 2: Thiết bị và phân loại */}
                        <Grid2 xs={12} md={5}>
                            <SelectField
                                label="Thiết bị cần bảo trì"
                                name="asset_id"
                                value={formData.asset_id}
                                onChange={handleInputChange2}
                                options={assets}
                                required
                                placeholder="Chọn thiết bị từ danh sách"
                                valueKey="id"
                                labelKey="name"
                                error={!!formErrors.asset_id}
                                helperText={formErrors.asset_id}
                            />
                        </Grid2>

                        <Grid2 xs={12} md={3}>
                            <SelectField
                                label="Loại bảo trì"
                                name="maintenance_type"
                                value={formData.maintenance_type}
                                onChange={handleInputChange2}
                                options={maintenanceTypes}
                                required
                                placeholder="Chọn loại"
                                valueKey="value"
                                labelKey="label"
                            />
                        </Grid2>

                        <Grid2 xs={12} md={2}>
                            <SelectField
                                label="Mức ưu tiên"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange2}
                                options={priorities}
                                required
                                placeholder="Chọn ưu tiên"
                                valueKey="value"
                                labelKey="label"
                            />
                        </Grid2>

                        <Grid2 xs={12} md={2}>
                            <SelectField
                                label="Kỹ thuật viên phụ trách"
                                name="technician_id"
                                value={formData.technician_id}
                                onChange={handleInputChange2}
                                options={users}
                                placeholder="Chọn kỹ thuật viên"
                                valueKey="id"
                                labelKey="name"
                            />
                        </Grid2>

                        {/* Hàng 3: Thời gian và chi phí */}
                        <Grid2 xs={12} md={3}>
                            <InputDate
                                label="Ngày thực hiện"
                                name="scheduled_date"
                                value={formData.scheduled_date}
                                onChange={handleInputChange2}
                                required
                                error={!!formErrors.scheduled_date}
                                helperText={formErrors.scheduled_date}
                            />
                        </Grid2>

                        <Grid2 xs={12} md={3}>
                            <InputNumber
                                label="Thời gian dự tính (giờ)"
                                name="estimated_duration"
                                value={formData.estimated_duration}
                                onChange={handleInputChange2}
                                required
                                error={!!formErrors.estimated_duration}
                                helperText={formErrors.estimated_duration}
                            />
                        </Grid2>

                        <Grid2 xs={12} md={4}>
                            <InputNumber
                                label="Chi phí ước tính (VNĐ)"
                                name="cost"
                                value={formData.cost}
                                onChange={handleInputChange2}
                                placeholder="Nhập chi phí dự tính"
                            />
                        </Grid2>

                        {/* Hàng 4: Vị trí */}
                        <Grid2 xs={12}>
                            <InputField
                                label="Vị trí thực hiện bảo trì"
                                name="location"
                                value={formData.location}
                                onChange={handleInputChange2}
                                placeholder="Nhập chi tiết vị trí (VD: Phòng X-quang tầng 2, Khoa Chẩn đoán hình ảnh)"
                            />
                        </Grid2>
                    </Grid2>
                </Box>

                <Divider sx={{ borderColor: theme.palette.grey[900] }} />

                {/* Thông tin chi tiết */}
                <Box sx={{ flex: 1, display: 'flex', backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ m: 2, border: '1px solid #aaa', display: 'flex', flexDirection: 'column', borderRadius: 1, flex: 1, backgroundColor: '#fff' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#e4eefdff' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                                <Tab label="Công cụ dụng cụ" {...a11yProps(0)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                                <Tab label="Vật tư thay thế" {...a11yProps(1)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                                <Tab label="Checklist bảo trì" {...a11yProps(2)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                                <Tab label="Danh sách công việc" {...a11yProps(3)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                                <Tab label="Ghi chú & Tài liệu" {...a11yProps(4)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                            </Tabs>
                        </Box>

                        <CustomTabPanel value={tabValue} index={0}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1976d2' }}>
                                    🔧 Công cụ và Dụng cụ cần thiết
                                </Typography>
                            </Box>
                            
                            <Grid2 container spacing={3}>
                                <Grid2 xs={12}>
                                    <InputField
                                        label="Danh sách công cụ dụng cụ"
                                        name="tools_required"
                                        value={formData.tools_required}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={6}
                                        placeholder="Liệt kê chi tiết các công cụ, dụng cụ cần thiết:&#10;- Bộ tua vít đa năng&#10;- Đồng hồ đo điện áp&#10;- Khăn lau chuyên dụng&#10;- Kính bảo hộ&#10;- Găng tay cách điện..."
                                        fullWidth
                                    />
                                </Grid2>
                                
                                <Grid2 xs={12} md={6}>
                                    <InputField
                                        label="Thiết bị đo lường"
                                        name="measuring_tools"
                                        value={formData.measuring_tools || ''}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={4}
                                        placeholder="Các thiết bị đo lường cần sử dụng:&#10;- Đồng hồ vạn năng&#10;- Thước kẹp&#10;- Máy đo độ rung..."
                                        fullWidth
                                    />
                                </Grid2>
                                
                                <Grid2 xs={12} md={6}>
                                    <InputField
                                        label="Dụng cụ an toàn"
                                        name="safety_tools"
                                        value={formData.safety_tools || ''}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={4}
                                        placeholder="Thiết bị bảo hộ lao động:&#10;- Mũ bảo hiểm&#10;- Giày an toàn&#10;- Áo phản quang..."
                                        fullWidth
                                    />
                                </Grid2>
                            </Grid2>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={1}>
                            <Box sx={{ mb: 3 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#ff9800' }}>
                                    📦 Vật tư và Phụ tùng thay thế
                                </Typography>
                            </Box>
                            
                            <Grid2 container spacing={3}>
                                <Grid2 xs={12}>
                                    <InputField
                                        label="Danh sách vật tư cần thay"
                                        name="spare_parts"
                                        value={formData.spare_parts}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={6}
                                        placeholder="Liệt kê chi tiết các vật tư, phụ tùng cần thay thế:&#10;- Vòng bi SKF 6205 (2 cái)&#10;- Dây đai A-35 (1 sợi)&#10;- Dầu bôi trơn Shell 68 (1 lít)&#10;- Ốc vít M6x20 (10 cái)&#10;- Gioăng cao su NBR (1 bộ)..."
                                        fullWidth
                                    />
                                </Grid2>
                                
                                <Grid2 xs={12} md={6}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                            🧪 Vật tư tiêu hao cần thiết
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={addConsumable}
                                            sx={{ minWidth: 120 }}
                                        >
                                            Thêm vật tư
                                        </Button>
                                    </Box>

                                    <Box sx={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        {formData.consumables.length === 0 ? (
                                            <Box sx={{ p: 3, textAlign: 'center', color: '#666' }}>
                                                <Typography variant="body2">
                                                    Chưa có vật tư tiêu hao nào được thêm
                                                </Typography>
                                            </Box>
                                        ) : (
                                            formData.consumables.map((consumable, index) => (
                                                <Card key={index} sx={{ mb: 1, mx: 1, mt: 1 }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Grid2 container spacing={2} alignItems="center">
                                                            <Grid2 xs={12} md={4}>
                                                                <SelectField
                                                                    label="Tên vật tư"
                                                                    value={consumable.consumable_category_id}
                                                                    onChange={(value) => updateConsumable(index, 'consumable_category_id', value)}
                                                                    options={consumableCategories.map(cat => ({
                                                                        id: cat.id,
                                                                        name: cat.name
                                                                    }))}
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={2}>
                                                                <InputNumber
                                                                    label="Số lượng"
                                                                    value={consumable.quantity_required}
                                                                    onChange={(value) => updateConsumable(index, 'quantity_required', value)}
                                                                    min={0.1}
                                                                    step={0.1}
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={2}>
                                                                <InputNumber
                                                                    label="Đơn giá"
                                                                    value={consumable.unit_cost}
                                                                    onChange={(value) => updateConsumable(index, 'unit_cost', value)}
                                                                    min={0}
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={2}>
                                                                <InputNumber
                                                                    label="Thành tiền"
                                                                    value={consumable.total_cost}
                                                                    onChange={(value) => updateConsumable(index, 'total_cost', value)}
                                                                    min={0}
                                                                    fullWidth
                                                                    size="small"
                                                                    disabled
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={1}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => removeConsumable(index)}
                                                                    sx={{ color: '#f44336', mt: 1 }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Grid2>
                                                            <Grid2 xs={12}>
                                                                <InputField
                                                                    label="Ghi chú"
                                                                    value={consumable.notes}
                                                                    onChange={(value) => updateConsumable(index, 'notes', value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    placeholder="Ghi chú về vật tư này..."
                                                                />
                                                            </Grid2>
                                                        </Grid2>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </Box>
                                </Grid2>
                                
                                <Grid2 xs={12} md={6}>
                                    <InputField
                                        label="Chi phí dự tính"
                                        name="estimated_cost"
                                        value={formData.estimated_cost || ''}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={4}
                                        placeholder="Ước tính chi phí vật tư:&#10;- Vật tư chính: 2,000,000 VNĐ&#10;- Vật tư tiêu hao: 300,000 VNĐ&#10;- Tổng cộng: 2,300,000 VNĐ"
                                        fullWidth
                                    />
                                </Grid2>
                            </Grid2>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={2}>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Danh sách kiểm tra bảo trì
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={addChecklistItem}
                                    sx={{ minWidth: 150 }}
                                >
                                    Thêm mục kiểm tra
                                </Button>
                            </Box>

                            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                {maintenanceChecklist.map((item, index) => (
                                    <Card key={item.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                        <CardContent sx={{ p: 2 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={item.completed}
                                                            onChange={(e) => handleChecklistChange(item.id, e.target.checked)}
                                                            icon={<CheckCircleIcon sx={{ color: '#ccc' }} />}
                                                            checkedIcon={<CheckCircleIcon sx={{ color: '#4caf50' }} />}
                                                        />
                                                    }
                                                    label=""
                                                />
                                                <TextField
                                                    fullWidth
                                                    size="small"
                                                    value={item.task}
                                                    onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                                                    placeholder="Nhập nội dung kiểm tra..."
                                                    variant="outlined"
                                                    sx={{ mr: 1 }}
                                                />
                                                {item.required && (
                                                    <Typography variant="caption" sx={{ color: '#f44336', minWidth: 60 }}>
                                                        *Bắt buộc
                                                    </Typography>
                                                )}
                                                <IconButton
                                                    size="small"
                                                    onClick={() => removeChecklistItem(item.id)}
                                                    sx={{ color: '#f44336' }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Box>

                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={3}>
                            {/* Danh sách công việc */}
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Danh sách công việc chi tiết
                                </Typography>
                                <Button
                                    variant="outlined"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    onClick={addWorkTask}
                                    sx={{ minWidth: 150 }}
                                >
                                    Thêm công việc
                                </Button>
                            </Box>

                            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                {workTasks.map((task, index) => (
                                    <Card key={task.id} sx={{ mb: 2, border: '1px solid #e0e0e0' }}>
                                        <CardContent sx={{ p: 2 }}>
                                            <Grid2 container spacing={2} alignItems="center">
                                                <Grid2 xs={12} md={5}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        label="Tên công việc"
                                                        value={task.task_name}
                                                        onChange={(e) => updateWorkTask(task.id, 'task_name', e.target.value)}
                                                        placeholder="Nhập tên công việc cần thực hiện..."
                                                    />
                                                </Grid2>
                                                <Grid2 xs={12} md={3}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        select
                                                        label="Người thực hiện"
                                                        value={task.assigned_to || ''}
                                                        onChange={(e) => updateWorkTask(task.id, 'assigned_to', e.target.value)}
                                                    >
                                                        <MenuItem value="">
                                                            <em>Chọn nhân viên</em>
                                                        </MenuItem>
                                                        {users.map((user) => (
                                                            <MenuItem key={user.id} value={user.id}>
                                                                {user.name}
                                                            </MenuItem>
                                                        ))}
                                                    </TextField>
                                                </Grid2>
                                                <Grid2 xs={12} md={2}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        label="Giờ ước tính"
                                                        value={task.estimated_hours}
                                                        onChange={(e) => updateWorkTask(task.id, 'estimated_hours', e.target.value)}
                                                        placeholder="2"
                                                    />
                                                </Grid2>
                                                <Grid2 xs={12} md={1}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        select
                                                        label="Trạng thái"
                                                        value={task.status || 'pending'}
                                                        onChange={(e) => updateWorkTask(task.id, 'status', e.target.value)}
                                                    >
                                                        <MenuItem value="pending">Chờ thực hiện</MenuItem>
                                                        <MenuItem value="in_progress">Đang thực hiện</MenuItem>
                                                        <MenuItem value="completed">Hoàn thành</MenuItem>
                                                    </TextField>
                                                </Grid2>
                                                <Grid2 xs={12} md={1}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeWorkTask(task.id)}
                                                        sx={{ color: '#f44336', mt: 1 }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Grid2>
                                                <Grid2 xs={12}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        multiline
                                                        rows={2}
                                                        label="Mô tả công việc"
                                                        value={task.description}
                                                        onChange={(e) => updateWorkTask(task.id, 'description', e.target.value)}
                                                        placeholder="Mô tả chi tiết công việc cần thực hiện..."
                                                    />
                                                </Grid2>
                                            </Grid2>
                                        </CardContent>
                                    </Card>
                                ))}

                                {workTasks.length === 0 && (
                                    <Box sx={{ textAlign: 'center', py: 4, color: '#666' }}>
                                        <Typography variant="body1">
                                            Chưa có công việc nào. Nhấn "Thêm công việc" để bắt đầu.
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={4}>
                            <Grid2 container spacing={3}>
                                {/* Notes Section */}
                                <Grid2 xs={12} md={6}>
                                    <Box sx={{ 
                                        p: 2, 
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        backgroundColor: '#fafafa'
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            mb: 2, 
                                            fontWeight: 'bold',
                                            color: theme.palette.primary.main
                                        }}>
                                            📝 Ghi chú bảo trì
                                        </Typography>
                                        <InputField
                                            label="Ghi chú bổ sung"
                                            name="notes"
                                            value={formData.notes}
                                            onChange={handleInputChange2}
                                            multiline
                                            rows={8}
                                            placeholder="Ghi chú bổ sung về quá trình bảo trì:&#10;- Tình trạng thiết bị trước bảo trì&#10;- Các vấn đề phát hiện&#10;- Khuyến nghị cho lần bảo trì tiếp theo&#10;- Lưu ý đặc biệt..."
                                            minLabelWidth='120px'
                                            fullWidth
                                        />
                                    </Box>
                                </Grid2>

                                {/* Documents Section */}
                                <Grid2 xs={12} md={6}>
                                    <Box sx={{ 
                                        p: 2, 
                                        border: '1px solid #e0e0e0',
                                        borderRadius: 1,
                                        backgroundColor: '#fafafa'
                                    }}>
                                        <Typography variant="h6" sx={{ 
                                            mb: 2, 
                                            fontWeight: 'bold',
                                            color: theme.palette.primary.main
                                        }}>
                                            📎 Tài liệu đính kèm
                                        </Typography>

                                        <Box sx={{ 
                                            display: 'flex', 
                                            justifyContent: 'space-between', 
                                            alignItems: 'center',
                                            mb: 2 
                                        }}>
                                            <Typography variant="body2" sx={{ color: '#666' }}>
                                                Đính kèm hình ảnh, tài liệu liên quan đến bảo trì
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                component="label"
                                                startIcon={<AttachFileIcon />}
                                                size="small"
                                            >
                                                Chọn tài liệu
                                                <input
                                                    type="file"
                                                    hidden
                                                    multiple
                                                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
                                                    onChange={handleFilesSelect}
                                                />
                                            </Button>
                                        </Box>

                                        {/* Files List */}
                                        {attachedFiles.length > 0 && (
                                            <Box sx={{ 
                                                border: '1px solid #ddd',
                                                borderRadius: 1,
                                                backgroundColor: '#fff',
                                                maxHeight: 300,
                                                overflowY: 'auto'
                                            }}>
                                                <Typography variant="subtitle2" sx={{ p: 1.5, borderBottom: '1px solid #ddd', bgcolor: '#f5f5f5' }}>
                                                    Tài liệu đã chọn ({attachedFiles.length})
                                                </Typography>
                                                <List dense>
                                                    {attachedFiles.map((file) => (
                                                        <ListItem key={file.id} divider>
                                                            <ListItemIcon>
                                                                <DescriptionIcon color="primary" />
                                                            </ListItemIcon>
                                                            <ListItemText
                                                                primary={file.name}
                                                                secondary={
                                                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                                                        <Chip 
                                                                            label={formatFileSize(file.size)} 
                                                                            size="small" 
                                                                            variant="outlined"
                                                                        />
                                                                        <Chip 
                                                                            label={file.type.split('/')[1]?.toUpperCase() || 'FILE'} 
                                                                            size="small" 
                                                                            color="primary"
                                                                            variant="outlined"
                                                                        />
                                                                    </Box>
                                                                }
                                                            />
                                                            <IconButton
                                                                edge="end"
                                                                onClick={() => handleRemoveFile(file.id)}
                                                                size="small"
                                                                sx={{ color: '#f44336' }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            </Box>
                                        )}

                                        {attachedFiles.length === 0 && (
                                            <Box sx={{ 
                                                textAlign: 'center', 
                                                py: 4, 
                                                color: '#666',
                                                border: '2px dashed #ddd',
                                                borderRadius: 1,
                                                bgcolor: '#fff'
                                            }}>
                                                <Typography variant="body2">
                                                    Chưa có tài liệu nào được đính kèm
                                                </Typography>
                                                <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
                                                    Hỗ trợ: PDF, DOC, DOCX, JPG, PNG, GIF (tối đa 10MB)
                                                </Typography>
                                            </Box>
                                        )}
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </CustomTabPanel>
                    </Box>
                </Box>
            </Stack>

            {/* Action Buttons */}
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                backgroundColor: '#fafafa'
            }}>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        fontSize: '1.2rem',
                        minWidth: 120,
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': {
                            backgroundColor: '#ffebee',
                            borderColor: '#f44336'
                        }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    startIcon={<SaveIcon />}
                    disabled={loading}
                    sx={{
                        fontSize: '1.2rem',
                        minWidth: 120,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#1565c0'
                        }
                    }}
                >
                    {loading ? 'Đang tạo...' : 'Tạo mới'}
                </Button>
            </Box>

            {/* Success Snackbar */}
            <Snackbar
                open={showSuccess}
                autoHideDuration={3000}
                onClose={() => setShowSuccess(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert 
                    onClose={() => setShowSuccess(false)} 
                    severity="success" 
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default AddMaintenanceForm;