import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab, Dialog , Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
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
import AreaForm from '../../AreaComponent/AreaForm';
import AddSubCategoriesForm from '../../SubCategories/SubCategoriesForm';
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
    const areas = useSelector((state) => state.areas.areas);
    const plants = useSelector((state) => state.plants.plants);
    const departments = useSelector((state) => state.departments.departments);
    const assets = useSelector((state) => state.assets.assets);
    const assetsSubCategories = useSelector((state) => state.assetSubCategories.subCategories);

    const [tabValue, setTabValue] = useState(0);
    const [FormComponent, setFormComponent] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [areaOptions, setAreaOptions] = useState(areas);
    const [subCategoryOptions, setSubCategoryOptions] = useState(assetsSubCategories);

    // Form state cho thông tin chung
    const [formData, setFormData] = useState({
        asset_code: '',
        name: '',
        category_id: '',
        team_id: '',
        area_id: '',
        plant_id: '',
        sub_category_id: '',
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
    // Cập nhật danh sách khu vực khi có sự thay đổi
    useEffect(() => {
        if (formData.plant_id) {
            const filteredAreas = areas.filter(area => area.plant_id === formData.plant_id);
            setAreaOptions(filteredAreas);
        } else {
            setAreaOptions(areas);
        }
    }, [formData.plant_id, areas]);

    useEffect(() => {
        if (formData.category_id) {
            const filteredSubCategories = assetsSubCategories.filter(subcategory => subcategory.category_id === formData.category_id);
            setSubCategoryOptions(filteredSubCategories);
        } else {
            setSubCategoryOptions(assetsSubCategories);
        }
    }, [formData.category_id, assetsSubCategories]);

    // validate form
    const isFormValid = () => {
        return formData.asset_code && formData.name && formData.category_id && formData.team_id && formData.area_id ;
    };
   // Thêm khu vực mới
   const handleAddNewArea = () => {
       // Logic thêm khu vực mới
        setFormComponent(() => AreaForm);
        setFormOpen(true);
       console.log('Thêm khu vực mới');
   };

    // Thêm loại thiết bị mới
    const handleAddNewSubCategory = () => {
        // Logic thêm loại thiết bị mới
        import('../../SubCategories/SubCategoriesForm').then((module) => {
            setFormComponent(() => module.default);
            setFormOpen(true);
        });
   }
   const handleCloseForm = () => {
       setFormOpen(false);
   };
    return (
        <Box sx={{ width: "100%", height: "90vh", display: 'flex', flexDirection: 'column'  , backgroundColor: '#f8f8f8' }}>
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
                    THÔNG TIN THIẾT BỊ
                </Typography>

                <IconButton onClick={handleClose} sx={{ color: '#fff' , p: 0.5  }}>
                    <CloseIcon   sx={{fontSize: "1.8rem"}}/>
                </IconButton>
            </Box>

            {/* Form Content */}
            <Stack  sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Nhập thông tin chung */}
                <Box sx={{ p: 3, borderRadius: 1  ,backgroundColor: '#fff' , display: "flex" }}>
                    <Grid2 container  sx={{ mb: 2, alignItems: 'center'  }}>
                        <Grid2 container spacing={2}>
                            <Grid2 lg={1.5} >
                                <InputField
                                    label="Mã"
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
                                    label="Nhóm"
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

                            <Grid2 lg={1.5}>

                            </Grid2>
                            <Grid2 lg={2}>
                                <SelectField
                                    label="Loại TB"
                                    name="sub_category_id"
                                    value={formData.sub_category_id}
                                    onChange={handleInputChange}
                                    options={subCategoryOptions}
                                    required
                                    placeholder="Chọn loại TB"
                                    valueKey="id"
                                    labelKey="name"
                                    width='150px'
                                    showAddNew
                                    addNewText='Thêm mới'
                                    onAddNew={handleAddNewSubCategory}

                                />
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
                            <Grid2 lg={2} sx={{ display: 'flex', alignItems: 'center' }}>

                                <SelectField
                                    label="Địa chỉ"
                                    name="plant_id"
                                    value={formData.plant_id}
                                    onChange={handleInputChange}
                                    options={plants}
                                    required
                                    placeholder="Chọn địa chỉ"
                                    valueKey="id"
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
                                    options={areaOptions}
                                    required
                                    placeholder="Chọn vị trí"
                                    valueKey="id"
                                    labelKey="name"
                                    width='150px'
                                    showAddNew
                                    addNewText='Thêm mới'
                                    onAddNew={handleAddNewArea}

                                />
                            </Grid2>
                            <Grid2 lg={2}>
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
                                    width='140px'
                                />
                            </Grid2>
                        </Grid2>
                    </Grid2>
                    <Box sx={{p:1 , border: "1px dashed #aaa" , minWidth: "100px" , height: "100%" }}></Box>


                </Box>
                <Divider sx={{ borderColor: theme.palette.grey[900]  }} />
                {/* Thông tin chi tiết */}
                <Box  sx={{flex: 1 , display: 'flex' , backgroundColor: '#f5f5f5' }}>
                    <Box  sx={{ m: 2, border: '1px solid #aaa', display: 'flex', flexDirection: 'column', borderRadius: 1 , flex: 1  , backgroundColor: '#fff' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' , backgroundColor: '#e4eefdff' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                            <Tab label="Thông tin chung" {...a11yProps(0)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Thông số kỹ thuật" {...a11yProps(1)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Thành phần cấu tạo" {...a11yProps(2)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Vật tư tiêu hao" {...a11yProps(3)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Bảo trì & Bảo dưỡng" {...a11yProps(4)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Tài liệu đính kèm" {...a11yProps(5)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid2 container spacing={2}>
                            Thông tin về số seri, model, nhà sản xuất, năm sản xuất, v.v.
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <Grid2 container spacing={2}>
                            Các loại thông tin về kỹ thuật như công suất, điện áp, tần số, v.v.
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                        <Grid2 container spacing={2}>
                            Các thành bộ phận của thiết bị
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={3}>
                        <Grid2 container spacing={2}>
                            Các vật tư tiêu hao , doăng cao su, dầu nhớt, đơn vị tính đơn giá....
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={4}>
                        <Grid2 container spacing={2}>
                            Các loại thông tin về bảo trì, bảo dưỡng, v.v.
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={5}>
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
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    sx={{
                        fontSize: '1.2rem',
                        minWidth: 120,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#1565c0'
                        }
                    }}
                    disabled={!isFormValid()}
                >
                    Lưu
                </Button>
            </Box>
            <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
               <FormComponent handleClose={handleCloseForm} />
            </Dialog>
        </Box >
    );
}

export default AddAssetForm;