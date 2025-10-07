import AssetList from '../../component/AssetsComponent/AssetList';
import {
    Box,
} from '@mui/material';

function Devices() { 
    return (
        <Box p={3} sx={{ backgroundColor: '#fff', height: '100%' }}>
                <AssetList />
        </Box>
    );
}

export default Devices;
