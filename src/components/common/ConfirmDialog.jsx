import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Button,
    Alert
} from '@mui/material';

/**
 * ConfirmDialog component - simple confirmation dialog
 * 
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Close handler
 * @param {function} onConfirm - Confirm handler
 * @param {string} title - Dialog title
 * @param {string} message - Confirmation message
 * @param {string} severity - 'info' | 'warning' | 'error' | 'success'
 * @param {string} confirmText - Confirm button text (default: "Xác nhận")
 * @param {string} cancelText - Cancel button text (default: "Hủy")
 */
export default function ConfirmDialog({
    open,
    onClose,
    onConfirm,
    title,
    message,
    severity = 'info',
    confirmText = 'Xác nhận',
    cancelText = 'Hủy'
}) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="xs"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 3
                }
            }}
        >
            <DialogTitle sx={{ fontWeight: 600 }}>
                {title}
            </DialogTitle>
            
            <DialogContent>
                {severity && (
                    <Alert severity={severity} sx={{ mb: 2 }}>
                        <DialogContentText sx={{ color: 'inherit' }}>
                            {message}
                        </DialogContentText>
                    </Alert>
                )}
                {!severity && (
                    <DialogContentText>
                        {message}
                    </DialogContentText>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2 }}>
                <Button 
                    onClick={onClose}
                    variant="outlined"
                    sx={{ textTransform: 'none' }}
                >
                    {cancelText}
                </Button>
                <Button
                    onClick={handleConfirm}
                    variant="contained"
                    color={severity === 'error' ? 'error' : 'primary'}
                    sx={{ textTransform: 'none' }}
                >
                    {confirmText}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
