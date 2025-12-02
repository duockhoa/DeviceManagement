import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useState } from "react";
import AddAssetForm from "../AddAssetForm";
import usePermissions from "../../../hooks/usePermissions";

function AddDeviceButton() {
    const { hasPermission } = usePermissions();
    const [open, setOpen] = useState(false);
    
    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    // Chỉ hiện button nếu có quyền assets.create
    if (!hasPermission('assets.create')) {
        return null;
    }

    return (
        <>
        <Fab color="primary" aria-label="add" onClick={handleOpen}>
            <AddIcon sx={{ fontSize: 30 }} />
        </Fab>
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            maxWidth="xl"

            fullWidth
        >
            <AddAssetForm handleClose={handleClose} />
        </Dialog>
    </>
    );
}

export default AddDeviceButton;
