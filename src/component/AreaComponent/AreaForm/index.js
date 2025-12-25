import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/system";
import { ButtonGroup, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import InputField from "../../InputComponent/InputField";
import SelectField from "../../InputComponent/SelectField";
import { createNewArea } from "../../../redux/slice/areaSlice";
import Grid2 from "@mui/material/Unstable_Grid2";
import theme from "../../../theme";
import CloseIcon from '@mui/icons-material/Close';

function AreaForm({ handleClose, selectedPlantId }) {
    const dispatch = useDispatch();
    const plants = useSelector((state) => state.plants.plants);
    const error = useSelector((state) => state.areas.error);
    const loading = useSelector((state) => state.areas.loading);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        plant_id: selectedPlantId || '',
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
        // Dispatch action to create area
        await dispatch(createNewArea(formData));
        // Close the form dialog
        if (!loading && !error) {
            handleClose();
        }
    }
    return (
        <Box sx={{ p: 2 , pt:0 }}>
            <Typography variant="h6" sx={{ textAlign: 'center', fontWeight: 'bold' , p: 2 , fontSize: "1.8rem"  , color: theme.palette.primary.main }}>THÊM KHU VỰC</Typography>
            {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
            <Grid2  sx={{ p: 2  }} container spacing={2}>
                <Grid2 xs={12}>
                    <SelectField
                        label="Địa chỉ"
                        name="plant_id"
                        value={formData.plant_id}
                        onChange={onChange}
                        options={plants}
                        required
                        placeholder="Chọn địa chỉ"
                        valueKey="id"
                        labelKey="name"
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <InputField
                        label="Tên vị trí"
                        name="name"
                        value={formData.name}
                        onChange={onChange}
                        required
                        placeholder="Nhập tên khu vực"
                        minLabelWidth="80px"
                    />
                </Grid2>
                <Grid2 xs={12}>
                    <InputField
                        label="Mô tả vị trí"
                        name="description"
                        value={formData.description}
                        onChange={onChange}
                        required
                        placeholder="Nhập mô tả vị trí"
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

export default AreaForm;

     