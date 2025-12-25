import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

/**
 * ActionDialog component - reusable dialog wrapper for action forms
 * 
 * @param {boolean} open - Dialog open state
 * @param {function} onClose - Close handler
 * @param {string} title - Dialog title
 * @param {string} icon - Optional emoji icon
 * @param {ReactNode} children - Dialog content (form components)
 * @param {function} onSubmit - Optional submit handler (if not handled by children)
 * @param {string} confirmText - Submit button text (default: "Xác nhận")
 * @param {boolean} isDestructive - Use error color for submit button
 * @param {boolean} hideActions - Hide default action buttons
 */
export default function ActionDialog({
    open,
    onClose,
    title,
    icon,
    children,
    onSubmit,
    confirmText = 'Xác nhận',
    isDestructive = false,
    hideActions = false
}) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    boxShadow: 3
                }
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                pb: 2
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon && <Typography variant="h5">{icon}</Typography>}
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        {title}
                    </Typography>
                </Box>
                <IconButton 
                    onClick={onClose}
                    size="small"
                    sx={{ color: 'text.secondary' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                {children}
            </DialogContent>

            {!hideActions && (
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button 
                        onClick={onClose} 
                        variant="outlined"
                        sx={{ textTransform: 'none' }}
                    >
                        Hủy
                    </Button>
                    {onSubmit && (
                        <Button
                            type="submit"
                            form="action-form"
                            variant="contained"
                            color={isDestructive ? 'error' : 'primary'}
                            sx={{ textTransform: 'none' }}
                        >
                            {confirmText}
                        </Button>
                    )}
                </DialogActions>
            )}
        </Dialog>
    );
}
