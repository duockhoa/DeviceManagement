import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Header from '../../component/LayoutComponent/Header';
import Loading from '../../component/Loading';
import { useSelector } from 'react-redux';

function HeaderOnlyLayout({ children }) {
    const userInfo = useSelector((state) => state.user.userInfo);

    if (userInfo.name === '') {
        return <Loading />;
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
