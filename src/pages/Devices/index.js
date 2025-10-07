import AssetList from '../../component/AssetsComponent/AssetList';
import SubSidebar from '../../component/LayoutComponent/SubSidebar';
import AddDeviceButton from '../../component/AssetsComponent/AddDeviceBtn';
import {
    Box,
    Grid
} from '@mui/material';

function Devices() { 
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* SubSidebar - 25% width */}
            <Box sx={{ width: '300px', minWidth: '300px' }}>
                <SubSidebar />
            </Box>
            
            {/* Main Content - 75% width */}
            <Box sx={{ 
                flex: 1, 
                backgroundColor: '#fff', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                p: 1
            }}>
                <AssetList />
            </Box>
            
            {/* Fixed Add Button */}
            <Box sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                zIndex: 1000
            }}>
                <AddDeviceButton />
            </Box>
        </Box>
    );
}

export default Devices;
