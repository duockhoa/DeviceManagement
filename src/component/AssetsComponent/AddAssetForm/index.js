import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab, TextField, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Stack } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import * as React from 'react';
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

function AddAssetForm({ handleClose }) {
    const assetCategories = useSelector((state) => state.assetCategories.categories);
    const plants = useSelector((state) => state.plants.plants);
    const areas = useSelector((state) => state.areas.areas);

    const [tabValue, setTabValue] = React.useState(0);

    // Form state cho thông tin chung
    const [formData, setFormData] = React.useState({
        asset_code: '',
        name: '',
        category_id: '',
        team_id: '',
        area_id: '',
        description: '',
        serial_number: '',
        image: '',
        notes: ''
    });


    console.log('Asset Categories:', assetCategories);
    console.log('Plants:', plants);
    console.log('Areas:', areas);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = () => {
        // Logic lưu form
        console.log('Saving form data:', formData);
        // TODO: Implement save logic
    };

    const handleReset = () => {
        // Logic reset form
        setFormData({
            asset_code: '',
            name: '',
            category_id: '',
            team_id: '',
            area_id: '',
            description: '',
            serial_number: '',
            image: '',
            notes: ''
        });
        console.log('Form reset');
    };

    return (
        <Box sx={{ width: "100%", height: "90vh", display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#f5f5f5'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    color: '#333'
                }}>
                    Nhập thông tin thiết bị
                </Typography>

                <IconButton onClick={handleClose} sx={{ color: '#666' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* Form Content */}
            <Stack p={2} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Nhập thông tin chung */}
                <Box sx={{ border: '1px solid #ddd', p: 3, borderRadius: 1 }}>
                    <Typography variant="h6" gutterBottom sx={{
                        color: '#1976d2',
                        fontWeight: 'bold',
                        mb: 3
                    }}>
                        Thông tin chung
                    </Typography>

                    <Grid container spacing={3}>
                        {/* Mã thiết bị */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Mã thiết bị"
                                name="asset_code"
                                value={formData.asset_code}
                                onChange={handleInputChange}
                                placeholder="VD: TB00001"
                                variant="outlined"
                                sx={{
                                    '& .MuiInputLabel-asterisk': { color: 'red' }
                                }}
                                helperText="Mã thiết bị phải là duy nhất"
                            />
                        </Grid>

                        {/* Tên thiết bị */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                required
                                label="Tên thiết bị"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="VD: Máy dập viên"
                                variant="outlined"
                                sx={{
                                    '& .MuiInputLabel-asterisk': { color: 'red' }
                                }}
                            />
                        </Grid>

                        {/* Serial Number */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Serial Number"
                                name="serial_number"
                                value={formData.serial_number}
                                onChange={handleInputChange}
                                placeholder="VD: SN123456789"
                                variant="outlined"
                                helperText="Số seri của thiết bị (nếu có)"
                            />
                        </Grid>

                        {/* Mô tả */}
                        <Grid item xs={12} md={6}>
                            <TextField
                                fullWidth
                                label="Mô tả"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                placeholder="Mô tả ngắn về thiết bị"
                                variant="outlined"
                                multiline
                                rows={1}
                            />
                        </Grid>

                        {/* Ghi chú */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Ghi chú"
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                placeholder="Các ghi chú bổ sung"
                                variant="outlined"
                                multiline
                                rows={2}
                            />
                        </Grid>
                    </Grid>
                </Box>

                {/* Thông tin chi tiết */}
                <Box sx={{ mt: 2, border: '1px solid #ddd', flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 1 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                            <Tab label="Thông số kỹ thuật" {...a11yProps(0)} />
                            <Tab label="Bảo trì & Bảo dưỡng" {...a11yProps(1)} />
                            <Tab label="Tài liệu đính kèm" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Typography variant="h6" gutterBottom>Thông số kỹ thuật</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Công suất"
                                    placeholder="VD: 1.5 kW"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Điện áp"
                                    placeholder="VD: 380V"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Kích thước"
                                    placeholder="VD: 100x200x150 cm"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Trọng lượng"
                                    placeholder="VD: 500 kg"
                                    variant="outlined"
                                />
                            </Grid>
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <Typography variant="h6" gutterBottom>Bảo trì & Bảo dưỡng</Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Chu kỳ bảo trì"
                                    placeholder="VD: 3 tháng"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Người phụ trách"
                                    placeholder="VD: Nguyễn Văn A"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Hướng dẫn bảo trì"
                                    placeholder="Mô tả các bước bảo trì thiết bị"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                />
                            </Grid>
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                        <Typography variant="h6" gutterBottom>Tài liệu đính kèm</Typography>
                        <Box sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: '#fafafa'
                        }}>
                            <Typography variant="body1" color="textSecondary">
                                Kéo thả file vào đây hoặc click để chọn file
                            </Typography>
                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                Hỗ trợ: PDF, DOC, DOCX, JPG, PNG (Tối đa 10MB)
                            </Typography>
                            <Button
                                variant="outlined"
                                sx={{ mt: 2 }}
                                component="label"
                            >
                                Chọn file
                                <input type="file" hidden multiple />
                            </Button>
                        </Box>
                    </CustomTabPanel>
                </Box>
            </Stack>

            {/* Action Buttons */}
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
            }}>
                <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<CancelIcon />}
                    sx={{
                        fontSize: '1.3rem',
                        minWidth: 120,
                        color: '#666',
                        borderColor: '#666'
                    }}
                >
                    Làm mới
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        fontSize: '1.3rem',
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
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    sx={{
                        fontSize: '1.3rem',
                        minWidth: 120,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#1565c0'
                        }
                    }}
                    disabled={!formData.asset_code || !formData.name} // Disable nếu thiếu thông tin bắt buộc
                >
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}

export default AddAssetForm;