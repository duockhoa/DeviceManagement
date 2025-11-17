import MaintenanceList from '../../component/MaintenanceComponent/MaintenanceList';
import AddMaintenanceButton from '../../component/MaintenanceComponent/AddMaintenanceBtn';
import { useRef } from 'react';
import {
    Box
} from '@mui/material';

function Maintenance() {
    const maintenanceListRef = useRef();

    const handleReload = () => {
        if (maintenanceListRef.current && maintenanceListRef.current.reloadData) {
            maintenanceListRef.current.reloadData();
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* Main Content - Full width */}
            <Box sx={{
                flex: 1,
                backgroundColor: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 1
            }}>
                <MaintenanceList ref={maintenanceListRef} />
            </Box>

            {/* Fixed Add Button */}
            <Box sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                zIndex: 1000
            }}>
                <AddMaintenanceButton onReload={handleReload} />
            </Box>
        </Box>
    );
}

export default Maintenance;
