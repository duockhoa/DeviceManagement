import { Divider, List, Stack } from '@mui/material';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import StarBorder from '@mui/icons-material/StarBorder';
import { Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FeedbackIcon from '@mui/icons-material/Feedback';
import useMediaQuery from '@mui/material/useMediaQuery';
import { setIsOpen } from '../../../redux/slice/sibarSlice';

export default function Sidebar() {
    const isMobile = useMediaQuery('(max-width:600px)');
    const dispatch = useDispatch();
    const navigator = useNavigate();
    const activeSidebar = useSelector((state) => state.sidebar.activeSidebar);
    const isOpen = useSelector((state) => state.sidebar.isOpen);

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
                {/* Menu Quan trọng */}
                <ListItemButton
                    id="Quan trọng"
                    sx={{
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                        py: 0.7,
                        borderRadius: '800px',
                        backgroundColor: activeSidebar === '/' ? '#e3f2fd' : 'inherit',
                    }}
                    onClick={() => switchActiveSidebar('/')}
                >
                    <ListItemIcon sx={{ minWidth: '40px' }}>
                        <StarBorder sx={commonIconStyle} />
                    </ListItemIcon>
                    <ListItemText primary={!isOpen || 'Quan trọng'} primaryTypographyProps={{ sx: commonTextStyle }} />
                </ListItemButton>

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
                        borderRadius: '800px',
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
