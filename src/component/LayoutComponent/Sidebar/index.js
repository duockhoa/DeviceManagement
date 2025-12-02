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
import usePermissions from '../../../hooks/usePermissions';

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
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import AssessmentIcon from '@mui/icons-material/Assessment';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import EventNoteIcon from '@mui/icons-material/EventNote';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SecurityIcon from '@mui/icons-material/Security';

export default function Sidebar() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const location = useLocation();
    const activeCollapse = useSelector((state) => state.sidebar.activeCollapse);
    const isOpen = useSelector((state) => state.sidebar.isOpen);
    const user = useSelector((state) => state.user.userInfo);
    const { hasPermission } = usePermissions();

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
        width: '16px',
        height: '16px',
    };

    const commonTextStyle = {
        fontSize: '1.4rem',
    };

    const activeTextStyle = {
        fontSize: '1.4rem',
        color: '#fff',
        fontWeight: 'bold'
    };

    const activeIconStyle = {
        width: '16px',
        height: '16px',
        color: '#fff'
    };

    // Hover styles
    const hoverStyle = {
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#e3f2fd',
            '& .MuiListItemIcon-root': {
                color: '#1976d2'
            },
            '& .MuiListItemText-primary': {
                color: '#1976d2',
                fontWeight: 'medium'
            }
        }
    };

    const subItemHoverStyle = {
        transition: 'all 0.3s ease',
        '&:hover': {
            backgroundColor: '#f0f8ff',
            '& .MuiListItemIcon-root': {
                color: '#1976d2'
            },
            '& .MuiListItemText-primary': {
                color: '#1976d2',
                fontWeight: 'medium'
            }
        }
    };

    const activeStyle = {
        backgroundColor: '#1976d2',
        '&:hover': {
            backgroundColor: '#1976d2 !important',
            '& .MuiListItemIcon-root': {
                color: '#fff !important'
            },
            '& .MuiListItemText-primary': {
                color: '#fff !important',
                fontWeight: 'bold !important'
            }
        }
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
                        py: 0.7,
                        ...(location.pathname === '/' ? activeStyle : hoverStyle)
                    }}
                    onClick={() => switchActiveSidebar('/')}
                >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                        <HomeOutlinedIcon sx={location.pathname === '/' ? activeIconStyle : commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText 
                        primary={isOpen ? 'DashBoard' : ''} 
                        primaryTypographyProps={{ 
                            sx: location.pathname === '/' ? activeTextStyle : commonTextStyle 
                        }} 
                    />
                </ListItemButton>

                <div>
                    <ListItemButton
                        onClick={handleClick}
                        id="deviceManagement"
                        sx={{
                            ...hoverStyle,
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                            <InventoryIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: commonTextStyle }}
                            primary={isOpen ? 'Quản lý thiết bị' : ''}
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
                                    ...(location.pathname === '/devices' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/devices')}
                            >
                                <ListItemIcon>
                                    <DevicesIcon sx={location.pathname === '/devices' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/devices' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Danh mục thiết bị' : ''}
                                />
                            </ListItemButton>
                            <ListItemButton sx={{ 
                                pl: 4, 
                                ...(location.pathname === '/specifications' ? activeStyle : subItemHoverStyle)
                            }}
                            onClick={() => switchActiveSidebar('/specifications')}
                            >
                                <ListItemIcon>
                                    <SpecsIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{    sx: location.pathname === '/specifications' ? activeTextStyle : commonTextStyle }}
                                    primary={isOpen ? 'Thông số kỹ thuật' : ''}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    ...(location.pathname === '/consumables' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/consumables')}
                            >
                                <ListItemIcon>
                                    <DevicesIcon sx={location.pathname === '/consumables' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/consumables' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Tiêu chuẩn checklist' : ''}
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
                            ...hoverStyle,
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                            <BuildIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={isOpen ? 'Bảo trì/Sửa chữa' : ''}
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
                                    ...(location.pathname === '/maintenance-plan' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/maintenance-plan')}
                            >
                                <ListItemIcon>
                                    <EventNoteIcon sx={location.pathname === '/maintenance-plan' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                            <ListItemText
                                primaryTypographyProps={{ 
                                    sx: location.pathname === '/maintenance-plan' ? activeTextStyle : commonTextStyle 
                                }}
                                primary={isOpen ? 'Kế hoạch bảo trì' : ''}
                            />
                        </ListItemButton>

                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    ...(location.pathname === '/work-requests/ops' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/work-requests/ops')}
                            >
                                <ListItemIcon>
                                    <AssignmentIcon sx={location.pathname === '/work-requests/ops' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/work-requests/ops' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Xử lý yêu cầu' : ''}
                                />
                            </ListItemButton>
                            <ListItemButton
                                sx={{
                                    pl: 4,
                                    ...(location.pathname === '/maintenance' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/maintenance')}
                            >
                                <ListItemIcon>
                                    <MaintenanceIcon sx={location.pathname === '/maintenance' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/maintenance' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Lịch bảo trì' : ''}
                                />
                            </ListItemButton>
                            <ListItemButton 
                                sx={{ 
                                    pl: 4, 
                                    ...(location.pathname === '/maintenance-work' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/maintenance-work')}
                            >
                                <ListItemIcon>
                                    <RepairIcon sx={location.pathname === '/maintenance-work' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/maintenance-work' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Công việc bảo trì' : ''}
                                />
                            </ListItemButton>
                            
                            {/* Kết quả bảo trì - CHỈ QUẢN LÝ */}
                            {hasPermission('maintenance.report') && (
                                <ListItemButton 
                                    sx={{ 
                                        pl: 4,
                                        ...(location.pathname === '/maintenance-result' ? activeStyle : subItemHoverStyle)
                                    }}
                                    onClick={() => switchActiveSidebar('/maintenance-result')}
                                >
                                    <ListItemIcon>
                                        <AssignmentTurnedInIcon sx={location.pathname === '/maintenance-result' ? activeIconStyle : commonIconStyle} />
                                    </ListItemIcon>
                                    <ListItemText
                                        primaryTypographyProps={{ 
                                            sx: location.pathname === '/maintenance-result' ? activeTextStyle : commonTextStyle 
                                        }}
                                        primary={isOpen ? 'Kết quả bảo trì' : ''}
                                    />
                                </ListItemButton>
                            )}

                            <ListItemButton 
                                sx={{ 
                                    pl: 4,
                                    ...(location.pathname === '/maintenance-record' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/maintenance-record')}
                            >
                                <ListItemIcon>
                                    <AssessmentIcon sx={location.pathname === '/maintenance-record' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/maintenance-record' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Báo cáo tổng hợp' : ''}
                                />
                            </ListItemButton>
                        </List>
                    </Collapse>
                </div>
                {/* Sự cố thiết bị */}
                <div>
                    <ListItemButton
                        onClick={(e) => {
                            handleClick(e);
                        }}
                        id="incidents"
                        sx={{
                            ...hoverStyle,
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                            <WarningAmberIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText primaryTypographyProps={{ sx: commonTextStyle }} primary={isOpen ? 'Sự cố & Yêu cầu' : ''} />
                        {isOpen && (activeCollapse.includes('incidents') ? <ExpandMoreIcon /> : <ArrowForwardIosIcon sx={{ fontSize: 14 }} />)}
                    </ListItemButton>
                    <Collapse in={activeCollapse.includes('incidents') && isOpen} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                            <ListItemButton 
                                sx={{ 
                                    pl: 4,
                                    ...(location.pathname === '/incidents' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/incidents')}
                            >
                                <ListItemIcon>
                                    <WarningAmberIcon sx={location.pathname === '/incidents' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/incidents' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Sự cố' : ''}
                                />
                            </ListItemButton>

                            <ListItemButton 
                                sx={{ 
                                    pl: 4,
                                    ...(location.pathname === '/work-requests' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/work-requests')}
                            >
                                <ListItemIcon>
                                    <AssignmentIcon sx={location.pathname === '/work-requests' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/work-requests' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Yêu cầu xử lý' : ''}
                                />
                            </ListItemButton>

                            <ListItemButton 
                                sx={{ 
                                    pl: 4,
                                    ...(location.pathname === '/handovers' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/handovers')}
                            >
                                <ListItemIcon>
                                    <BuildIcon sx={location.pathname === '/handovers' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/handovers' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Bàn giao thiết bị' : ''}
                                />
                            </ListItemButton>
                            <ListItemButton 
                                sx={{ 
                                    pl: 4,
                                    ...(location.pathname === '/handovers/follow-up' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/handovers/follow-up')}
                            >
                                <ListItemIcon>
                                    <AssignmentTurnedInIcon sx={location.pathname === '/handovers/follow-up' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/handovers/follow-up' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Theo dõi bàn giao' : ''}
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
                            ...hoverStyle,
                            py: 0.7,
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: '30px' }}>
                            <CalibrateIcon sx={commonIconStyle} />
                        </ListItemIcon>
                        <ListItemText
                            primaryTypographyProps={{ sx: commonTextStyle }}
                            primary={isOpen ? 'Kiểm định/Hiệu chuẩn' : ''}
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
                                    ...(location.pathname === '/calibration' ? activeStyle : subItemHoverStyle)
                                }}
                                onClick={() => switchActiveSidebar('/calibration')}
                            >
                                <ListItemIcon>
                                    <CheckCircleIcon sx={location.pathname === '/calibration' ? activeIconStyle : commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ 
                                        sx: location.pathname === '/calibration' ? activeTextStyle : commonTextStyle 
                                    }}
                                    primary={isOpen ? 'Hiệu chuẩn thiết bị' : ''}
                                />
                            </ListItemButton>
                            <ListItemButton sx={{ 
                                pl: 4, 
                                ...subItemHoverStyle 
                            }}>
                                <ListItemIcon>
                                    <VerifiedIcon sx={commonIconStyle} />
                                </ListItemIcon>
                                <ListItemText
                                    primaryTypographyProps={{ sx: commonTextStyle }}
                                    primary={isOpen ? 'Kiểm định thiết bị' : ''}
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
                        ...hoverStyle,
                        py: 0.7,
                        backgroundColor: 'inherit',
                    }}
                    onClick={handleFeedbackClick}
                >
                    <ListItemIcon sx={{ minWidth: '30px' }}>
                        <FeedbackIcon sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText
                        primary={isOpen ? 'Đóng góp ý kiến' : ''}
                        primaryTypographyProps={{ sx: commonTextStyle }}
                    />
                </ListItemButton>
            </List>

            <ListItemButton
                onClick={() => switchActiveSidebar('/rbac')}
                sx={{
                    ...hoverStyle,
                    py: 0.7,
                    ...(location.pathname === '/rbac' ? activeStyle : {})
                }}
            >
                <ListItemIcon sx={{ minWidth: '30px' }}>
                    <SecurityIcon sx={location.pathname === '/rbac' ? activeIconStyle : commonIconStyle} />
                </ListItemIcon>
                <ListItemText
                    primaryTypographyProps={{ sx: location.pathname === '/rbac' ? activeTextStyle : commonTextStyle }}
                    primary={isOpen ? 'Phân quyền' : ''}
                />
            </ListItemButton>

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
                version: 1.1.18 design by MR.Lee
            </Box>
        </Stack>
    );
}
