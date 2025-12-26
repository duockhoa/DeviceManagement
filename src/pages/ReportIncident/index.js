import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    Stack,
    MenuItem,
    Alert,
    Snackbar,
    Autocomplete
} from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import SendIcon from '@mui/icons-material/Send';
import incidentsService from '../../services/incidentsService';
import { getAllAssets } from '../../services/assetsService';

/**
 * ReportIncident - Trang báo cáo sự cố đơn giản cho END USER
 * Không có quyền quản lý, chỉ báo cáo sự cố
 */
function ReportIncident() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [assets, setAssets] = useState([]);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [formData, setFormData] = useState({
        incident_category: 'EQUIPMENT',
        asset_id: null,
        facility_type: '',
        system_type: '',
        operation_type: '',
        building: '',
        floor: '',
        room: '',
        title: '',
        description: '',
        severity: 'medium'
    });

    const categoryOptions = [
        { value: 'EQUIPMENT', label: '🔧 Thiết bị' },
        { value: 'FACILITY', label: '🏢 Nhà xưởng' },
        { value: 'SYSTEM', label: '⚙️ Hệ thống' },
        { value: 'OPERATION', label: '📋 Vận hành' }
    ];

    const severityOptions = [
        { value: 'critical', label: '🔴 Khẩn cấp', color: 'error' },
        { value: 'high', label: '🟠 Cao', color: 'warning' },
        { value: 'medium', label: '🟡 Trung bình', color: 'info' },
        { value: 'low', label: '🟢 Thấp', color: 'success' }
    ];

    const facilityTypes = [
        { value: 'building_structure', label: 'Kết cấu công trình' },
        { value: 'roof', label: 'Mái' },
        { value: 'wall', label: 'Tường' },
        { value: 'floor', label: 'Sàn' },
        { value: 'door_window', label: 'Cửa/Cửa sổ' },
        { value: 'lighting', label: 'Chiếu sáng' },
        { value: 'restroom', label: 'Nhà vệ sinh' },
        { value: 'office', label: 'Văn phòng' },
        { value: 'warehouse', label: 'Kho' },
        { value: 'workshop', label: 'Xưởng' },
        { value: 'parking', label: 'Bãi đỗ xe' },
        { value: 'landscape', label: 'Cảnh quan' },
        { value: 'other', label: 'Khác' }
    ];

    const systemTypes = [
        { value: 'electrical', label: 'Điện' },
        { value: 'water', label: 'Nước' },
        { value: 'compressed_air', label: 'Khí nén' },
        { value: 'hvac', label: 'HVAC/Điều hòa' },
        { value: 'fire_protection', label: 'Phòng cháy chữa cháy' },
        { value: 'it_network', label: 'Mạng IT' },
        { value: 'cctv_security', label: 'Camera/An ninh' },
        { value: 'telephone', label: 'Điện thoại' },
        { value: 'waste_treatment', label: 'Xử lý chất thải' },
        { value: 'steam', label: 'Hơi nước' },
        { value: 'gas', label: 'Khí gas' },
        { value: 'other', label: 'Khác' }
    ];

    const operationTypes = [
        { value: 'cleaning', label: 'Vệ sinh' },
        { value: 'relocation', label: 'Di chuyển/Sắp xếp' },
        { value: 'access_control', label: 'Kiểm soát ra vào' },
        { value: 'safety_check', label: 'Kiểm tra an toàn' },
        { value: 'environment', label: 'Môi trường' },
        { value: 'security', label: 'An ninh' },
        { value: 'support', label: 'Hỗ trợ' },
        { value: 'other', label: 'Khác' }
    ];

    useEffect(() => {
        loadAssets();
    }, []);

    const loadAssets = async () => {
        try {
            const data = await getAllAssets();
            setAssets(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading assets:', error);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value };
            
            // Reset conditional fields when category changes
            if (field === 'incident_category') {
                updated.asset_id = null;
                updated.facility_type = '';
                updated.system_type = '';
                updated.operation_type = '';
            }
            
            return updated;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Validation
        if (!formData.title.trim()) {
            setSnackbar({ open: true, message: 'Vui lòng nhập tiêu đề sự cố', severity: 'error' });
            return;
        }

        if (formData.incident_category === 'EQUIPMENT' && !formData.asset_id) {
            setSnackbar({ open: true, message: 'Vui lòng chọn thiết bị', severity: 'error' });
            return;
        }

        if (formData.incident_category === 'FACILITY' && !formData.facility_type) {
            setSnackbar({ open: true, message: 'Vui lòng chọn loại cơ sở', severity: 'error' });
            return;
        }

        if (formData.incident_category === 'SYSTEM' && !formData.system_type) {
            setSnackbar({ open: true, message: 'Vui lòng chọn loại hệ thống', severity: 'error' });
            return;
        }

        if (formData.incident_category === 'OPERATION' && !formData.operation_type) {
            setSnackbar({ open: true, message: 'Vui lòng chọn loại yêu cầu', severity: 'error' });
            return;
        }

        try {
            setLoading(true);
            await incidentsService.createIncident(formData);
            setSnackbar({ 
                open: true, 
                message: '✅ Báo cáo sự cố thành công! Bộ phận xử lý sẽ tiếp nhận sớm.', 
                severity: 'success' 
            });
            
            // Redirect to my reports after 1.5s
            setTimeout(() => {
                navigate('/incidents/my-reports');
            }, 1500);
        } catch (error) {
            setSnackbar({ open: true, message: error.message || 'Không thể gửi báo cáo', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 900, mx: 'auto' }}>
            <Paper sx={{ p: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <ReportProblemIcon sx={{ fontSize: 40, color: 'error.main' }} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                            Báo cáo sự cố
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Điền thông tin chi tiết để bộ phận xử lý tiếp nhận nhanh chóng
                        </Typography>
                    </Box>
                </Stack>

                <Alert severity="info" sx={{ mb: 3 }}>
                    💡 Sau khi gửi báo cáo, bạn có thể theo dõi tiến độ xử lý tại <strong>Sự cố của tôi</strong>
                </Alert>

                <form onSubmit={handleSubmit}>
                    <Stack spacing={3}>
                        {/* Category Selection */}
                        <TextField
                            select
                            required
                            label="Loại sự cố"
                            value={formData.incident_category}
                            onChange={(e) => handleChange('incident_category', e.target.value)}
                            helperText="Chọn loại sự cố phù hợp để hệ thống định tuyến đúng bộ phận xử lý"
                        >
                            {categoryOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Conditional Fields based on Category */}
                        {formData.incident_category === 'EQUIPMENT' && (
                            <Autocomplete
                                options={assets}
                                getOptionLabel={(a) => `${a.asset_code || ''} - ${a.name || ''}`}
                                isOptionEqualToValue={(opt, val) => opt.id === val.id}
                                value={assets.find((a) => a.id === formData.asset_id) || null}
                                onChange={(_, v) => handleChange('asset_id', v?.id || null)}
                                renderOption={(props, option) => (
                                    <li {...props} key={option.id}>
                                        {option.asset_code} - {option.name}
                                    </li>
                                )}
                                renderInput={(params) => (
                                    <TextField 
                                        {...params} 
                                        label="Thiết bị gặp sự cố" 
                                        required
                                        helperText="Chọn thiết bị đang gặp sự cố"
                                    />
                                )}
                            />
                        )}

                        {formData.incident_category === 'FACILITY' && (
                            <>
                                <TextField
                                    select
                                    required
                                    label="Loại cơ sở"
                                    value={formData.facility_type}
                                    onChange={(e) => handleChange('facility_type', e.target.value)}
                                >
                                    {facilityTypes.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                    ))}
                                </TextField>
                                <Stack direction="row" spacing={2}>
                                    <TextField
                                        label="Tòa nhà"
                                        value={formData.building}
                                        onChange={(e) => handleChange('building', e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Tầng"
                                        value={formData.floor}
                                        onChange={(e) => handleChange('floor', e.target.value)}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phòng"
                                        value={formData.room}
                                        onChange={(e) => handleChange('room', e.target.value)}
                                        fullWidth
                                    />
                                </Stack>
                            </>
                        )}

                        {formData.incident_category === 'SYSTEM' && (
                            <TextField
                                select
                                required
                                label="Loại hệ thống"
                                value={formData.system_type}
                                onChange={(e) => handleChange('system_type', e.target.value)}
                            >
                                {systemTypes.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {formData.incident_category === 'OPERATION' && (
                            <TextField
                                select
                                required
                                label="Loại yêu cầu"
                                value={formData.operation_type}
                                onChange={(e) => handleChange('operation_type', e.target.value)}
                            >
                                {operationTypes.map(opt => (
                                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                                ))}
                            </TextField>
                        )}

                        {/* Severity */}
                        <TextField
                            select
                            required
                            label="Mức độ"
                            value={formData.severity}
                            onChange={(e) => handleChange('severity', e.target.value)}
                            helperText="Đánh giá mức độ ảnh hưởng của sự cố"
                        >
                            {severityOptions.map(opt => (
                                <MenuItem key={opt.value} value={opt.value}>
                                    {opt.label}
                                </MenuItem>
                            ))}
                        </TextField>

                        {/* Title */}
                        <TextField
                            required
                            label="Tiêu đề sự cố"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            placeholder="VD: Máy bơm nước không hoạt động"
                            helperText="Mô tả ngắn gọn vấn đề"
                        />

                        {/* Description */}
                        <TextField
                            multiline
                            rows={4}
                            label="Mô tả chi tiết"
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            placeholder="Mô tả chi tiết hiện tượng, thời gian phát hiện, vị trí cụ thể..."
                            helperText="Thông tin càng chi tiết càng giúp xử lý nhanh chóng"
                        />

                        {/* Actions */}
                        <Stack direction="row" spacing={2} justifyContent="flex-end">
                            <Button
                                variant="outlined"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Hủy
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                startIcon={<SendIcon />}
                                disabled={loading}
                                size="large"
                            >
                                {loading ? 'Đang gửi...' : 'Gửi báo cáo'}
                            </Button>
                        </Stack>
                    </Stack>
                </form>
            </Paper>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert 
                    severity={snackbar.severity} 
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

export default ReportIncident;
