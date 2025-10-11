import { useSelector, useDispatch } from "react-redux";
import { Box } from "@mui/system";
import { Typography } from "@mui/material";
import Button from "@mui/material/Button";
import { useEffect, useState } from "react";
import InputField from "../../AssetsComponent/InputField";
import SelectField from "../../AssetsComponent/SelectField";
import { createNewArea } from "../../../redux/slice/areaSlice";

function AreaForm({ handleClose }) {
    const dispatch = useDispatch();
    const plants = useSelector((state) => state.plants.plants);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        plant_id: plants.length > 0 ? plants[0].id : '',
        description: ''
    });
    const onChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };
    const onSubmit = (e) => {
        e.preventDefault();
        // Dispatch action to create area
        dispatch(createNewArea(formData));
    }
    return (
        <Box>
            hello
            <Button onClick={handleClose}>Close</Button>
            <Button variant="contained" onClick={onSubmit}>Thêm</Button>
        </Box>
    );
}

export default AreaForm;
