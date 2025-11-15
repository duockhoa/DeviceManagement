import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab, Dialog , Paper, Grid, CardMedia, List, ListItem, ListItemIcon, ListItemText, ListItemSecondaryAction, Chip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid2 from '@mui/material/Unstable_Grid2';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import DeleteIcon from '@mui/icons-material/Delete';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import DescriptionIcon from '@mui/icons-material/Description';
import { Stack, width } from '@mui/system';
import { useSelector, useDispatch } from 'react-redux';
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import InputField from '../../InputComponent/InputField';
import SelectField from '../../InputComponent/SelectField';
import { updateExistingAsset } from "../../../redux/slice/assetsSlice"
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

function EditAssetForm({ handleClose, assetData }) {
    console.log('EditAssetForm rendered, assetData:', assetData);
    const dispatch = useDispatch();
    const assetCategories = useSelector((state) => state.assetCategories.categories);
    const areas = useSelector((state) => state.areas.areas);
    const plants = useSelector((state) => state.plants.plants);
    const departments = useSelector((state) => state.departments.departments);
    const assetsSubCategories = useSelector((state) => state.assetSubCategories.subCategories);

    const [tabValue, setTabValue] = useState(0);
    const [FormComponent, setFormComponent] = useState(null);
    const [formOpen, setFormOpen] = useState(false);
    const [areaOptions, setAreaOptions] = useState(areas);
    const [subCategoryOptions, setSubCategoryOptions] = useState(assetsSubCategories);

    // Form state - khởi tạo từ assetData với mapping đúng
    const [formData, setFormData] = useState({
        asset_code: assetData?.asset_code || '',
        name: assetData?.name || '',
        category_id: assetData?.category_id || '',
        team_id: assetData?.team_id || assetData?.Department?.name || '',
        area_id: assetData?.area_id || '',
        plant_id: assetData?.plant_id || assetData?.Area?.plant_id || '',
        sub_category_id: assetData?.sub_category_id || '',
        status: assetData?.status || 'active',
        generalInfo: assetData?.GeneralInfo ? {
            manufacture_year: assetData.GeneralInfo.manufacture_year || '',
            manufacturer: assetData.GeneralInfo.manufacturer || '',
            country_of_origin: assetData.GeneralInfo.country_of_origin || '',
            model: assetData.GeneralInfo.model || '',
            serial_number: assetData.GeneralInfo.serial_number || '',
            warranty_period_months: assetData.GeneralInfo.warranty_period_months || '',
            warranty_expiration_date: assetData.GeneralInfo.warranty_expiry_date || '',
            supplier: assetData.GeneralInfo.supplier || '',
            description: assetData.GeneralInfo.description || ''
        } : (assetData?.generalInfo || null),
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

    const handleInputChange = (eventOrName, valueOrUndefined) => {
        // Kiểm tra xem có phải SelectField (truyền name, value) hay Input field thông thường
        let name, value;
        
        if (typeof eventOrName === 'string') {
            // SelectField: (name, value)
            name = eventOrName;
            value = valueOrUndefined;
        } else {
            // Input field thông thường: (event)
            name = eventOrName.target.name;
            value = eventOrName.target.value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Thêm state để quản lý data của table - khởi tạo từ assetData với mapping đúng
const [componentsData, setComponentsData] = useState(() => {
  const components = assetData?.Components || assetData?.components;
  if (components && components.length > 0) {
    return components.map((comp, index) => ({
      id: comp.id || index + 1,
      component_name: comp.component_name || '',
      specification: comp.specification || '',
      quantity: comp.quantity || '',
      unit: comp.unit || '',
      remarks: comp.remarks || ''
    }));
  }
  return [{
    id: 1,
    component_name: "",
    specification: "",
    quantity: "",
    unit: "",
    remarks: "",
  }];
});

// State cho thông số kỹ thuật
const [specificationsData, setSpecificationsData] = useState(() => {
  const specs = assetData?.Specifications || assetData?.specifications;
  if (specs && specs.length > 0) {
    return specs.map((spec, index) => ({
      id: spec.id || index + 1,
      parameter_name: spec.parameter_name || '',
      parameter_value: spec.parameter_value || '',
      unit: spec.unit || '',
      min_value: spec.min_value || '',
      max_value: spec.max_value || '',
      remarks: spec.remarks || ''
    }));
  }
  return [{
    id: 1,
    parameter_name: "",
    parameter_value: "",
    unit: "",
    min_value: "",
    max_value: "",
    remarks: "",
  }];
});

// State cho vật tư tiêu hao
const [consumablesData, setConsumablesData] = useState(() => {
  const consumables = assetData?.Consumables || assetData?.consumables;
  if (consumables && consumables.length > 0) {
    return consumables.map((cons, index) => ({
      id: cons.id || index + 1,
      item_name: cons.item_name || '',
      specification: cons.specification || '',
      unit: cons.unit || '',
      replacement_cycle: cons.replacement_cycle || '',
      unit_price: cons.unit_price || '',
      supplier: cons.supplier || '',
      remarks: cons.remarks || ''
    }));
  }
  return [{
    id: 1,
    item_name: "",
    specification: "",
    unit: "",
    replacement_cycle: "",
    unit_price: "",
    supplier: "",
    remarks: "",
  }];
});

// State cho ảnh thiết bị
const [deviceImage, setDeviceImage] = useState(null);
const [imagePreview, setImagePreview] = useState(assetData?.image_url || assetData?.ImageUrl || null);

// State cho tài liệu đính kèm
const [attachedFiles, setAttachedFiles] = useState(() => {
  const attachments = assetData?.Attachments || assetData?.attachments;
  if (attachments && attachments.length > 0) {
    return attachments.map((file, index) => ({
      id: file.id || Date.now() + index,
      name: file.file_name || file.name || '',
      size: file.file_size || file.size || 0,
      type: file.file_type || file.type || '',
      url: file.file_url || file.url || ''
    }));
  }
  return [];
});

// Handle thay đổi data từ InputTable
const handleComponentsChange = (updatedData) => {
  console.log('Components data changed:', updatedData);
  setComponentsData(updatedData);
};

// Handle thay đổi data từ SpecificationTable
const handleSpecificationsChange = (updatedData) => {
  console.log('Specifications data changed:', updatedData);
  setSpecificationsData(updatedData);
};

// Handle thay đổi data từ ConsumableTable
const handleConsumablesChange = (updatedData) => {
  console.log('Consumables data changed:', updatedData);
  setConsumablesData(updatedData);
};

// Handle upload ảnh
const handleImageSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type.startsWith('image/')) {
      setDeviceImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Vui lòng chọn file ảnh (JPG, PNG, GIF)');
    }
  }
};

// Handle xóa ảnh
const handleRemoveImage = () => {
  setDeviceImage(null);
  setImagePreview(null);
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

// Handle xóa file
const handleRemoveFile = (fileId) => {
  setAttachedFiles(prev => prev.filter(file => file.id !== fileId));
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

    const handleSave = () => {
        const submitData = {
            ...formData,
            components: componentsData,
            specifications: specificationsData,
            consumables: consumablesData,
            deviceImage: deviceImage,
            attachedFiles: attachedFiles
        };
        dispatch(updateExistingAsset({ 
            id: assetData.id, 
            data: submitData 
        }));
        handleClose();
    };

    // Không cần tự động tạo mã khi edit
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
    const handleChangeGeneralInfo = (name, value) => {
         // Logic thêm thông tin chung
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

// Chuẩn bị dữ liệu cho bảng thông số kỹ thuật
const specColumns = [
  { field: 'parameter_name', headerName: 'Tên thông số', width: 250, editable: true },
  { field: 'parameter_value', headerName: 'Giá trị', width: 150, editable: true },
  {
    field: 'unit',
    headerName: 'Đơn vị',
    type: 'singleSelect',
    valueOptions: ['V', 'A', 'W', 'Hz', 'mm', 'cm', 'm', 'kg', '℃', 'bar', 'rpm', 'Khác'],
    width: 120,
    editable: true,
  },
  {
    field: 'min_value',
    headerName: 'Giá trị min',
    type: 'number',
    width: 140,
    editable: true,
  },
  {
    field: 'max_value',
    headerName: 'Giá trị max',
    type: 'number',
    width: 140,
    editable: true,
  },
  {
    field: 'remarks',
    headerName: 'Ghi chú',
    type: 'text',
    width: 200,
    editable: true,
  },
];

// Chuẩn bị dữ liệu cho bảng vật tư tiêu hao
const consumableColumns = [
  { field: 'item_name', headerName: 'Tên vật tư', width: 200, editable: true },
  { field: 'specification', headerName: 'Thông số kỹ thuật', width: 180, editable: true },
  {
    field: 'unit',
    headerName: 'Đơn vị',
    type: 'singleSelect',
    valueOptions: ['Lít', 'ml', 'Cái', 'Bộ', 'Kg', 'g', 'm', 'cm', 'Khác'],
    width: 100,
    editable: true,
  },
  {
    field: 'replacement_cycle',
    headerName: 'Chu kỳ thay (giờ)',
    type: 'number',
    width: 150,
    editable: true,
  },
  {
    field: 'unit_price',
    headerName: 'Đơn giá (VNĐ)',
    type: 'number',
    width: 140,
    editable: true,
  },
  { field: 'supplier', headerName: 'Nhà cung cấp', width: 160, editable: true },
  {
    field: 'remarks',
    headerName: 'Ghi chú',
    type: 'text',
    width: 150,
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
                    CHỈNH SỬA THIẾT BỊ
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
                    
                    {/* Image Upload Section */}
                    <Box sx={{
                        p: 1, 
                        border: "2px dashed #aaa", 
                        minWidth: "200px", 
                        height: "240px",
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#fafafa',
                        borderRadius: 1
                    }}>
                        {imagePreview ? (
                            // Hiển thị ảnh đã chọn
                            <Box sx={{ position: 'relative', width: '100%', height: '100%' }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: '100%',
                                        height: '180px',
                                        objectFit: 'cover',
                                        borderRadius: 1
                                    }}
                                    image={imagePreview}
                                    alt="Device preview"
                                />
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    mt: 1,
                                    gap: 1
                                }}>
                                    <Button
                                        size="small"
                                        variant="outlined"
                                        component="label"
                                        startIcon={<PhotoCameraIcon />}
                                        sx={{ fontSize: '0.75rem', flex: 1 }}
                                    >
                                        Đổi ảnh
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                        />
                                    </Button>
                                    <IconButton
                                        size="small"
                                        onClick={handleRemoveImage}
                                        sx={{ color: '#f44336' }}
                                    >
                                        <DeleteIcon fontSize="small" />
                                    </IconButton>
                                </Box>
                            </Box>
                        ) : (
                            // Hiển thị khi chưa có ảnh
                            <Box sx={{ 
                                textAlign: 'center',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                height: '100%'
                            }}>
                                <PhotoCameraIcon sx={{ fontSize: 48, color: '#ccc', mb: 2 }} />
                                <Typography variant="body2" sx={{ color: '#666', mb: 2 }}>
                                    Ảnh thiết bị
                                </Typography>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    startIcon={<PhotoCameraIcon />}
                                    sx={{ fontSize: '0.8rem' }}
                                >
                                    Chọn ảnh
                                    <input
                                        type="file"
                                        hidden
                                        accept="image/*"
                                        onChange={handleImageSelect}
                                    />
                                </Button>
                            </Box>
                        )}
                    </Box>


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
                          <Grid2 xs={12}>
                            <InputTable 
                              initialRows={specificationsData}
                              columns={specColumns} 
                              showRowNumber={true}
                              showAddButton={true}
                              onDataChange={handleSpecificationsChange}
                            />
                          </Grid2>
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={3}>
                        <Grid2 container spacing={2} >
                          <Grid2 xs={12}>
                            <InputTable 
                              initialRows={consumablesData}
                              columns={consumableColumns} 
                              showRowNumber={true}
                              showAddButton={true}
                              onDataChange={handleConsumablesChange}
                            />
                          </Grid2>
                        </Grid2>
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={4}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            {/* Upload Area */}
                            <Box sx={{
                                border: '2px dashed #ccc',
                                borderRadius: 1,
                                p: 3,
                                textAlign: 'center',
                                backgroundColor: '#fafafa',
                                cursor: 'pointer',
                                '&:hover': {
                                    borderColor: '#1976d2',
                                    backgroundColor: '#f0f7ff'
                                }
                            }}>
                                <AttachFileIcon sx={{ fontSize: 48, color: '#ccc', mb: 1 }} />
                                <Typography variant="h6" sx={{ color: '#666', mb: 1 }}>
                                    Kéo thả file hoặc click để chọn
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#999', mb: 2 }}>
                                    Hỗ trợ: PDF, DOC, DOCX, JPG, PNG, GIF (tối đa 10MB)
                                </Typography>
                                <Button
                                    variant="contained"
                                    component="label"
                                    startIcon={<AttachFileIcon />}
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
                                    backgroundColor: '#fff'
                                }}>
                                    <Typography variant="h6" sx={{ p: 2, borderBottom: '1px solid #ddd' }}>
                                        Tài liệu đính kèm ({attachedFiles.length})
                                    </Typography>
                                    <List>
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
                                                                label={file.type.split('/')[1].toUpperCase()} 
                                                                size="small" 
                                                                color="primary"
                                                                variant="outlined"
                                                            />
                                                        </Box>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    <IconButton 
                                                        edge="end" 
                                                        onClick={() => handleRemoveFile(file.id)}
                                                        sx={{ color: '#f44336' }}
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                        ))}
                                    </List>
                                </Box>
                            )}
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
                    Cập nhật
                </Button>
            </Box>
            <Dialog open={formOpen} onClose={handleCloseForm} maxWidth="md" fullWidth>
               {FormComponent && <FormComponent handleClose={handleCloseForm} />}
            </Dialog>
        </Box >
    );
}

export default EditAssetForm;