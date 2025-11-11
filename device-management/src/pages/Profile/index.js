import { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import { Button, Divider, Typography, Badge, TextField, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { styled } from '@mui/material/styles';
import { updateAvatarService } from '../../services/usersService';
import { fetchUser } from '../../redux/slice/userSlice';
import { useNavigate } from 'react-router-dom';
import { changePasswordService } from '../../services/usersService';
import Alert from '@mui/material/Alert';
import { isStrongPassword } from 'validator';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function Profile() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.userInfo);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        severity: 'success' // 'success', 'error', 'warning', 'info'
    });

    const showNotification = (message, severity = 'success') => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const hideNotification = () => {
        setNotification(prev => ({
            ...prev,
            open: false
        }));
    };

    const handleChangeAvatar = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('avatar', file);
            formData.append('id', user.id);

            try {
                await updateAvatarService(formData);
                await dispatch(fetchUser());
            } catch (error) {
                alert('Cập nhật ảnh đại diện thất bại: ' + error.message);
                console.error('Error updating avatar:', error);
            }
        }
    };

    const handlePasswordChange = (field) => (event) => {
        setPasswordData({
            ...passwordData,
            [field]: event.target.value
        });

        setError({
            ...error,
            [field]: ''
        });
    
    };

    const handleUpdatePassword = async () => {
        const { currentPassword, newPassword, confirmPassword } = passwordData;

        if (!currentPassword) {
            setError({
                currentPassword: 'Vui lòng nhập mật khẩu hiện tại'
            });
            return;
        }

        if( !newPassword ) {
            setError({
                ...error,
                newPassword: 'Vui lòng nhập mật khẩu mới'
            });
            return;
        }
        if (!isStrongPassword(newPassword, {
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
        })) {
            setError({
                ...error,
                newPassword: 'Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt'
            });
            return;
        }

        if(newPassword === currentPassword) {
            setError({
                ...error,
                newPassword: 'Mật khẩu mới không được trùng với mật khẩu hiện tại'
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setError({
                ...error,
                confirmPassword: 'Mật khẩu mới và xác nhận mật khẩu không khớp'
            });
            return;
        }

        try {
            const result = await changePasswordService({
                id: user.id,
                currentPassword,
                newPassword
            });
            if (result) {
                // Success notification
                showNotification('Mật khẩu đã được cập nhật thành công!', 'success');
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setError('');
            } else {
                // Error notification
                showNotification('Cập nhật mật khẩu thất bại. Vui lòng thử lại!', 'error');
            }
        } catch (error) {
            let errorMessage = error.message || 'Đã xảy ra lỗi khi cập nhật mật khẩu';
            // Error notification
            showNotification(errorMessage, 'error');
        }
    };

    const handleCancel = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        navigate('/'); // Redirect to home or another page
        
    };

    // Check if user exists before rendering
    if (!user) {
        return (
            <Stack
                sx={{
                    width: '100%',
                    height: '100vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.07)',
                }}
                justifyContent="center"
                alignItems="center"
            >
                <Typography>Loading...</Typography>
            </Stack>
        );
    }

    return (
        <>
            {/* Success/Error Notification */}
            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={hideNotification}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                sx={{ mt: 8 }}
            >
                <Alert 
                    onClose={hideNotification} 
                    severity={notification.severity}
                    sx={{ 
                        width: '100%',
                        minWidth: 300,
                        fontSize: '14px',
                        fontWeight: 'medium'
                    }}
                >
                    {notification.message}
                </Alert>
            </Snackbar>

            <Stack
                sx={{
                    width: '100%',
                    height: 'auto',
                    minHeight: '93vh',
                    backgroundColor: 'rgba(0, 0, 0, 0.07)',
                    p: { xs: 1, sm: 2, md: 3 },
                }}
                justifyContent="center"
                alignItems="center"
            >
                <Paper 
                    sx={{ 
                        height: { xs: '95%', sm: '90%', md: '90%' }, 
                        width: { xs: '98%', sm: '95%', md: '90%' }, 
                        p: { xs: 2, sm: 3, md: 4 },
                        overflow: 'auto'
                    }}
                >
                    <Stack 
                        direction={{ xs: 'column', lg: 'row' }} 
                        spacing={{ xs: 3, sm: 4 }} 
                        height="100%"
                    >
                        {/* Avatar & Basic Info */}
                        <Stack
                            alignItems="center"
                            justifyContent="flex-start"
                            spacing={2}
                            sx={{ 
                                width: { xs: '100%', lg: '35%' },
                                minHeight: { xs: 'auto', lg: '100%' }
                            }}
                        >
                            <Badge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                badgeContent={
                                    <Button
                                        sx={{
                                            minWidth: 0,
                                            padding: { xs: 0.5, sm: 1 },
                                            borderRadius: '50%',
                                            backgroundColor: 'primary.main',
                                            color: 'white',
                                            width: { xs: 36, sm: 48 },
                                            height: { xs: 36, sm: 48 },
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            '&:hover': {
                                                backgroundColor: 'primary.dark',
                                            },
                                        }}
                                        component="label"
                                    >
                                        <EditIcon />
                                        <VisuallyHiddenInput type="file" onChange={handleChangeAvatar} accept="image/*" />
                                    </Button>
                                }
                            >
                                <Avatar 
                                    sx={{ 
                                        width: { xs: 120, sm: 150, md: 200 }, 
                                        height: { xs: 120, sm: 150, md: 200 } 
                                    }} 
                                    alt={user.name || 'User'} 
                                    src={user.avatar}
                                />
                            </Badge>
                            <Divider
                                sx={{
                                    width: '100%',
                                    marginY: 2,
                                    borderColor: 'rgba(0, 0, 0, 0.8)',
                                }}
                            />
                            <Typography 
                                variant="h4" 
                                fontWeight="bold" 
                                textAlign="center" 
                                sx={{ 
                                    fontSize: { xs: '1.5rem', sm: '1.8rem', md: '2rem' },
                                    wordBreak: 'break-word'
                            }}
                            >
                                {user.name || 'Tên người dùng'}
                            </Typography>
                            <Typography
                                variant="body1"
                                textAlign="center"
                                color="primary.main"
                                sx={{ 
                                    fontSize: { xs: '1rem', sm: '1.2rem', md: '1.5rem' }, 
                                    marginTop: 1,
                                    wordBreak: 'break-word'
                            }}
                            >
                                {user.email || 'email@example.com'}
                            </Typography>
                        </Stack>

                        <Stack sx={{ flex: 1 }} spacing={{ xs: 3, sm: 4 }}>
                            {/* User Information Section */}
                            <Paper sx={{ p: { xs: 2, sm: 3 } }} elevation={3}>
                                <Typography 
                                    variant="h5" 
                                    fontWeight="bold" 
                                    sx={{ 
                                        fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.6rem' }
                                    }}
                                >
                                    Thông tin người dùng:
                                </Typography>
                                <Divider
                                    sx={{
                                        width: '100%',
                                        marginY: 2,
                                        borderColor: 'rgba(0, 0, 0, 0.8)',
                                    }}
                                />
                                <Stack 
                                    direction={{ xs: 'column', md: 'row' }} 
                                    spacing={{ xs: 2, sm: 3, md: 4 }} 
                                    sx={{ pl: { xs: 1, sm: 2 } }}
                                >
                                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Tên:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            > 
                                                {user.name || 'N/A'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Phòng ban:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                {user.department || 'N/A'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Chức vụ:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                {user.position || 'N/A'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Trạng thái:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Chính thức
                                            </Typography>
                                        </Stack>
                                    </Stack>

                                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ flex: 1 }}>
                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Email:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    wordBreak: 'break-word',
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                {user.email || 'N/A'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                SĐT:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                {user.phoneNumber || 'N/A'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Giới tính:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                {user.sex || 'N/A'}
                                            </Typography>
                                        </Stack>

                                        <Stack direction="row" alignItems="center" flexWrap="wrap">
                                            <Typography 
                                                variant="body1" 
                                                fontWeight="bold" 
                                                sx={{ 
                                                    minWidth: { xs: 'auto', sm: 120 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                Ngày sinh:
                                            </Typography>
                                            <Typography 
                                                variant="body1" 
                                                sx={{ 
                                                    ml: { xs: 1, sm: 2 },
                                                    fontSize: { xs: '14px', sm: '16px' }
                                                }}
                                            >
                                                {user.birthDate || 'Chưa cập nhật'}
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Change Password Section */}
                            <Paper sx={{ p: { xs: 2, sm: 3 } }} elevation={3}>
                                <Typography 
                                    variant="h5" 
                                    fontWeight="bold" 
                                    sx={{ 
                                        fontSize: { xs: '1.3rem', sm: '1.5rem', md: '1.6rem' }
                                    }}
                                >
                                    Đổi mật khẩu:
                                </Typography>
                                <Divider
                                    sx={{
                                        width: '100%',
                                        marginY: 2,
                                        borderColor: 'rgba(0, 0, 0, 0.8)',
                                    }}
                                />
                                <Stack 
                                    direction={{ xs: 'column', lg: 'row' }} 
                                    spacing={{ xs: 3, sm: 4 }}
                                >
                                    <Stack spacing={{ xs: 2, sm: 3 }} sx={{ flex: 1 }}>
                                        <TextField
                                            type="password"
                                            placeholder="Mật khẩu hiện tại"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange('currentPassword')}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            autoComplete="current-password"
                                            inputProps={{
                                                autoComplete: "current-password",
                                                form: {
                                                    autoComplete: "off"
                                                }
                                            }}
                                            InputProps={{
                                                style: { fontSize: '14px' },
                                                autoComplete: "current-password"
                                            }}
                                            error={!!error.currentPassword}
                                            helperText={error.currentPassword || ''}
                                        />
                                        <TextField
                                            type="password"
                                            placeholder="Mật khẩu mới"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange('newPassword')}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            autoComplete="new-password"
                                            inputProps={{
                                                autoComplete: "new-password"
                                            }}
                                            InputProps={{
                                                style: { fontSize: '14px' }
                                            }}
                                            error={!!error.newPassword}
                                            helperText={error.newPassword || ''}
                                        />
                                        <TextField
                                            type="password"
                                            placeholder="Nhập lại mật khẩu"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange('confirmPassword')}
                                            variant="outlined"
                                            size="medium"
                                            fullWidth
                                            autoComplete="new-password"
                                            inputProps={{
                                                autoComplete: "new-password"
                                            }}
                                            InputProps={{
                                                style: { fontSize: '14px' }
                                            }}
                                            error={!!error.confirmPassword}
                                            helperText={error.confirmPassword || ''}
                                        />
                                        <Stack 
                                            direction={{ xs: 'column', sm: 'row' }} 
                                            spacing={2} 
                                            sx={{ mt: 2 }}
                                        >
                                            <Button
                                                variant="contained"
                                                onClick={handleUpdatePassword}
                                                sx={{
                                                    backgroundColor: '#1976d2',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    px: 3,
                                                    py: 1,
                                                    '&:hover': {
                                                        backgroundColor: '#1565c0',
                                                    }
                                                }}
                                            >
                                                CẬP NHẬT
                                            </Button>
                                            <Button
                                                variant="contained"
                                                onClick={handleCancel}
                                                sx={{
                                                    backgroundColor: '#1976d2',
                                                    color: 'white',
                                                    fontSize: '14px',
                                                    fontWeight: 'bold',
                                                    textTransform: 'uppercase',
                                                    px: 3,
                                                    py: 1,
                                                    '&:hover': {
                                                        backgroundColor: '#1565c0',
                                                    }
                                                }}
                                            >
                                                QUAY LẠI
                                            </Button>
                                        </Stack>
                                    </Stack>

                                    <Stack sx={{ flex: 1 }} spacing={2}>
                                        <Typography 
                                            variant="body1" 
                                            sx={{ 
                                                fontSize: '14px', 
                                                color: 'text.secondary' 
                                            }}
                                        >
                                            Mật khẩu tài khoản của bạn phải đáp ứng các yêu cầu sau:
                                        </Typography>
                                        <Stack spacing={1} sx={{ pl: 2 }}>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ fontSize: '14px' }}
                                            >
                                                • Có ít nhất 8 ký tự
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ fontSize: '14px' }}
                                            >
                                                • Có ít nhất một chữ hoa và một chữ thường
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ fontSize: '14px' }}
                                            >
                                                • Có ít nhất một chữ số
                                            </Typography>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ fontSize: '14px' }}
                                            >
                                                • Có ít nhất một ký tự đặc biệt
                                            </Typography>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </Paper>
                        </Stack>
                    </Stack>
                </Paper>
            </Stack>
        </>
    );
}

export default Profile;
