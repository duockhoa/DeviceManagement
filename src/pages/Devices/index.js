import AssetList from '../../component/AssetsComponent/AssetList';
import SubSidebar from '../../component/LayoutComponent/SubSidebar';
import {
    Box,
    Grid
} from '@mui/material';

function Devices() { 
    return (
        <Box sx={{ height: '100vh', display: 'flex' }}>
            {/* SubSidebar - 25% width */}
            <Box sx={{ width: '300px', minWidth: '300px' }}>
                <SubSidebar />
            </Box>
            
            {/* Main Content - 75% width */}
            <Box sx={{ flex: 1, backgroundColor: '#fff' }}>
                <AssetList />
            </Box>
        </Box>
    );
}

export default Devices;
