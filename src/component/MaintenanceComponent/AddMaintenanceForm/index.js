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
    FormGroup,
    TextField,
    Card,
    CardContent,
    MenuItem,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    Autocomplete,
    Tooltip,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
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
import { getAssetConsumables, getAssetByDkCode } from '../../../services/assetsService';
import { getMechanicalElectricalTechniciansService } from '../../../services/usersService';
import checklistStandardService from '../../../services/checklistStandardService';
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

function AddMaintenanceForm({ handleClose, onReload }) {
    const theme = useTheme();
    const dispatch = useDispatch();
    const assets = useSelector((state) => state.assets.assets);
    const users = useSelector((state) => state.users.users);
    const loading = useSelector((state) => state.maintenance.loading);

    const [formData, setFormData] = useState({
        maintenance_code: '',
        asset_id: '',
        maintenance_type: 'cleaning',
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
        spare_parts: [], // Changed to array
        consumables: [], // Changed from string to array
        notes: ''
    });

    // State cho danh mục vật tư tiêu hao
    const [consumableCategories, setConsumableCategories] = useState([]);
    // State cho vật tư tiêu hao của thiết bị đang chọn
    const [assetConsumables, setAssetConsumables] = useState([]);
    // State tiêu chuẩn checklist
    const [checklistStandards, setChecklistStandards] = useState([]);
    const [openStandardDialog, setOpenStandardDialog] = useState(false);
    const [selectedStandards, setSelectedStandards] = useState([]);
    const [selectedStandardId, setSelectedStandardId] = useState('');
    const [selectedAssetInfo, setSelectedAssetInfo] = useState(null);

    // State cho checklist bảo trì
    const [maintenanceChecklist, setMaintenanceChecklist] = useState([
        { 
            id: 1, 
            task: 'Kiểm tra nguồn điện',
            check_item: 'Điện áp đầu vào', 
            standard_value: '220V ±10%',
            check_method: 'Dùng đồng hồ vạn năng đo điện áp',
            required: true 
        },
        { 
            id: 2, 
            task: 'Kiểm tra nhiệt độ',
            check_item: 'Nhiệt độ vận hành', 
            standard_value: '20-25°C',
            check_method: 'Dùng nhiệt kế đo',
            required: true 
        },
        { 
            id: 3, 
            task: 'Kiểm tra độ rung',
            check_item: 'Độ rung thiết bị', 
            standard_value: '<2mm/s',
            check_method: 'Dùng máy đo độ rung',
            required: true 
        }
    ]);

    // State cho danh sách công việc
    const [workTasks, setWorkTasks] = useState([]);
    
    // State cho 3 hạng mục công việc mặc định
    const [defaultTasks, setDefaultTasks] = useState({
        cleaning: { checked: false, assignedTo: [] },
        inspection: { checked: false, assignedTo: [] },
        maintenance: { checked: false, assignedTo: [] },
        corrective: { checked: false, assignedTo: [] }
    });
    
    // State cho danh sách nhân viên xưởng cơ điện
    const [mechanicalStaff, setMechanicalStaff] = useState([]);

    const [formErrors, setFormErrors] = useState({});
    const [tabValue, setTabValue] = useState(0);
    const [showSuccess, setShowSuccess] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    // State cho tài liệu đính kèm
    const [attachedFiles, setAttachedFiles] = useState([]);
    const [dkLookup, setDkLookup] = useState('');
    const [dkLookupError, setDkLookupError] = useState(null);
    const [dkLookupLoading, setDkLookupLoading] = useState(false);

    useEffect(() => {
        // Fetch assets if not already loaded
        if (!assets || assets.length === 0) {
            dispatch(fetchAssets());
        }

        // Fetch users if not already loaded
        if (!users || users.length === 0) {
            dispatch(fetchUsers());
        }
        
        // Load mechanical electrical staff
        const loadMechanicalStaff = async () => {
            try {
                console.log('🔄 Loading mechanical electrical staff...');
                const staff = await getMechanicalElectricalTechniciansService();
                console.log('Loaded staff:', staff);
                setMechanicalStaff(staff || []);
            } catch (error) {
                console.error('Error loading mechanical staff:', error);
            }
        };
        loadMechanicalStaff();

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

        // Load checklist standards
        const loadStandards = async () => {
            try {
                const data = await checklistStandardService.list();
                setChecklistStandards(data || []);
            } catch (error) {
                console.error('Error loading checklist standards:', error);
            }
        };
        loadStandards();
    }, [dispatch, assets, users]);

    // Debounced dk_code lookup (optional, does not override selection on error)
    useEffect(() => {
        const trimmed = dkLookup.trim().toUpperCase();
        if (!trimmed) {
            setDkLookupError(null);
            setDkLookupLoading(false);
            return;
        }
        const timer = setTimeout(async () => {
            setDkLookupLoading(true);
            setDkLookupError(null);
            try {
                const asset = await getAssetByDkCode(trimmed);
                if (asset) {
                    setSelectedAssetInfo(asset);
                    setFormData((prev) => ({ ...prev, asset_id: asset.id }));
                }
            } catch (error) {
                const status = error?.response?.status;
                if (status === 401 || status === 403) {
                    setDkLookupError('Bạn không có quyền tra cứu DK');
                } else if (status === 404) {
                    setDkLookupError('Không tìm thấy thiết bị với Mã DK này');
                } else {
                    setDkLookupError('Lỗi tra cứu DK, thử lại sau');
                }
            } finally {
                setDkLookupLoading(false);
            }
        }, 400);

        return () => clearTimeout(timer);
    }, [dkLookup]);

    useEffect(() => {
        if (formData.asset_id && assets && assets.length > 0) {
            const asset = assets.find((a) => a.id === formData.asset_id);
            setSelectedAssetInfo(asset || null);
        } else {
            setSelectedAssetInfo(null);
        }
    }, [formData.asset_id, assets]);

    // Khi chọn thiết bị (theo Mã DK), tự động nạp thông tin hiển thị readonly
    useEffect(() => {
        if (formData.asset_id && assets && assets.length > 0) {
            const asset = assets.find((a) => a.id === formData.asset_id);
            setSelectedAssetInfo(asset || null);
        } else {
            setSelectedAssetInfo(null);
        }
    }, [formData.asset_id, assets]);

    // Auto-check default task khi chọn loại bảo trì
    useEffect(() => {
        if (formData.maintenance_type) {
            setDefaultTasks(prev => ({
                cleaning: {
                    ...prev.cleaning,
                    checked: formData.maintenance_type === 'cleaning'
                },
                inspection: {
                    ...prev.inspection,
                    checked: formData.maintenance_type === 'inspection'
                },
                maintenance: {
                    ...prev.maintenance,
                    checked: formData.maintenance_type === 'maintenance'
                },
                corrective: {
                    ...prev.corrective,
                    checked: formData.maintenance_type === 'corrective'
                }
            }));
        }
    }, [formData.maintenance_type]);

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

    const handleInputChange2 = async (field, value) => {
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

        // Khi chọn thiết bị, tự động load vật tư tiêu hao của thiết bị đó
        if (field === 'asset_id' && value) {
            try {
                const assetConsumablesData = await getAssetConsumables(value);
                console.log('🔧 Asset consumables loaded:', assetConsumablesData);
                
                // Lưu vào state để dùng cho dropdown
                setAssetConsumables(assetConsumablesData || []);
                
                // Reset consumables array
                setFormData(prev => ({
                    ...prev,
                    consumables: []
                }));
            } catch (error) {
                console.error('Error loading asset consumables:', error);
                setAssetConsumables([]);
            }
        }
    };

    // Handle consumables array
    const addConsumable = () => {
        setFormData(prev => ({
            ...prev,
            consumables: [
                ...prev.consumables,
                {
                    asset_consumable_id: '', // ID từ asset_consumables
                    item_name: '',
                    specification: '',
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
            consumables: prev.consumables.map((item, i) => {
                if (i !== index) return item;

                // Nếu chọn vật tư từ asset, tự động điền thông tin
                if (field === 'asset_consumable_id') {
                    const selectedConsumable = assetConsumables.find(ac => ac.id === value);
                    if (selectedConsumable) {
                        return {
                            ...item,
                            asset_consumable_id: value,
                            item_name: selectedConsumable.item_name,
                            specification: selectedConsumable.specification,
                            unit_cost: selectedConsumable.unit_price || 0,
                            total_cost: (item.quantity_required || 1) * (selectedConsumable.unit_price || 0),
                            notes: selectedConsumable.remarks || ''
                        };
                    }
                }

                // Auto calculate total_cost
                const newItem = {
                    ...item,
                    [field]: value
                };

                if (field === 'quantity_required' || field === 'unit_cost') {
                    newItem.total_cost = (field === 'quantity_required' ? value : item.quantity_required || 0) *
                                        (field === 'unit_cost' ? value : item.unit_cost || 0);
                }

                return newItem;
            })
        }));
    };

    const removeConsumable = (index) => {
        setFormData(prev => ({
            ...prev,
            consumables: prev.consumables.filter((_, i) => i !== index)
        }));
    };

    // Handle spare parts array (phụ tùng thay thế)
    const addSparePart = () => {
        setFormData(prev => ({
            ...prev,
            spare_parts: [
                ...prev.spare_parts,
                {
                    part_name: '',
                    specification: '',
                    quantity: 1,
                    unit_price: '',
                    total_price: '',
                    notes: ''
                }
            ]
        }));
    };

    const updateSparePart = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            spare_parts: prev.spare_parts.map((item, i) => {
                if (i !== index) return item;
                
                const newItem = { ...item, [field]: value };
                
                // Auto calculate total_price if quantity or unit_price changes
                if (field === 'quantity' || field === 'unit_price') {
                    newItem.total_price = (field === 'quantity' ? value : item.quantity || 0) *
                                         (field === 'unit_price' ? value : item.unit_price || 0);
                }

                return newItem;
            })
        }));
    };

    const removeSparePart = (index) => {
        setFormData(prev => ({
            ...prev,
            spare_parts: prev.spare_parts.filter((_, i) => i !== index)
        }));
    };

    // Calculate estimated_cost automatically
    const calculateEstimatedCost = () => {
        const consumablesTotal = formData.consumables.reduce((sum, item) => {
            return sum + (parseFloat(item.total_cost) || 0);
        }, 0);

        const sparePartsTotal = formData.spare_parts.reduce((sum, item) => {
            return sum + (parseFloat(item.total_price) || 0);
        }, 0);

        return consumablesTotal + sparePartsTotal;
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
            const estimatedCost = calculateEstimatedCost();
            
            const submitData = {
                ...formData,
                scheduled_date: new Date(formData.scheduled_date).toISOString(),
                estimated_duration: parseInt(formData.estimated_duration),
                estimated_cost: estimatedCost > 0 ? estimatedCost : null,
                status: 'pending',
                // Convert spare_parts array to JSON string for storage
                spare_parts: JSON.stringify(formData.spare_parts),
                // Filter valid consumables and add default consumable_category_id if using asset_consumable
                consumables: formData.consumables
                    .filter(c => c.asset_consumable_id || (c.consumable_category_id && c.consumable_category_id !== ''))
                    .map(c => ({
                        ...c,
                        // Nếu có asset_consumable_id thì set consumable_category_id = null, ngược lại giữ nguyên (hoặc null nếu empty)
                        consumable_category_id: c.asset_consumable_id 
                            ? null 
                            : (c.consumable_category_id && c.consumable_category_id !== '' ? c.consumable_category_id : null)
                    })),
                // Add checklist data
                checklist: maintenanceChecklist.map((item, index) => ({
                    task_name: item.task,
                    check_item: item.check_item || null,
                    standard_value: item.standard_value || null,
                    check_method: item.check_method || null,
                    description: item.description || null,
                    order_index: index,
                    notes: item.required ? 'Bắt buộc' : 'Không bắt buộc'
                })),
                // Add work tasks data
                workTasks: [
                    // 3 hạng mục mặc định
                    ...(defaultTasks.cleaning.checked ? [{
                        task_name: 'Vệ sinh',
                        task_type: 'cleaning',
                        description: 'Vệ sinh thiết bị',
                        assigned_to: defaultTasks.cleaning.assignedTo,
                        status: 'pending',
                        order_index: 0
                    }] : []),
                    ...(defaultTasks.inspection.checked ? [{
                        task_name: 'Kiểm tra',
                        task_type: 'inspection',
                        description: 'Kiểm tra tình trạng thiết bị',
                        assigned_to: defaultTasks.inspection.assignedTo,
                        status: 'pending',
                        order_index: 1
                    }] : []),
                    ...(defaultTasks.maintenance.checked ? [{
                        task_name: 'Bảo trì',
                        task_type: 'maintenance',
                        description: 'Bảo trì thiết bị',
                        assigned_to: defaultTasks.maintenance.assignedTo,
                        status: 'pending',
                        order_index: 2
                    }] : []),
                    // Công việc tùy chỉnh
                    ...workTasks.map((task, index) => ({
                        task_name: task.task_name,
                        task_type: 'custom',
                        description: task.description || null,
                        assigned_to: task.assigned_to || [],
                        estimated_hours: task.estimated_hours || null,
                        status: 'pending',
                        priority: task.priority || 'medium',
                        order_index: 3 + index
                    }))
                ]
                // Tạm thời không gửi attachedFiles
            };

            console.log('Submit data:', submitData); // Debug log
            console.log('Form data before submit:', formData); // Debug log

            await dispatch(createMaintenanceRecord(submitData)).unwrap();
            setSuccessMessage('Tạo lịch bảo trì thành công!');
            setShowSuccess(true);
            
            // Reload list
            if (onReload) {
                onReload();
            }
            
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
            check_item: '',
            standard_value: '',
            check_method: '',
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
            assigned_to: [], // Array để chọn nhiều người
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
        { value: 'cleaning', label: 'Vệ sinh' },
        { value: 'inspection', label: 'Kiểm tra' },
        { value: 'maintenance', label: 'Bảo trì' },
        { value: 'corrective', label: 'Sửa chữa' }
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
                                disabled
                                placeholder="Tự động tạo khi lưu"
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
                                label="Thiết bị cần bảo trì (chọn theo Mã DK)"
                                name="asset_id"
                                value={formData.asset_id}
                                onChange={handleInputChange2}
                                options={assets.map((a) => ({
                                    ...a,
                                    displayLabel: `${a.dk_code || a.asset_code || 'N/A'} - ${a.name}`,
                                    displayValue: a.id
                                }))}
                                required
                                placeholder="Nhập Mã DK hoặc tên để tìm"
                                valueKey="displayValue"
                                labelKey="displayLabel"
                                error={!!formErrors.asset_id}
                                helperText={formErrors.asset_id}
                            />
                        </Grid2>
                        <Grid2 xs={12} md={3}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Tra cứu nhanh Mã DK"
                                value={dkLookup}
                                onChange={(e) => setDkLookup(e.target.value)}
                                helperText={dkLookupError || (dkLookupLoading ? 'Đang tra cứu...' : 'Nhập Mã DK để tự động chọn thiết bị')}
                                error={!!dkLookupError}
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

                        {selectedAssetInfo && (
                            <Grid2 xs={12}>
                                <Box sx={{ mt: 1, p: 2, border: '1px dashed #ccc', borderRadius: 1, backgroundColor: '#fafafa' }}>
                                    <Typography variant="subtitle2" sx={{ mb: 1.5, fontSize: '1.4rem', fontWeight: 'bold' }}>
                                        Thông tin thiết bị (readonly)
                                    </Typography>
                                    <Grid2 container spacing={2}>
                                        <Grid2 xs={12} md={2}>
                                            <InputField
                                                label="Mã DK"
                                                name="dk_code"
                                                value={selectedAssetInfo.dk_code || '—'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                        <Grid2 xs={12} md={2}>
                                            <InputField
                                                label="Mã thiết bị hệ thống"
                                                name="asset_code"
                                                value={selectedAssetInfo.asset_code || '—'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                        <Grid2 xs={12} md={3}>
                                            <InputField
                                                label="Tên thiết bị"
                                                name="asset_name"
                                                value={selectedAssetInfo.name || '—'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                        <Grid2 xs={12} md={3}>
                                            <InputField
                                                label="Khu vực / vị trí"
                                                name="area"
                                                value={selectedAssetInfo.Area?.name || selectedAssetInfo.area || '—'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                        <Grid2 xs={12} md={2}>
                                            <InputField
                                                label="Bộ phận / line"
                                                name="department"
                                                value={selectedAssetInfo.Department?.name || selectedAssetInfo.team_id || '—'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                        <Grid2 xs={12} md={2}>
                                            <InputField
                                                label="Loại thiết bị"
                                                name="sub_category"
                                                value={selectedAssetInfo.SubCategory?.name || '—'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                        <Grid2 xs={12} md={2}>
                                            <InputField
                                                label="Chu kỳ bảo trì mặc định"
                                                name="maintenance_cycle"
                                                value={selectedAssetInfo.maintenance_cycle || 'Không có'}
                                                onChange={() => {}}
                                                disabled
                                            />
                                        </Grid2>
                                    </Grid2>
                                </Box>
                            </Grid2>
                        )}

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
                                onChange={(e, value) => handleInputChange2('estimated_duration', value)}
                                required
                                error={!!formErrors.estimated_duration}
                                helperText={formErrors.estimated_duration}
                            />
                        </Grid2>

                        <Grid2 xs={12} md={4}>
                            <InputNumber
                                label="Chi phí ước tính (VNĐ)"
                                name="estimated_cost"
                                value={calculateEstimatedCost()}
                                placeholder="Tự động tính từ vật tư"
                                disabled
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
                                <Tab label="Công cụ dụng cụ" {...a11yProps(0)} sx={{ fontWeight: "bold" }} />
                                <Tab label="Vật tư thay thế" {...a11yProps(1)} sx={{ fontWeight: "bold" }} />
                                <Tab label="Checklist bảo trì" {...a11yProps(2)} sx={{ fontWeight: "bold" }} />
                                <Tab label="Danh sách công việc" {...a11yProps(3)} sx={{ fontWeight: "bold" }} />
                                <Tab label="Ghi chú & Tài liệu" {...a11yProps(4)} sx={{ fontWeight: "bold" }} />
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
                                {/* Phụ tùng thay thế */}
                                <Grid2 xs={12} md={6}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                                            🔩 Phụ tùng thay thế
                                        </Typography>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<AddIcon />}
                                            onClick={addSparePart}
                                            sx={{ minWidth: 120 }}
                                        >
                                            Thêm phụ tùng
                                        </Button>
                                    </Box>

                                    <Box sx={{ maxHeight: 400, overflowY: 'auto', border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                        {formData.spare_parts.length === 0 ? (
                                            <Box sx={{ p: 3, textAlign: 'center', color: '#666' }}>
                                                <Typography variant="body2">
                                                    Chưa có phụ tùng nào được thêm
                                                </Typography>
                                            </Box>
                                        ) : (
                                            formData.spare_parts.map((part, index) => (
                                                <Card key={index} sx={{ mb: 1, mx: 1, mt: 1 }}>
                                                    <CardContent sx={{ p: 2 }}>
                                                        <Grid2 container spacing={2} alignItems="center">
                                                            <Grid2 xs={12} md={6}>
                                                                <InputField
                                                                    label="Tên phụ tùng"
                                                                    name="part_name"
                                                                    value={part.part_name}
                                                                    onChange={(name, value) => updateSparePart(index, 'part_name', value)}
                                                                    placeholder="Vd: Vòng bi SKF 6205"
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={6}>
                                                                <InputField
                                                                    label="Quy cách"
                                                                    name="specification"
                                                                    value={part.specification}
                                                                    onChange={(name, value) => updateSparePart(index, 'specification', value)}
                                                                    placeholder="Vd: 25x52x15mm"
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={3}>
                                                                <InputNumber
                                                                    label="Số lượng"
                                                                    value={part.quantity}
                                                                    onChange={(e, value) => updateSparePart(index, 'quantity', value)}
                                                                    min={1}
                                                                    step={1}
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={3}>
                                                                <InputNumber
                                                                    label="Đơn giá"
                                                                    value={part.unit_price}
                                                                    onChange={(e, value) => updateSparePart(index, 'unit_price', value)}
                                                                    min={0}
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={3}>
                                                                <InputNumber
                                                                    label="Thành tiền"
                                                                    value={part.total_price}
                                                                    min={0}
                                                                    fullWidth
                                                                    size="small"
                                                                    disabled
                                                                />
                                                            </Grid2>
                                                            <Grid2 xs={12} md={2}>
                                                                <IconButton
                                                                    size="small"
                                                                    onClick={() => removeSparePart(index)}
                                                                    sx={{ color: '#f44336', mt: 1 }}
                                                                >
                                                                    <DeleteIcon fontSize="small" />
                                                                </IconButton>
                                                            </Grid2>
                                                            <Grid2 xs={12}>
                                                                <InputField
                                                                    label="Ghi chú"
                                                                    name="notes"
                                                                    value={part.notes}
                                                                    onChange={(name, value) => updateSparePart(index, 'notes', value)}
                                                                    size="small"
                                                                    fullWidth
                                                                    placeholder="Ghi chú về phụ tùng này..."
                                                                />
                                                            </Grid2>
                                                        </Grid2>
                                                    </CardContent>
                                                </Card>
                                            ))
                                        )}
                                    </Box>
                                </Grid2>
                                
                                {/* Vật tư tiêu hao */}
                                <Grid2 xs={12} md={6}>
                                    <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
                                            🧪 Vật tư tiêu hao
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
                                                                    name={`consumable_${index}`}
                                                                    value={consumable.asset_consumable_id}
                                                                    onChange={(field, value) => updateConsumable(index, 'asset_consumable_id', value)}
                                                                    options={assetConsumables}
                                                                    valueKey="id"
                                                                    labelKey="item_name"
                                                                    placeholder={assetConsumables.length > 0 ? "Chọn vật tư của thiết bị" : "Chưa có vật tư (chọn thiết bị trước)"}
                                                                    disabled={assetConsumables.length === 0}
                                                                    fullWidth
                                                                    size="small"
                                                                />
                                                                {consumable.specification && (
                                                                    <Typography variant="caption" sx={{ fontSize: '1rem', color: 'text.secondary', ml: 1 }}>
                                                                        {consumable.specification}
                                                                    </Typography>
                                                                )}
                                                            </Grid2>
                                                            <Grid2 xs={12} md={2}>
                                                                <InputNumber
                                                                    label="Số lượng"
                                                                    value={consumable.quantity_required}
                                                                    onChange={(e, value) => updateConsumable(index, 'quantity_required', value)}
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
                                                                    onChange={(e, value) => updateConsumable(index, 'unit_cost', value)}
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
                                                                    name="notes"
                                                                    value={consumable.notes}
                                                                    onChange={(name, value) => updateConsumable(index, 'notes', value)}
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

                                {/* Hiển thị tổng chi phí ước tính */}
                                <Grid2 xs={12}>
                                    <Box sx={{ p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '1px solid #2196f3' }}>
                                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1565c0' }}>
                                            💰 Tổng chi phí ước tính: {calculateEstimatedCost().toLocaleString('vi-VN')} VNĐ
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: '#666', mt: 1 }}>
                                            Phụ tùng: {formData.spare_parts.reduce((sum, item) => sum + (parseFloat(item.total_price) || 0), 0).toLocaleString('vi-VN')} VNĐ + 
                                            Vật tư tiêu hao: {formData.consumables.reduce((sum, item) => sum + (parseFloat(item.total_cost) || 0), 0).toLocaleString('vi-VN')} VNĐ
                                        </Typography>
                                    </Box>
                                </Grid2>
                            </Grid2>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={2}>
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Danh sách kiểm tra bảo trì
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        startIcon={<AddIcon />}
                                        onClick={addChecklistItem}
                                        sx={{ minWidth: 150 }}
                                    >
                                        Thêm mục kiểm tra
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => setOpenStandardDialog(true)}
                                    >
                                        Áp dụng checklist chuẩn
                                    </Button>
                                </Stack>
                            </Box>

                            <Box sx={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '1.1rem' }}>
                                    <thead>
                                        <tr style={{ backgroundColor: theme.palette.primary.main }}>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'left', width: '40px' }}>STT</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'left', width: '200px' }}>Nội dung</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'left', width: '150px' }}>Hạng mục kiểm tra</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'left', width: '120px' }}>Tiêu chuẩn OK</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'left', width: '200px' }}>Phương pháp kiểm tra</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'center', width: '80px' }}>Bắt buộc</th>
                                            <th style={{ border: '1px solid #ddd', padding: '12px', color: '#fff', textAlign: 'center', width: '80px' }}>Xóa</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {maintenanceChecklist.map((item, index) => (
                                            <tr key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff' }}>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                    {index + 1}
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={item.task}
                                                        onChange={(e) => updateChecklistItem(item.id, e.target.value)}
                                                        placeholder="Nội dung kiểm tra..."
                                                        variant="outlined"
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={item.check_item || ''}
                                                        onChange={(e) => {
                                                            setMaintenanceChecklist(prev =>
                                                                prev.map(i => i.id === item.id ? { ...i, check_item: e.target.value } : i)
                                                            );
                                                        }}
                                                        placeholder="Hạng mục..."
                                                        variant="outlined"
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={item.standard_value || ''}
                                                        onChange={(e) => {
                                                            setMaintenanceChecklist(prev =>
                                                                prev.map(i => i.id === item.id ? { ...i, standard_value: e.target.value } : i)
                                                            );
                                                        }}
                                                        placeholder="Giá trị chuẩn..."
                                                        variant="outlined"
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        value={item.check_method || ''}
                                                        onChange={(e) => {
                                                            setMaintenanceChecklist(prev =>
                                                                prev.map(i => i.id === item.id ? { ...i, check_method: e.target.value } : i)
                                                            );
                                                        }}
                                                        placeholder="Phương pháp..."
                                                        variant="outlined"
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                    <Checkbox
                                                        checked={item.required || false}
                                                        onChange={(e) => {
                                                            setMaintenanceChecklist(prev =>
                                                                prev.map(i => i.id === item.id ? { ...i, required: e.target.checked } : i)
                                                            );
                                                        }}
                                                    />
                                                </td>
                                                <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => removeChecklistItem(item.id)}
                                                        sx={{ color: '#f44336' }}
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </Box>

                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={3}>
                            {/* Danh sách công việc */}
                            
                            {/* 3 Hạng mục công việc mặc định */}
                            <Box sx={{ mb: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                    Hạng mục công việc chính
                                </Typography>
                                <FormGroup>
                                    {/* Vệ sinh */}
                                    {defaultTasks.cleaning.checked && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                            <Typography variant="body1" fontWeight="bold">Vệ sinh (mặc định theo loại)</Typography>
                                            <Box sx={{ ml: 2, mt: 1 }}>
                                                <Autocomplete
                                                    multiple
                                                    size="small"
                                                    options={mechanicalStaff}
                                                    getOptionLabel={(option) => option.name}
                                                    value={mechanicalStaff.filter(staff => 
                                                        defaultTasks.cleaning.assignedTo.includes(staff.id)
                                                    )}
                                                    onChange={(e, newValue) => {
                                                        setDefaultTasks(prev => ({
                                                            ...prev,
                                                            cleaning: { 
                                                                ...prev.cleaning, 
                                                                assignedTo: newValue.map(v => v.id)
                                                            }
                                                        }));
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Người thực hiện"
                                                            placeholder="Chọn nhân viên xưởng cơ điện"
                                                        />
                                                    )}
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                key={option.id}
                                                                label={option.name}
                                                                {...getTagProps({ index })}
                                                                size="small"
                                                            />
                                                        ))
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                    
                                    {/* Kiểm tra */}
                                    {defaultTasks.inspection.checked && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                            <Typography variant="body1" fontWeight="bold">Kiểm tra (mặc định theo loại)</Typography>
                                            <Box sx={{ ml: 2, mt: 1 }}>
                                                <Autocomplete
                                                    multiple
                                                    size="small"
                                                    options={mechanicalStaff}
                                                    getOptionLabel={(option) => option.name}
                                                    value={mechanicalStaff.filter(staff => 
                                                        defaultTasks.inspection.assignedTo.includes(staff.id)
                                                    )}
                                                    onChange={(e, newValue) => {
                                                        setDefaultTasks(prev => ({
                                                            ...prev,
                                                            inspection: { 
                                                                ...prev.inspection, 
                                                                assignedTo: newValue.map(v => v.id)
                                                            }
                                                        }));
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Người thực hiện"
                                                            placeholder="Chọn nhân viên xưởng cơ điện"
                                                        />
                                                    )}
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                key={option.id}
                                                                label={option.name}
                                                                {...getTagProps({ index })}
                                                                size="small"
                                                            />
                                                        ))
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                    
                                    {/* Bảo trì */}
                                    {defaultTasks.maintenance.checked && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                            <Typography variant="body1" fontWeight="bold">Bảo trì (mặc định theo loại)</Typography>
                                            <Box sx={{ ml: 2, mt: 1 }}>
                                                <Autocomplete
                                                    multiple
                                                    size="small"
                                                    options={mechanicalStaff}
                                                    getOptionLabel={(option) => option.name}
                                                    value={mechanicalStaff.filter(staff => 
                                                        defaultTasks.maintenance.assignedTo.includes(staff.id)
                                                    )}
                                                    onChange={(e, newValue) => {
                                                        setDefaultTasks(prev => ({
                                                            ...prev,
                                                            maintenance: { 
                                                                ...prev.maintenance, 
                                                                assignedTo: newValue.map(v => v.id)
                                                            }
                                                        }));
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Người thực hiện"
                                                            placeholder="Chọn nhân viên xưởng cơ điện"
                                                        />
                                                    )}
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                key={option.id}
                                                                label={option.name}
                                                                {...getTagProps({ index })}
                                                                size="small"
                                                            />
                                                        ))
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    )}

                                    {/* Sửa chữa */}
                                    {defaultTasks.corrective.checked && (
                                        <Box sx={{ mb: 2, p: 2, bgcolor: 'white', borderRadius: 1 }}>
                                            <Typography variant="body1" fontWeight="bold">Sửa chữa (mặc định theo loại)</Typography>
                                            <Box sx={{ ml: 2, mt: 1 }}>
                                                <Autocomplete
                                                    multiple
                                                    size="small"
                                                    options={mechanicalStaff}
                                                    getOptionLabel={(option) => option.name}
                                                    value={mechanicalStaff.filter(staff => 
                                                        defaultTasks.corrective.assignedTo.includes(staff.id)
                                                    )}
                                                    onChange={(e, newValue) => {
                                                        setDefaultTasks(prev => ({
                                                            ...prev,
                                                            corrective: { 
                                                                ...prev.corrective, 
                                                                assignedTo: newValue.map(v => v.id)
                                                            }
                                                        }));
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            label="Người thực hiện"
                                                            placeholder="Chọn nhân viên xưởng cơ điện"
                                                        />
                                                    )}
                                                    renderTags={(value, getTagProps) =>
                                                        value.map((option, index) => (
                                                            <Chip
                                                                key={option.id}
                                                                label={option.name}
                                                                {...getTagProps({ index })}
                                                                size="small"
                                                            />
                                                        ))
                                                    }
                                                />
                                            </Box>
                                        </Box>
                                    )}
                                </FormGroup>
                            </Box>
                            
                            <Divider sx={{ my: 3 }} />
                            
                            {/* Công việc tùy chỉnh */}
                            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Công việc chi tiết khác
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
                                                <Grid2 xs={12} md={5}>
                                                    <Autocomplete
                                                        multiple
                                                        size="small"
                                                        options={mechanicalStaff}
                                                        getOptionLabel={(option) => option.name}
                                                        value={mechanicalStaff.filter(staff => 
                                                            (task.assigned_to || []).includes(staff.id)
                                                        )}
                                                        onChange={(e, newValue) => {
                                                            updateWorkTask(task.id, 'assigned_to', newValue.map(v => v.id));
                                                        }}
                                                        renderInput={(params) => (
                                                            <TextField
                                                                {...params}
                                                                label="Người thực hiện"
                                                                placeholder="Chọn nhiều người"
                                                            />
                                                        )}
                                                        renderTags={(value, getTagProps) =>
                                                            value.map((option, index) => (
                                                                <Chip
                                                                    key={option.id}
                                                                    label={option.name}
                                                                    {...getTagProps({ index })}
                                                                    size="small"
                                                                />
                                                            ))
                                                        }
                                                    />
                                                </Grid2>
                                                <Grid2 xs={12} md={1}>
                                                    <TextField
                                                        fullWidth
                                                        size="small"
                                                        type="number"
                                                        label="Giờ"
                                                        value={task.estimated_hours}
                                                        onChange={(e) => updateWorkTask(task.id, 'estimated_hours', e.target.value)}
                                                        placeholder="2"
                                                    />
                                                </Grid2>
                                                <Grid2 xs={12} md={1}>
                                                    <Tooltip title="Xóa">
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => removeWorkTask(task.id)}
                                                            sx={{ color: '#f44336' }}
                                                        >
                                                            <DeleteIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
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
                                            Chưa có công việc tùy chỉnh nào. Nhấn "Thêm công việc" để bắt đầu.
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

            {/* Dialog chọn checklist chuẩn */}
            <Dialog open={openStandardDialog} onClose={() => setOpenStandardDialog(false)} maxWidth="md" fullWidth>
                <DialogTitle>Chọn checklist chuẩn</DialogTitle>
                <DialogContent dividers>
                    <Stack spacing={2}>
                        <TextField
                            select
                            label="Chọn checklist"
                            value={selectedStandardId}
                            onChange={(e) => {
                                setSelectedStandardId(e.target.value);
                                setSelectedStandards(e.target.value ? [Number(e.target.value)] : []);
                            }}
                            fullWidth
                        >
                            <MenuItem value="">-- Chọn checklist --</MenuItem>
                            {checklistStandards.map((std) => (
                                <MenuItem key={std.id} value={std.id}>
                                    {std.name} ({std.items?.length || 0} hạng mục)
                                </MenuItem>
                            ))}
                        </TextField>

                        {selectedStandardId && (
                            <Box sx={{ maxHeight: 320, overflow: 'auto' }}>
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>STT</TableCell>
                                            <TableCell>Nội dung</TableCell>
                                            <TableCell>Hạng mục</TableCell>
                                            <TableCell>Tiêu chuẩn OK</TableCell>
                                            <TableCell>Phương pháp</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {(checklistStandards.find((s) => s.id === Number(selectedStandardId))?.items || []).map((item, idx) => (
                                            <TableRow key={idx}>
                                                <TableCell>{idx + 1}</TableCell>
                                                <TableCell>{item.task || item.name}</TableCell>
                                                <TableCell>{item.check_item}</TableCell>
                                                <TableCell>{item.standard_value}</TableCell>
                                                <TableCell>{item.method}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Box>
                        )}
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenStandardDialog(false)}>Hủy</Button>
                    <Button
                        variant="contained"
                        onClick={() => {
                            const chosen = checklistStandards.find((s) => s.id === Number(selectedStandardId));
                            if (!chosen) return;
                            const maxId = maintenanceChecklist.length ? Math.max(...maintenanceChecklist.map((i) => i.id)) : 0;
                            let nextId = maxId + 1;
                            const newItems = (chosen.items || []).map((item) => ({
                                id: nextId++,
                                task: item.task || item.name || '',
                                check_item: item.check_item || '',
                                standard_value: item.standard_value || '',
                                check_method: item.method || '',
                                required: Boolean(item.required)
                            }));
                            setMaintenanceChecklist((prev) => [...prev, ...newItems]);
                            setSelectedStandards([]);
                            setSelectedStandardId('');
                            setOpenStandardDialog(false);
                        }}
                        disabled={!selectedStandardId}
                    >
                        Áp dụng checklist
                    </Button>
                </DialogActions>
            </Dialog>

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
