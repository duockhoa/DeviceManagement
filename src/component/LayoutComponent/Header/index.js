import AppBar from '@mui/material/AppBar';
import { Box, Toolbar, Typography } from '@mui/material';
import Avatar from '../Avatar';
import Notification from '../Notification';
import { logo } from '../../../assets/images';
import { Link } from 'react-router-dom';
import Search from '../Search';
import { useSelector, useDispatch } from 'react-redux';
import { setIsOpen } from '../../../redux/slice/sibarSlice';
import MenuIcon from '@mui/icons-material/Menu';
import IconButton from '@mui/material/IconButton';

function Header() {
    const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);
    const dispatch = useDispatch();

    function handleMenuClick() {
        dispatch(setIsOpen(!isSidebarOpen));
    }

    return (
        <AppBar
            position="static"
            sx={{
                backgroundColor: 'rgb(255,255,255)',
                height: '56px',
            }}
        >
            <Toolbar variant="dense" sx={{ minHeight: 56, px: { xs: 1, sm: 2 } }}>
                <IconButton onClick={handleMenuClick} size="small" sx={{ p: 0.5 }}>
                    <MenuIcon sx={{ fontSize: 22 }} />
                </IconButton>
                <Link to="/" style={{ height: '100%', display: 'flex', paddingLeft: 8 }}>
                    <img
                        src={logo}
                        alt="Logo"
                        style={{
                            display: 'block',
                            maxHeight: 36,
                            margin: 'auto',
                        }}
                    />
                </Link>

                {/* Title */}
                <Typography
                    color="text.primary"
                    fontSize={18}
                    sx={{
                        pl: 1,
                        display: { xs: 'none', md: 'block' },
                        lineHeight: '56px',
                        whiteSpace: 'nowrap',
                    }}
                >
                    DK Quản lý thiết bị
                </Typography>

                {/* Spacer */}
                <Box flexGrow={1} />

                {/* Search Input */}
                <Box sx={{ display: { xs: 'none', md: 'block' } }}>
                    <Search />
                </Box>

                {/* Notification */}
                <Box sx={{ display: 'block' }}>
                    <Notification notifications={[]} />
                </Box>

                {/* Avatar */}
                <Box sx={{ pl: 1, pr: 2, display: 'block' }}>
                    <Avatar />
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
