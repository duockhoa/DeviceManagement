import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab, Dialog , Paper, Grid } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import { Stack, width } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputField from '../../InputComponent/InputField';
import SelectField from '../../InputComponent/SelectField';
import { createAsset } from "../../../redux/slice/assetsSlice"
import theme from '../../../theme';
import AreaForm from '../../AreaComponent/AreaForm';
import AddSubCategoriesForm from '../../SubCategories/SubCategoriesForm';
import InputDate from '../../InputComponent/InputDate';
import InputNumber from '../../InputComponent/InputNumber';
import InputTable from '../../InputComponent/InputTable/Index';
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
        generalInfo: null,
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

    // Thêm state để quản lý data của table
const [componentsData, setComponentsData] = useState([
  {
    id: 1,
    component_name: "",
    specification: "",
    quantity: "",
    unit: "",
    remarks: "",
  }
]);

// Handle thay đổi data từ InputTable
const handleComponentsChange = (updatedData) => {
  console.log('Components data changed:', updatedData);
  setComponentsData(updatedData);
};

    const handleSave = () => {
        const submitData = {
            ...formData,
            components: componentsData // Thêm data từ table
          };
        dispatch(createAsset(submitData));
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
        setFormComponent(() => AddSubCategoriesForm);
        setFormOpen(true);
   }
   const handleCloseForm = () => {
       setFormOpen(false);
   };
   // Thêm thông tin chung
    const handleChangeGeneralInfo = (event) => {
         // Logic thêm thông tin chung
        const value = event.target.value;
        const name = event.target.name;
        if (!formData.generalInfo) {
            setFormData(prev => ({
                ...prev,
                generalInfo: {}
            }));
        }
        setFormData(prev => ({
            ...prev,
            generalInfo: {
                ...prev.generalInfo,
                [name]: value
            }
        }));
    };

    // Chuẩn bị dữ liệu cho bảng thành phần cấu tạo
    const columns = [
  { field: 'component_name', headerName: 'Tên thành phần', width: 300, editable: true },
  { field: 'specification', headerName: 'Thông số' , width: 300, type: 'text', editable: true },
  {
    field: 'quantity',
    headerName: 'Số lượng',
    type: 'number',
    width: 180,
    editable: true,
  },
  {
    field: 'unit',
    headerName: 'Đơn vị',
    type: 'singleSelect',
    valueOptions: ['Cái', 'Bộ', 'Chiếc', 'Con', 'Ống', 'Khác'],
    width: 120,
    editable: true,
  },
    {
    field: 'remarks',
    headerName: 'Ghi chú',
    type: 'text',
    width: 300,
    editable: true,
  },
];

const rows = [
  {
    id: 1,
    name: "",
    specifications: "",
    quantity: "",
    unit: "",
    remarks: "",
  },

];
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
                <Box  sx={{flex: 1 , display: 'flex' , backgroundColor: '#f5f5f5'  }}>
                    <Box  sx={{ m: 2, border: '1px solid #aaa', display: 'flex', flexDirection: 'column', borderRadius: 1 , flex: 1  , backgroundColor: '#fff' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' , backgroundColor: '#e4eefdff' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                            <Tab label="Thông tin chung" {...a11yProps(0)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Thành phần cấu tạo" {...a11yProps(1)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Thông số kỹ thuật" {...a11yProps(2)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Vật tư tiêu hao" {...a11yProps(3)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                            <Tab label="Tài liệu đính kèm" {...a11yProps(4)} sx={{  fontWeight: "bold" , fontSize: "10px"}}  />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        <Grid2 container spacing={2}>
                            <Grid2 xs={12} md={6}>
                                <InputNumber
                                    label="Năm sản xuất"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="manufacture_year"
                                    value={formData.generalInfo ? formData.generalInfo.manufacture_year : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập năm sản xuất"
                                />
                            </Grid2>
                            <Grid2 xs={12} md={6}>
                                <InputField
                                    label="Nhà sản xuất"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="manufacturer"
                                    value={formData.generalInfo ? formData.generalInfo.manufacturer : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập nhà sản xuất"
                                />
                            </Grid2>
                            <Grid2 xs={12} md={6}>
                                <InputField
                                    label="Nước sản xuất"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="country_of_origin"
                                    value={formData.generalInfo ? formData.generalInfo.country_of_origin : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập nước sản xuất"
                                />
                            </Grid2>
                            <Grid2 xs={12} md={6}>
                                <InputField
                                    label="Nhà cung cấp"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="supplier"
                                    value={formData.generalInfo ? formData.generalInfo.supplier : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập nhà cung cấp"
                                />
                            </Grid2>
                            <Grid2 xs={12} md={6}>
                                <InputField
                                    label="Model"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="model"
                                    value={formData.generalInfo ? formData.generalInfo.model : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập model"
                                />
                            </Grid2>
                            <Grid2 xs={12} md={6}>
                                <InputField
                                    label="Số serial"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="serial_number"
                                    value={formData.generalInfo ? formData.generalInfo.serial_number : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập số serial"
                                />
                            </Grid2>
                            <Grid2 xs={12} md={6}>
                                <InputNumber
                                    label="Số tháng BH"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="warranty_period_months"
                                    value={formData.generalInfo ? formData.generalInfo.warranty_period_months : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập thời gian bảo hành (tháng)"
                                />
                            </Grid2>

                            <Grid2 xs={12} md={6}>
                                <InputDate
                                    label="Ngày hết BH"
                                    minLabelWidth='80px'
                                    width='400px'
                                    name="warranty_expiration_date"
                                    value={formData.generalInfo ? formData.generalInfo.warranty_expiration_date : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập ngày hết bảo hành"
                                />
                            </Grid2>

                            <Grid2 xs={12} >
                                <InputField
                                    label="Mô tả"
                                    minLabelWidth='80px'
                                    fullWidth
                                    multiline
                                    rows={5}
                                    name="description"
                                    value={formData.generalInfo ? formData.generalInfo.description : ''}
                                    onChange={handleChangeGeneralInfo}
                                    placeholder="Nhập mô tả"
                                />
                            </Grid2>
                            
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        <Grid2 container spacing={2}>
                          <Grid2 xs={12}>
                            <InputTable 
                              initialRows={componentsData}
                              columns={columns} 
                              showRowNumber={true}
                              showAddButton={true}
                              onDataChange={handleComponentsChange}
                            />
                          </Grid2>
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2} >
                        <Grid2 container spacing={2} >
                            Các thành bộ phận của thiết bị
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={3}>
                        <Grid2 container spacing={2} >
                            Các vật tư tiêu hao , doăng cao su, dầu nhớt, đơn vị tính đơn giá....
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={4}>
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