import MaintenanceList from '../../component/MaintenanceComponent/MaintenanceList';
import SubSidebarMaintenance from '../../component/LayoutComponent/SubSidebarMaintenance';
import AddMaintenanceButton from '../../component/MaintenanceComponent/AddMaintenanceBtn';
import {
    Box
} from '@mui/material';

function Maintenance() {
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* SubSidebar - 25% width */}
            <Box sx={{ width: '300px', minWidth: '300px' }}>
                <SubSidebarMaintenance />
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
                <MaintenanceList />
            </Box>

            {/* Fixed Add Button */}
            <Box sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                zIndex: 1000
            }}>
                <AddMaintenanceButton />
            </Box>
        </Box>
    );
}

export default Maintenance;
