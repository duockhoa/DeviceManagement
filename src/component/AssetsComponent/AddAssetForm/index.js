import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab, Grid } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Stack } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import PropTypes from 'prop-types';
import Grid2 from '@mui/material/Unstable_Grid2';
import InputField from '../InputField';
import SelectField from '../SelectField';
import { createAsset} from "../../../redux/slice/assetsSlice"

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
    const dispatch = useDispatch();
    const assetCategories = useSelector((state) => state.assetCategories.categories);
    const plants = useSelector((state) => state.plants.plants);
    const areas = useSelector((state) => state.areas.areas);
    const departments = useSelector((state) => state.departments.departments);
    const user = useSelector((state) => state.user.userInfo);
    console.log(assetCategories)

    const [tabValue, setTabValue] = useState(0);

    // Form state cho thông tin chung
    const [formData, setFormData] = useState({
        asset_code: '',
        name: '',
        category_id: '',
        team_id: '',
        area_id: '',
        description: '',
        image: '',
        created_by: user.id,
    });

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
        dispatch(createAsset(formData));
        handleClose();
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
            image: '',
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
                    <Grid2 container spacing={3}>
                        <Grid2 xs={12} md={4}>
                            <InputField
                                label="Mã TB"
                                name="asset_code"
                                value={formData.asset_code}
                                onChange={handleInputChange}
                                placeholder="0003"
                                required
                                width='120px'
                            />
                        </Grid2>
                        <Grid2 xs={12} md={4}>
                            <InputField
                                label="Tên TB"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Máy phát thủy lực"
                                required
                            />
                        </Grid2>
                        <Grid2 xs={12} md={4}>
                            <SelectField
                                label="Loại TB"
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                options={assetCategories}
                                required
                                placeholder="Chọn loại thiết bị"
                                valueKey="id"
                                labelKey="name"
                            />
                            <SelectField
                                label="Bộ phận quản lý"
                                name="team_id"
                                value={formData.team_id}
                                onChange={handleInputChange}
                                options={departments}
                                required
                                placeholder="Chọn Bộ phận quản lý"
                                valueKey="name"
                                labelKey="name"
                            />
                             <SelectField
                                label="Khu vực"
                                name="area_id"
                                value={formData.area_id}
                                onChange={handleInputChange}
                                options={areas}
                                required
                                placeholder="Chọn khu vực"
                                valueKey="id"
                                labelKey="name"
                            />
                        </Grid2>
                    </Grid2>
                </Box>

                {/* Thông tin chi tiết */}
                <Box sx={{ mt: 2, border: '1px solid #ddd', flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 1 }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                            <Tab label="Thông tin chung" {...a11yProps(0)} />
                            <Tab label="Thông số kỹ thuật" {...a11yProps(1)} />
                            <Tab label="Bảo trì & Bảo dưỡng" {...a11yProps(2)} />
                            <Tab label="Tài liệu đính kèm" {...a11yProps(3)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid container spacing={2}>
                            Thông tin về số seri, model, nhà sản xuất, năm sản xuất, v.v.
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <Grid container spacing={2}>
                            Các loại thông tin về cấu hình, cấu tạo, v.v.
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid container spacing={2}>
                            Các loại thông tin về cấu hình, cấu tạo, v.v.
                        </Grid>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={3}>
                        <Box sx={{
                            border: '2px dashed #ccc',
                            borderRadius: 1,
                            p: 3,
                            textAlign: 'center',
                            backgroundColor: '#fafafa'
                        }}>
                            Gồm tên tài liệu và file đính kèm
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
                    disabled={!formData.asset_code || !formData.name || !formData.category_id}
                >
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}

export default AddAssetForm;