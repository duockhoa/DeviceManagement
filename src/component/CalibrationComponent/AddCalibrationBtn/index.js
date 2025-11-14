import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import { useState } from "react";
import AddCalibrationForm from "../AddCalibrationForm";

function AddCalibrationButton() {
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    return (
        <>
            <Fab color="primary" aria-label="add" onClick={handleOpen}>
                <AddIcon sx={{ fontSize: 30 }} />
            </Fab>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="calibration-dialog-title"
                aria-describedby="calibration-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                <AddCalibrationForm handleClose={handleClose} />
            </Dialog>
        </>
    );
}

export default AddCalibrationButton;