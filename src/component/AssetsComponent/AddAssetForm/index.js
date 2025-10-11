import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab } from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Stack } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputField from '../InputField';
import SelectField from '../SelectField';
import { createAsset } from "../../../redux/slice/assetsSlice"
import theme from '../../../theme';
import { use } from 'react';

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
    const assets = useSelector((state) => state.assets.assets);

    const [tabValue, setTabValue] = useState(0);

    // Form state cho thông tin chung
    const [formData, setFormData] = useState({
        asset_code: '',
        name: '',
        category_id: '',
        team_id: '',
        area_id: '',
        image: '',
        status: 'active',
    });
    const statusOptions = [
        {
            id: "active",
            name: "Hoạt động"
        },
        {
            id: "inactive",
            name: "Ngưng hoạt động"
        }
    ]


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

    useEffect(() => {
        // Tự động tạo mã thiết bị khi chọn nhóm thiết bị
        if (formData.category_id) {
            const selectedCategory = assetCategories.find(cat => cat.id === formData.category_id);
            const prefix = selectedCategory ? selectedCategory.code : 'TB';
            // Tìm mã lớn nhất hiện có với prefix này
            const existingCodes = assets
                .filter(asset => asset.asset_code.startsWith(prefix))
                .map(asset => asset.asset_code);
            let maxNumber = 0;
            if (existingCodes.length > 0) {
                const numbers = existingCodes.map(code => {
                    const parts = code.split('-');
                    return parts.length > 1 ? parseInt(parts[1], 10) : 0;
                });
                maxNumber = Math.max(...numbers);
            }
            setFormData(prev => ({
                ...prev,
                asset_code: `${prefix}-${(maxNumber + 1).toString().padStart(4, '0')}`
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                asset_code: ''
            }));
        }

    }, [formData.category_id]);

    return (
        <Box sx={{ width: "100%", height: "90vh", display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: 2,
                py: 1,
                backgroundColor: theme.palette.grey[800]
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    color: '#fff'
                }}>
                    Nhập thông tin thiết bị
                </Typography>

                <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* Form Content */}
            <Stack p={2} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Nhập thông tin chung */}
                <Box sx={{ p: 3, borderRadius: 1, backgroundColor: '#fafafaff', border: '1px solid #ddd' }}>
                    <Grid2 container spacing={1} sx={{ mb: 2, alignItems: 'center' }}>
                        <Grid2 container spacing={1}>
                            <Grid2 lg={2} >
                                <InputField
                                    label="Mã TB"
                                    name="asset_code"
                                    value={formData.asset_code}
                                    onChange={handleInputChange}
                                    required
                                    disabled
                                    width='120px'
                                />
                            </Grid2>
                            <Grid2 lg={2}>
                                <SelectField
                                    label="Loại TB"
                                    name="category_id"
                                    value={formData.category_id}
                                    onChange={handleInputChange}
                                    options={assetCategories}
                                    required
                                    placeholder="Chọn nhóm TB"
                                    valueKey="id"
                                    labelKey="name"
                                    width='150px'
                                />
                            </Grid2>

                            <Grid2 lg={8}>
                                <InputField
                                    label="Tên thiết bị"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Máy ép vỉ"
                                    required
                                />
                            </Grid2>

                            <Grid2 lg={2}>

                            </Grid2>

                            <Grid2 lg={2}>
                                <SelectField
                                    label="BP QL"
                                    name="team_id"
                                    value={formData.team_id}
                                    onChange={handleInputChange}
                                    options={departments}
                                    required
                                    placeholder="Chọn bộ phận"
                                    valueKey="name"
                                    labelKey="name"
                                    width='150px'
                                />
                            </Grid2>

                            <Grid2 lg={2}>
                                <SelectField
                                    label="Vị trí"
                                    name="area_id"
                                    value={formData.area_id}
                                    onChange={handleInputChange}
                                    options={areas}
                                    required
                                    placeholder="Chọn vị trí"
                                    valueKey="id"
                                    labelKey="name"
                                    width='150px'

                                />
                            </Grid2>
                            <Grid2 lg={3}>
                                <SelectField
                                    label="Trạng thái"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleInputChange}
                                    options={statusOptions}
                                    required
                                    placeholder="Chọn trạng thái"
                                    valueKey="id"
                                    labelKey="name"
                                    width='150px'
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>


                </Box>
                <Divider sx={{ borderColor: '#811919ff' }} />
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
                        <Grid2 container spacing={2}>
                            Thông tin về số seri, model, nhà sản xuất, năm sản xuất, v.v.
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <Grid2 container spacing={2}>
                            Các loại thông tin về cấu hình, cấu tạo, v.v.
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid2 container spacing={2}>
                            Các loại thông tin về cấu hình, cấu tạo, v.v.
                        </Grid2>
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