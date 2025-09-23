import { Divider, List, Stack } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import SettingsIcon from '@mui/icons-material/Settings';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import FeedbackIcon from '@mui/icons-material/Feedback';
import useMediaQuery from '@mui/material/useMediaQuery';
import { setIsOpen } from '../../../redux/slice/sibarSlice';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { setActiveCollapse } from '../../../redux/slice/sibarSlice';
import DevicesIcon from '@mui/icons-material/Devices';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';

export default function Sidebar() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const location = useLocation(); // Thêm hook để lấy path hiện tại
    const activeCollapse = useSelector((state) => state.sidebar.activeCollapse);
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    const handleClick = (event) => {
        const buttonId = event.currentTarget.id;
        dispatch(setActiveCollapse(buttonId));
    };

    const switchActiveSidebar = (path) => {
        // Xử lý external links (bắt đầu với http/https)
        if (path.startsWith('http')) {
            window.open(path, '_blank');
        } else {
            navigator(path);
        }

        if (isMobile) {
            dispatch(setIsOpen(false));
        }
    };

    // Handler riêng cho feedback
    const handleFeedbackClick = () => {
        const feedbackUrl =
            'https://docs.google.com/spreadsheets/d/1lmycHuIN5G415SxacnqFWMortfMYv48iUTfWzHKIzJw/edit?gid=0#gid=0';
        window.open(feedbackUrl, '_blank');

        if (isMobile) {
            dispatch(setIsOpen(false));
        }
    };

    const commonIconStyle = {
        width: '20px',
        height: '20px',
    };

    const commonTextStyle = {
        fontSize: '1.4rem',
    };

    return (
        <Stack
            elevation={5}
            pl={2}
            borderTop={'1px solid #ddd'}
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#fff',
                overflowY: 'auto',
            }}
        >
            <List>
                {/* Menu DashBoard */}
                <ListItemButton
                    id="DashBoard"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 0.7,
                        backgroundColor: location.pathname === '/' ? '#e3f2fd' : 'inherit',
                    }}
                    onClick={() => switchActiveSidebar('/')}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <HomeOutlinedIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText primary={!isOpen || 'DashBoard'} primaryTypographyProps={{ sx: commonTextStyle }} />
                </ListItemButton>

                <div>
                    <ListItemButton
                        onClick={handleClick}
                        id="deviceManagement"
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                            <SettingsIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: commonTextStyle }}
                            primary={!isOpen || 'Quản lý thiết bị'}
                        />
                        {activeCollapse.includes('deviceManagement') ? (
                            <ExpandMoreIcon sx={{ ml: 'auto', fontSize: '2.2rem' }} />
                        ) : (
                            <ArrowForwardIosIcon sx={{ ml: 'auto' }} />
                        )}
                    </ListItemButton>
                    <Collapse in={activeCollapse.includes('deviceManagement')} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    backgroundColor: location.pathname === '/device-category' ? '#e3f2fd' : 'inherit',
                                }}
                                onClick={() => switchActiveSidebar('/device-category')}
                            >
                                <ListItemIcon>
                                    <DevicesIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Danh mục thiết bị'}
                                />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <SettingsApplicationsIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Thông số kỹ thuật'}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </div>

                <Divider />

                {/* Divider trước menu Góp ý */}
                <Divider />

                {/* Menu Góp ý - mở Google Sheets trong tab mới */}
                <ListItemButton
                    id="Góp ý"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 0.7,

                        backgroundColor: 'inherit', // Không highlight vì không phải internal route
                    }}
                    onClick={handleFeedbackClick}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <FeedbackIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText
                        primary={!isOpen || 'Đóng góp ý kiến'}
                        primaryTypographyProps={{ sx: commonTextStyle }}
                    />
                </ListItemButton>
            </List>

            <Box flexGrow={1}></Box>

            <Box
                sx={{
                    textAlign: 'center',
                    fontSize: '1.1rem',
                    color: '#888',
                    py: 1,
                    borderTop: '1px solid #eee',
                    background: '#fafbfc',
                    letterSpacing: 1,
                }}
            >
                version: 1.0.0
            </Box>
        </Stack>
    );
}
