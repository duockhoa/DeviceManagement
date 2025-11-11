import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography } from '@mui/material';

// Component dialog xác nhận xóa bảo trì
function DeleteConfirmDialog({ open, onClose, onConfirm, itemName }) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>
                Xác nhận xóa
            </DialogTitle>
            <DialogContent>
                <Typography>
                    Bạn có chắc chắn muốn xóa lịch bảo trì cho thiết bị "{itemName}" không?
                </Typography>
                <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                    Lưu ý: Hành động này không thể hoàn tác!
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>
                    Hủy
                </Button>
                <Button onClick={onConfirm} variant="contained" color="error">
                    Xóa
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default DeleteConfirmDialog;