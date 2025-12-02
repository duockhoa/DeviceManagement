import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import { useState } from "react";
import { useSelector } from "react-redux";
import AddMaintenanceForm from "../AddMaintenanceForm";
import usePermissions from "../../../hooks/usePermissions";

function AddMaintenanceButton({ onReload }) {
    const [open, setOpen] = useState(false);
    const user = useSelector((state) => state.user.userInfo);
    const { hasPermission } = usePermissions();

    const handleClose = () => {
        setOpen(false);
    };

    const handleOpen = () => {
        setOpen(true);
    };

    // Không hiển thị nút nếu user không có quyền
    if (!hasPermission('maintenance.create')) {
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
                aria-labelledby="maintenance-dialog-title"
                aria-describedby="maintenance-dialog-description"
                maxWidth="lg"
                fullWidth
            >
                <AddMaintenanceForm handleClose={handleClose} onReload={onReload} />
            </Dialog>
        </>
    );
}

export default AddMaintenanceButton;