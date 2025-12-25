import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import InputField from "../../InputComponent/InputField";
import SelectField from "../../InputComponent/SelectField";
import { 
    createNewAssetSubCategory, 
    updateExistingAssetSubCategory 
} from "../../../redux/slice/assetSubCategoriesSlice";
import Grid2 from "@mui/material/Unstable_Grid2";
import theme from "../../../theme";
import CloseIcon from '@mui/icons-material/Close';

function AddSubCategoriesForm({ handleClose, subCategory }) {
    const dispatch = useDispatch();
    const assetCategories = useSelector((state) => state.assetCategories.categories);
    const error = useSelector((state) => state.assetCategories.error);
    const loading = useSelector((state) => state.assetCategories.loading);
    
    const isEditMode = !!subCategory;
    
    const [formData, setFormData] = useState({
        code: '',
        category_id: '',
        name: '',
        description: ''
    });

    useEffect(() => {
        if (subCategory) {
            setFormData({
                code: subCategory.code || '',
                category_id: subCategory.category_id || '',
                name: subCategory.name || '',
                description: subCategory.description || ''
            });
        }
    }, [subCategory]);
    
    const onChange = (nameOrEvent, value) => {
        if (typeof nameOrEvent === 'string') {
            setFormData({
                ...formData,
                [nameOrEvent]: value
            });
        } else {
            const event = nameOrEvent;
            setFormData({
                ...formData,
                [event.target.name]: event.target.value
            });
        }
    };

    const onSubmit = async(e) => {
        e.preventDefault();
        
        try {
            if (isEditMode) {
                await dispatch(updateExistingAssetSubCategory({
                    id: subCategory.id,
                    data: formData
                })).unwrap();
            } else {
                await dispatch(createNewAssetSubCategory(formData)).unwrap();
            }
            
            handleClose();
        } catch (error) {
            console.error('Error saving subcategory:', error);
        }
    };

    return (
        <Box sx={{ p: 2 , pt:0 }}>
            <Typography variant="h6" sx={{ 
                textAlign: 'center', 
                fontWeight: 'bold', 
                p: 2, 
                fontSize: "1.8rem", 
                color: theme.palette.primary.main 
            }}>
                {isEditMode ? 'SỬA LOẠI THIẾT BỊ' : 'THÊM LOẠI THIẾT BỊ'}
            </Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <Grid2 sx={{ p: 2 }} container spacing={2}>
                <Grid2 xs={12}>
                    <InputField
                        label="Mã loại"
                        name="code"
                        value={formData.code}
                        onChange={onChange}
                        required
                        placeholder="Nhập mã loại thiết bị (VD: HVAC, MEC...)"
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <SelectField
                        label="Nhóm thiết bị"
                        name="category_id"
                        value={formData.category_id}
                        onChange={onChange}
                        options={assetCategories}
                        required
                        placeholder="Chọn nhóm thiết bị"
                        valueKey="id"
                        labelKey="name"
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <InputField
                        label="Tên loại thiết bị"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        placeholder="Nhập tên loại thiết bị, vd: HVAC, Máy chiếu..."
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <InputField
                        label="Mô tả loại thiết bị"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Nhập mô tả loại thiết bị"
                        minLabelWidth="80px"
                    />
                </Grid2>
            </Grid2>
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
                    startIcon={<CloseIcon />}
                    size="medium"
                    color="error"
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    disabled={loading}
                    size="medium"
                    sx={{ backgroundColor: theme.palette.primary.main }}
                >
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}

export default AddSubCategoriesForm;
