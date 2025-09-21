import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Header from '../../component/LayoutComponent/Header';
import LoadingPage from '../../component/SharedComponent/LoadingPage';
import { useSelector } from 'react-redux';

function HeaderOnlyLayout({ children }) {
    const userInfo = useSelector((state) => state.user.userInfo);

    if (userInfo.name === '') {
        return <LoadingPage />;
    }
    return (
        <Stack sx={{ height: '100vh' }}>
            {/* Header */}
            <Header />
            {/* Nội dung chính */}
            <Box sx={{ flex: 1, height: '100%' }}>{children}</Box>
        </Stack>
    );
}

export default HeaderOnlyLayout;
