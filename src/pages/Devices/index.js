import AssetList from '../../component/AssetsComponent/AssetList';
import {
    Box,
} from '@mui/material';
import { use, useEffect } from 'react';

function Devices() { 
    return (
        <Box p={3} sx={{ backgroundColor: '#fff', height: '100vh' }}>
            <Box sx={{ height: 600, width: '100%' }}>
                <AssetList />
            </Box>
        </Box>
    );
}

export default Devices;
