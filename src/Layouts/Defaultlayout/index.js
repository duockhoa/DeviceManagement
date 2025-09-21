import { useEffect } from 'react';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Header from '../../component/LayoutComponent/Header';
import Sidebar from '../../component/LayoutComponent/Sidebar';
import { useSelector, useDispatch } from 'react-redux';
import { setIsOpen } from '../../redux/slice/sibarSlice';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
function DefaultLayout({ children }) {
    const dispatch = useDispatch();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isOpen = useSelector((state) => state.sidebar.isOpen);
    const handleSidebarClose = () => {
        if (isMobile) {
            dispatch(setIsOpen(false));
        }
    };
    const handleSidebarToggle = () => {
        dispatch(setIsOpen(!isOpen));
    };
    const headerHeight = '64px';
    const desktopSidebarWidthOpen = '255px';
    const desktopSidebarWidthClosed = '100px';
    const mobileDrawerWidth = '280px';

    const sidebarContent = <Sidebar />;

    return (
        <Stack sx={{ height: '100vh', overflow: 'hidden' }}>
            <Header onMenuButtonClick={handleSidebarToggle} />

            <Box
                sx={{
                    display: 'flex',
                    height: `calc(100vh - ${headerHeight})`,
                    overflow: 'hidden',
                }}
            >
                {/* === Sidebar Section === */}
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={isOpen}
                        onClose={handleSidebarClose}
                        ModalProps={{
                            keepMounted: true,
                        }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                boxSizing: 'border-box',
                                // Khi ở mobile và isOpen, Drawer chiếm 100% chiều rộng
                                // Nếu không, nó sẽ có chiều rộng mặc định (dù không hiển thị nếu !isOpen)
                                width: isOpen ? '100vw' : mobileDrawerWidth,
                                // Chiều cao mặc định của Drawer paper thường là 100vh khi temporary
                            },
                        }}
                    >
                        {sidebarContent}
                    </Drawer>
                ) : (
                    <Box
                        component="aside"
                        sx={{
                            width: isOpen ? desktopSidebarWidthOpen : desktopSidebarWidthClosed,
                            flexShrink: 0,
                            height: '100%',
                            borderRight: `1px solid ${theme.palette.divider}`,
                            transition: theme.transitions.create('width', {
                                easing: theme.transitions.easing.sharp,
                                duration: isOpen
                                    ? theme.transitions.duration.enteringScreen
                                    : theme.transitions.duration.leavingScreen,
                            }),
                            overflowY: 'auto',
                            overflowX: 'hidden',
                        }}
                    >
                        {sidebarContent}
                    </Box>
                )}

                {/* === Main Content Section === */}
                <Box
                    component="main"
                    sx={{
                        // Khi ở mobile và isOpen, ẩn phần content này đi
                        display: isMobile && isOpen ? 'none' : 'block', // 'block' hoặc 'flex' tùy theo cấu trúc con
                        flexGrow: 1, // Chỉ có tác dụng trên desktop layout (khi display không phải 'none')
                        height: '100%',
                        overflowY: 'auto',
                        p: 1,
                        backgroundColor: 'rgb(224, 224, 240)',
                    }}
                >
                    {children}
                </Box>
            </Box>
        </Stack>
    );
}

export default DefaultLayout;
