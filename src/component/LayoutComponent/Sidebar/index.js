import { Divider, List, Stack } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import Collapse from '@mui/material/Collapse';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import FeedbackIcon from '@mui/icons-material/Feedback';
import useMediaQuery from '@mui/material/useMediaQuery';
import { setIsOpen } from '../../../redux/slice/sibarSlice';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import { setActiveCollapse } from '../../../redux/slice/sibarSlice';

// Import các icon mới phù hợp
import DevicesIcon from '@mui/icons-material/Devices';
import CategoryIcon from '@mui/icons-material/Category';
import InventoryIcon from '@mui/icons-material/Inventory';
import SpecsIcon from '@mui/icons-material/Assignment';
import BuildIcon from '@mui/icons-material/Build';
import MaintenanceIcon from '@mui/icons-material/Engineering';
import RepairIcon from '@mui/icons-material/Construction';
import CalibrateIcon from '@mui/icons-material/Tune';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import VerifiedIcon from '@mui/icons-material/Verified';

export default function Sidebar() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const location = useLocation();
    const activeCollapse = useSelector((state) => state.sidebar.activeCollapse);
    const isOpen = useSelector((state) => state.sidebar.isOpen);

    const handleClick = (event) => {
        const buttonId = event.currentTarget.id;
        dispatch(setActiveCollapse(buttonId));
    };

    const switchActiveSidebar = (path) => {
        if (path.startsWith('http')) {
            window.open(path, '_blank');
        } else {
            navigator(path);
        }

        if (isMobile) {
            dispatch(setIsOpen(false));
        }
    };

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
                            <InventoryIcon sx={commonIconStyle} />
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
                                    backgroundColor: location.pathname === '/devices' ? '#e3f2fd' : 'inherit',
                                }}
                                onClick={() => switchActiveSidebar('/devices')}
                            >
                                <ListItemIcon>
                                    <DevicesIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Danh mục thiết bị'}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    backgroundColor: location.pathname === '/categories' ? '#e3f2fd' : 'inherit',
                                }}
                                onClick={() => switchActiveSidebar('/categories')}
                            >
                                <ListItemIcon>
                                    <CategoryIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Loại thiết bị'}
                                />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <SpecsIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Thông số kỹ thuật'}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </div>
                <div>
                    <ListItemButton
                        onClick={handleClick}
                        id="maintenance"
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                            <BuildIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: commonTextStyle }}
                            primary={!isOpen || 'Bảo trì /Sửa chữa'}
                        />
                        {activeCollapse.includes('maintenance') ? (
                            <ExpandMoreIcon sx={{ ml: 'auto', fontSize: '2.2rem' }} />
                        ) : (
                            <ArrowForwardIosIcon sx={{ ml: 'auto' }} />
                        )}
                    </ListItemButton>
                    <Collapse in={activeCollapse.includes('maintenance')} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    backgroundColor: location.pathname === '/maintenance' ? '#e3f2fd' : 'inherit',
                                }}
                                onClick={() => switchActiveSidebar('/maintenance')}
                            >
                                <ListItemIcon>
                                    <MaintenanceIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Bảo trì thiết bị'}
                                />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <RepairIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Hồ sơ sửa chữa'}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </div>
                <div>
                    <ListItemButton
                        onClick={handleClick}
                        id="calibration"
                        sx={{
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                            },
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '40px' }}>
                            <CalibrateIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: commonTextStyle }}
                            primary={!isOpen || 'Kiểm định/Hiệu chuẩn'}
                        />
                        {activeCollapse.includes('calibration') ? (
                            <ExpandMoreIcon sx={{ ml: 'auto', fontSize: '2.2rem' }} />
                        ) : (
                            <ArrowForwardIosIcon sx={{ ml: 'auto' }} />
                        )}
                    </ListItemButton>
                    <Collapse in={activeCollapse.includes('calibration')} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    '&:hover': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    backgroundColor: location.pathname === '/calibration' ? '#e3f2fd' : 'inherit',
                                }}
                                onClick={() => switchActiveSidebar('/calibration')}
                            >
                                <ListItemIcon>
                                    <CheckCircleIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Hiệu chuẩn thiết bị'}
                                />
                            </ListItemButton>
                            <ListItemButton sx={{ pl: 4 }}>
                                <ListItemIcon>
                                    <VerifiedIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={!isOpen || 'Kiểm định thiết bị'}
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
