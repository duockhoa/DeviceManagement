import AssetList from '../../component/AssetsComponent/AssetList';
import SubSidebar from '../../component/LayoutComponent/SubSidebar';
import {
    Box,
    Grid
} from '@mui/material';

function Devices() { 
    return (
        <Box sx={{ height: '100%', display: 'flex' }}>
            {/* SubSidebar - 25% width */}
            <Box sx={{ width: '300px', minWidth: '300px' }}>
                <SubSidebar />
            </Box>
            
            {/* Main Content - 75% width */}
            <Box sx={{ flex: 1, backgroundColor: '#fff' , height: '100%' , border   : '1px solid red' ,display: 'flex', flexDirection: 'column'}}>
                <Box> <AssetList /></Box>
                <Box></Box>
               
                

            </Box>
        </Box>
    );
}

export default Devices;
