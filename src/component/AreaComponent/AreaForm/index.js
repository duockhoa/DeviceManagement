import { useSelector } from "react-redux";
import { Box  } from "@mui/system";
import { Typography } from "@mui/material";
function AreaForm() {
    const plants = useSelector((state) => state.plants.plants);
    return (
        <Box>
            <Typography variant="h2">Area Form</Typography>
        </Box>
    );
}

export default AreaForm;
