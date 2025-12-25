import { Fab } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import Dialog from '@mui/material/Dialog';
import { useState } from "react";
import SubCategoriesForm from "../SubCategoriesForm";

function AddSubCategoryButton() {
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
                aria-labelledby="subcategory-dialog-title"
                aria-describedby="subcategory-dialog-description"
                maxWidth="md"
                fullWidth
            >
                <SubCategoriesForm handleClose={handleClose} subCategory={null} />
            </Dialog>
        </>
    );
}

export default AddSubCategoryButton;
