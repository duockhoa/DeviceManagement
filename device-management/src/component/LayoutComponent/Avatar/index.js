import  { useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import StyledBadge from './StyleBadge';
import { useSelector, useDispatch } from 'react-redux';
import PopupState, { bindToggle, bindPopper } from 'material-ui-popup-state';
import Fade from '@mui/material/Fade';
import Popper from '@mui/material/Popper';
import List from '@mui/material/List';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import { ListItem, ListItemButton, ListItemText } from '@mui/material';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import Paper from '@mui/material/Paper';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';
import { logoutService } from '../../../services/logoutService';
import AppsIcon from '@mui/icons-material/Apps';
import { fetchUser } from '../../../redux/slice/userSlice';

function MyAvatar() {
    const dispatch = useDispatch();
    // Lấy thông tin user từ Redux store
    useEffect(() => {
        dispatch(fetchUser());
    }, [dispatch]);
    const user = useSelector((state) => state.user.userInfo);

    // Hàm xử lý logout
    const handleLogout = async () => {
        await logoutService({ id: user.id });
        window.location.href = process.env.REACT_APP_FRONTEND_ROOT_URL + '/login';
    };

    if (!user) {
        return null;
    }

    return (
        <PopupState variant="popper" popupId="demo-popup-popper">
            {(popupState) => (
                <>
                    <ClickAwayListener onClickAway={popupState.close}>
                        <Stack
                            {...bindToggle(popupState)}
                            flexDirection="row"
                            alignItems="center"
                            style={{ cursor: 'pointer' }}
                            sx={{ display: 'flex' }} // Sửa lại để avatar luôn hiển thị
                        >
                            <Stack
                                alignItems="flex-start"
                                sx={{ paddingLeft: 2, paddingRight: 1 }}
                                display={{ xs: 'none', sm: 'none', md: 'flex' }}
                            >
                                <Typography color="text.primary" fontSize="1.5rem" fontWeight="500">
                                    {user.name || 'loading...'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" fontSize="1.1rem">
                                    {user.position + ' ' + user.department || 'loading...'}
                                </Typography>
                            </Stack>

                            <StyledBadge
                                overlap="circular"
                                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                variant="dot"
                            >
                                <Avatar
                                    src={user.avatar || ''}
                                    alt={user.name || 'loading...'}
                                    sx={{
                                        width: '40px',
                                        height: '40px',
                                    }}
                                />
                            </StyledBadge>
                        </Stack>
                    </ClickAwayListener>

                    <Popper {...bindPopper(popupState)} transition>
                        {({ TransitionProps }) => (
                            <Fade {...TransitionProps} timeout={350}>
                                <Paper elevation={5} sx={{ padding: 1, zIndex: 2 }}>
                                    <List disablePadding>
                                        <Link to="/profile" style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <ListItem disablePadding>
                                                <ListItemButton>
                                                    <PersonOutlineIcon sx={{ fontSize: 20, mr: 1 }} />
                                                    <ListItemText
                                                        primary="Hồ sơ của bạn"
                                                        primaryTypographyProps={{
                                                            fontSize: '1.4rem',
                                                        }}
                                                    />
                                                </ListItemButton>
                                            </ListItem>
                                        </Link>
                                        <ListItem disablePadding>
                                            <ListItemButton
                                                onClick={() => (window.location.href = 'https://dkpharma.io.vn')}
                                            >
                                                <AppsIcon sx={{ fontSize: 20, mr: 1 }} />
                                                <ListItemText
                                                    primary="Tất cả ứng dụng"
                                                    primaryTypographyProps={{
                                                        fontSize: '1.4rem',
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                        <ListItem disablePadding sx={{ color: 'error.main' }}>
                                            <ListItemButton onClick={handleLogout}>
                                                <LogoutIcon sx={{ fontSize: 20, mr: 1 }} />
                                                <ListItemText
                                                    primary="Đăng xuất"
                                                    primaryTypographyProps={{
                                                        fontSize: '1.4rem',
                                                    }}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    </List>
                                </Paper>
                            </Fade>
                        )}
                    </Popper>
                </>
            )}
        </PopupState>
    );
}

export default MyAvatar;
