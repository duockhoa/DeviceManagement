import { useDispatch, useSelector } from "react-redux";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useState } from "react";
import InputField from "../../InputComponent/InputField";
import { createNewAssetCategory } from "../../../redux/slice/assetCategoriesSlice";
import Grid2 from "@mui/material/Unstable_Grid2";
import theme from "../../../theme";
import CloseIcon from '@mui/icons-material/Close';

function AssetCategoryForm({ handleClose }) {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.assetCategories.error);
    const loading = useSelector((state) => state.assetCategories.loading);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: ''
    });
    
    const onChange = (nameOrEvent, value) => {
        // SelectField/InputField passes (name, value)
        // Other components pass (event)
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
        await dispatch(createNewAssetCategory(formData));
        if (!loading && !error) {
            handleClose();
        }
    };
    
    return (
        <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold', p: 2, fontSize: "1.8rem", color: theme.palette.primary.main }}>
                THÊM NHÓM THIẾT BỊ
            </Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <Grid2 sx={{ p: 2 }} container spacing={2}>
                <Grid2 xs={12}>
                    <InputField
                        label="Mã nhóm"
                        name="code"
                        value={formData.code}
                        onChange={onChange}
                        required
                        placeholder="Nhập mã nhóm thiết bị (VD: MEC, ELEC)"
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <InputField
                        label="Tên nhóm"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        placeholder="Nhập tên nhóm thiết bị (VD: Cơ khí, Điện)"
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <InputField
                        label="Mô tả"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        placeholder="Nhập mô tả"
                        minLabelWidth="80px"
                        multiline
                        rows={3}
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

export default AssetCategoryForm;
