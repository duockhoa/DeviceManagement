import Box from '@mui/material/Box';
import { error, logo } from '../../assets/images';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import KeyboardReturnIcon from '@mui/icons-material/KeyboardReturn';
function Error() {
    return (
        <Box sx={{ height: '100vh', display: 'flex' }}>
            <Stack margin="auto" flexDirection="row" alignItems="center">
                <Stack padding={5}>
                    <img src={logo} style={{ width: 180 }}></img>
                    <Typography fontSize={50} color="error">
                        404 not found
                    </Typography>
                    <Typography fontSize={30}>Có gì đó không ổn, Trang này chưa tồn tại !!!</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        href="/"
                        startIcon={<KeyboardReturnIcon />}
                        sx={{
                            fontSize: 16,
                            padding: '10px 20px',
                            maxWidth: 300,
                            borderRadius: '999px', // Bo góc tròn
                            textTransform: 'none', // Không viết hoa chữ
                            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)', // Hiệu ứng đổ bóng
                            '&:hover': {
                                backgroundColor: '#1976d2', // Màu khi hover
                            },
                        }}
                    >
                        Quay lại trang chủ
                    </Button>
                </Stack>

                <img src={error} style={{ height: 200, padding: 5 }}></img>
            </Stack>
        </Box>
    );
}

export default Error;
