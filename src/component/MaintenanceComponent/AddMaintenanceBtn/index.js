import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import { useState } from "react";
import AddMaintenanceForm from "../AddMaintenanceForm";

function AddMaintenanceButton() {
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
                aria-labelledby="maintenance-dialog-title"
                aria-describedby="maintenance-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                <AddMaintenanceForm handleClose={handleClose} />
            </Dialog>
        </>
    );
}

export default AddMaintenanceButton;