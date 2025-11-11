import { Dialog, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function PreviewFile({ open, file, onClose }) {
    if (!file) return null;

    const fileUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/file/getinline?filepath=${encodeURIComponent(file.file_path)}`;
    const downloadUrl = `${process.env.REACT_APP_BACKEND_URL}/api/v1/file/get?filepath=${encodeURIComponent(file.file_path)}`;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xl" fullWidth>
            <Box sx={{ position: 'absolute', right: 8, top: 8, display: 'flex', gap: 1 }}>
                <Button
                    variant="contained"
                    color="primary"
                    href={downloadUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    size="small"
                >
                    Tải xuống
                </Button>
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </Box>
            <Box sx={{ p: 2, minHeight: 700, height: '90vh' }}>
                <Typography sx={{ mb: 2, fontWeight: 600 }}>{file.file_name}</Typography>
                {file.file_name.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                    <img
                        src={fileUrl}
                        alt={file.file_name}
                        style={{ maxWidth: '100%', maxHeight: '70vh' }}
                    />
                ) : file.file_name.match(/\.pdf$/i) ? (
                    <iframe
                        src={fileUrl}
                        title={file.file_name}
                        width="100%"
                        height="600px"
                        style={{ minHeight: '80vh' }}
                    />
                ) : (
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            height: '70vh',
                        }}
                    >
                        <Typography sx={{ mb: 3, fontSize: 22, fontWeight: 600 }}>
                            Không hỗ trợ xem trước loại file này.
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            href={downloadUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            size="large"
                            sx={{ fontSize: 18, px: 4, py: 2 }}
                        >
                            Tải xuống
                        </Button>
                    </Box>
                )}
            </Box>
        </Dialog>
    );
}