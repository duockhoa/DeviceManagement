import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

function AddDeviceButton() {
    return (
        <Fab color="primary" aria-label="add">
            <AddIcon sx={{ fontSize: 30 }} />
        </Fab>
    );
}

export default AddDeviceButton;
