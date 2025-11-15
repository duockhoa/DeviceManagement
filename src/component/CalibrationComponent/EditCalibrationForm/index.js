import { useState, useEffect } from 'react';
import {
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Box,
    Alert,
    Snackbar,
    IconButton,
    Divider,
    Tabs,
    Tab,
    Paper
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from '@mui/system';
import { useDispatch, useSelector } from 'react-redux';
import { updateCalibrationRecord } from '../../../redux/slice/calibrationSlice';
import { fetchAssets } from '../../../redux/slice/assetsSlice';
import InputField from '../../InputComponent/InputField';
import SelectField from '../../InputComponent/SelectField';
import InputDate from '../../InputComponent/InputDate';
import InputNumber from '../../InputComponent/InputNumber';
import theme from '../../../theme';
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function EditCalibrationForm({ handleClose, calibrationData, onSuccess }) {
    const dispatch = useDispatch();
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.calibration.loading);
    const error = useSelector((state) => state.calibration.error);

    const [formData, setFormData] = useState({
        calibration_code: '',
        asset_id: '',
        calibration_type: 'internal',
        priority: 'medium',
        title: '',
        description: '',
        scheduled_date: '',
        estimated_duration: '',
        technician_id: '',
        calibration_standard: '',
        tolerance: '',
        notes: '',
        cost: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        // Fetch assets if not already loaded
        if (!assets || assets.length === 0) {
            dispatch(fetchAssets());
        }

        // Load calibration data for editing
        if (calibrationData) {
            setFormData({
                calibration_code: calibrationData.calibration_code || '',
                asset_id: calibrationData.asset_id || '',
                calibration_type: calibrationData.calibration_type || 'internal',
                priority: calibrationData.priority || 'medium',
                title: calibrationData.title || '',
                description: calibrationData.description || '',
                scheduled_date: calibrationData.scheduled_date ? 
                    new Date(calibrationData.scheduled_date).toISOString().slice(0, 16) : '',
                estimated_duration: calibrationData.estimated_duration || '',
                technician_id: calibrationData.technician_id || '',
                calibration_standard: calibrationData.calibration_standard || '',
                tolerance: calibrationData.tolerance || '',
                notes: calibrationData.notes || '',
                cost: calibrationData.cost || ''
            });
        }
    }, [dispatch, assets, calibrationData]);

    const handleInputChange = (field) => (event) => {
        const value = event.target.value;
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

    const validateForm = () => {
        const errors = {};

        if (!formData.asset_id) {
            errors.asset_id = 'Vui lòng chọn thiết bị';
        }

        if (!formData.title.trim()) {
            errors.title = 'Vui lòng nhập tiêu đề hiệu chuẩn';
        }

        if (!formData.scheduled_date) {
            errors.scheduled_date = 'Vui lòng chọn ngày dự kiến';
        } else {
            // Check if scheduled date is not in the past
            const scheduledDate = new Date(formData.scheduled_date);
            const now = new Date();
            if (scheduledDate < now) {
                errors.scheduled_date = 'Ngày dự kiến không được là ngày trong quá khứ';
            }
        }

        if (!formData.estimated_duration || formData.estimated_duration <= 0) {
            errors.estimated_duration = 'Vui lòng nhập thời gian ước tính hợp lệ (phải > 0)';
        } else if (formData.estimated_duration > 100) {
            errors.estimated_duration = 'Thời gian ước tính không được vượt quá 100 giờ';
        }

        if (!formData.calibration_standard.trim()) {
            errors.calibration_standard = 'Vui lòng nhập tiêu chuẩn hiệu chuẩn';
        }

        // Validate tolerance if provided
        if (formData.tolerance && (isNaN(formData.tolerance) || formData.tolerance <= 0)) {
            errors.tolerance = 'Sai số cho phép phải là số dương';
        }

        // Validate cost if provided
        if (formData.cost && (isNaN(formData.cost) || formData.cost < 0)) {
            errors.cost = 'Chi phí phải là số không âm';
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const { calibration_code, ...updateData } = formData;
            const submitData = {
                ...updateData,
                scheduled_date: new Date(formData.scheduled_date).toISOString(),
                estimated_duration: parseFloat(formData.estimated_duration),
                tolerance: formData.tolerance ? parseFloat(formData.tolerance) : null,
                cost: formData.cost ? parseFloat(formData.cost) : null
            };

            await dispatch(updateCalibrationRecord({ 
                id: calibrationData.id, 
                data: submitData 
            })).unwrap();
            
            // Show success message
            setSuccessMessage('Cập nhật lịch hiệu chuẩn thành công!');
            setShowSuccess(true);
            
            // Call onSuccess callback to reload data in parent
            if (onSuccess) {
                onSuccess();
            }
            
            // Close dialog after a short delay
            setTimeout(() => {
                handleClose();
            }, 1500);
            
        } catch (error) {
            // Error is already handled by Redux state
        }
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange2 = (name, value) => {
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const calibrationTypes = [
        { value: 'internal', label: 'Hiệu chuẩn nội bộ' },
        { value: 'external', label: 'Hiệu chuẩn bên ngoài' }
    ];

    const priorities = [
        { value: 'low', label: 'Thấp' },
        { value: 'medium', label: 'Trung bình' },
        { value: 'high', label: 'Cao' },
        { value: 'critical', label: 'Khẩn cấp' }
    ];

    return (
        <Box sx={{ width: "100%", height: "90vh", display: 'flex', flexDirection: 'column', backgroundColor: '#f8f8f8' }}>
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
                    CHỈNH SỬA HIỆU CHUẨN
                </Typography>

                <IconButton onClick={handleClose} sx={{ color: '#fff', p: 0.5 }}>
                    <CloseIcon sx={{ fontSize: "1.8rem" }} />
                </IconButton>
            </Box>

            {/* Form Content */}
            <Stack sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Nhập thông tin cơ bản */}
                <Box sx={{ p: 3, borderRadius: 1, backgroundColor: '#fff', display: "flex" }}>
                    <Grid2 container sx={{ mb: 2, alignItems: 'center' }}>
                        <Grid2 container spacing={2}>
                            <Grid2 lg={2}>
                                <InputField
                                    label="Mã hiệu chuẩn"
                                    name="calibration_code"
                                    value={formData.calibration_code}
                                    onChange={handleInputChange2}
                                    required
                                    disabled
                                    width='180px'
                                />
                            </Grid2>

                            <Grid2 lg={3}>
                                <SelectField
                                    label="Thiết bị"
                                    name="asset_id"
                                    value={formData.asset_id}
                                    onChange={handleInputChange2}
                                    options={assets}
                                    required
                                    placeholder="Chọn thiết bị"
                                    valueKey="id"
                                    labelKey="name"
                                    width='250px'
                                    error={!!formErrors.asset_id}
                                    helperText={formErrors.asset_id}
                                />
                            </Grid2>

                            <Grid2 lg={7}>
                                <InputField
                                    label="Tiêu đề hiệu chuẩn"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleInputChange2}
                                    placeholder="Hiệu chuẩn định kỳ máy X-ray"
                                    required
                                    error={!!formErrors.title}
                                    helperText={formErrors.title}
                                />
                            </Grid2>

                            <Grid2 lg={2}>
                                <SelectField
                                    label="Loại hiệu chuẩn"
                                    name="calibration_type"
                                    value={formData.calibration_type}
                                    onChange={handleInputChange2}
                                    options={calibrationTypes}
                                    required
                                    placeholder="Chọn loại"
                                    valueKey="value"
                                    labelKey="label"
                                    width='180px'
                                />
                            </Grid2>

                            <Grid2 lg={2}>
                                <SelectField
                                    label="Ưu tiên"
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleInputChange2}
                                    options={priorities}
                                    required
                                    placeholder="Chọn ưu tiên"
                                    valueKey="value"
                                    labelKey="label"
                                    width='150px'
                                />
                            </Grid2>

                            <Grid2 lg={2}>
                                <InputDate
                                    label="Ngày dự kiến"
                                    name="scheduled_date"
                                    value={formData.scheduled_date}
                                    onChange={handleInputChange2}
                                    required
                                    error={!!formErrors.scheduled_date}
                                    helperText={formErrors.scheduled_date}
                                    width='180px'
                                />
                            </Grid2>

                            <Grid2 lg={2}>
                                <InputNumber
                                    label="Thời gian (giờ)"
                                    name="estimated_duration"
                                    value={formData.estimated_duration}
                                    onChange={handleInputChange2}
                                    required
                                    error={!!formErrors.estimated_duration}
                                    helperText={formErrors.estimated_duration}
                                    width='150px'
                                />
                            </Grid2>

                            <Grid2 lg={4}>
                                <InputField
                                    label="Tiêu chuẩn hiệu chuẩn"
                                    name="calibration_standard"
                                    value={formData.calibration_standard}
                                    onChange={handleInputChange2}
                                    placeholder="ISO 17025, NIST..."
                                    required
                                    error={!!formErrors.calibration_standard}
                                    helperText={formErrors.calibration_standard}
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                </Box>

                <Divider sx={{ borderColor: theme.palette.grey[900] }} />

                {/* Thông tin chi tiết */}
                <Box sx={{ flex: 1, display: 'flex', backgroundColor: '#f5f5f5' }}>
                    <Box sx={{ m: 2, border: '1px solid #aaa', display: 'flex', flexDirection: 'column', borderRadius: 1, flex: 1, backgroundColor: '#fff' }}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider', backgroundColor: '#e4eefdff' }}>
                            <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                                <Tab label="Thông tin chi tiết" {...a11yProps(0)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                                <Tab label="Thông số kỹ thuật" {...a11yProps(1)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                                <Tab label="Ghi chú & Tài liệu" {...a11yProps(2)} sx={{ fontWeight: "bold", fontSize: "10px" }} />
                            </Tabs>
                        </Box>

                        <CustomTabPanel value={tabValue} index={0}>
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12} md={6}>
                                    <InputField
                                        label="Sai số cho phép"
                                        name="tolerance"
                                        value={formData.tolerance}
                                        onChange={handleInputChange2}
                                        placeholder="0.001"
                                        minLabelWidth='100px'
                                        width='300px'
                                    />
                                </Grid2>
                                <Grid2 xs={12} md={6}>
                                    <InputNumber
                                        label="Chi phí (VNĐ)"
                                        name="cost"
                                        value={formData.cost}
                                        onChange={handleInputChange2}
                                        placeholder="Chi phí hiệu chuẩn"
                                        minLabelWidth='100px'
                                        width='300px'
                                    />
                                </Grid2>
                                <Grid2 xs={12}>
                                    <InputField
                                        label="Mô tả chi tiết"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={4}
                                        placeholder="Mô tả chi tiết công việc hiệu chuẩn cần thực hiện..."
                                        minLabelWidth='100px'
                                        fullWidth
                                    />
                                </Grid2>
                            </Grid2>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={1}>
                            <Typography variant="body1" sx={{ color: '#666', textAlign: 'center', mt: 4 }}>
                                Thông số kỹ thuật hiệu chuẩn sẽ được bổ sung trong phiên bản tiếp theo
                            </Typography>
                        </CustomTabPanel>

                        <CustomTabPanel value={tabValue} index={2}>
                            <Grid2 container spacing={2}>
                                <Grid2 xs={12}>
                                    <InputField
                                        label="Ghi chú bổ sung"
                                        name="notes"
                                        value={formData.notes}
                                        onChange={handleInputChange2}
                                        multiline
                                        rows={6}
                                        placeholder="Ghi chú bổ sung về quá trình hiệu chuẩn..."
                                        minLabelWidth='100px'
                                        fullWidth
                                    />
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
                    {loading ? 'Đang cập nhật...' : 'Cập nhật'}
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

export default EditCalibrationForm;