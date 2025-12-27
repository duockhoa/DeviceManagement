import MaintenanceList from '../../component/MaintenanceComponent/MaintenanceList';
import AddMaintenanceButton from '../../component/MaintenanceComponent/AddMaintenanceBtn';
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
    Box
} from '@mui/material';

function Maintenance() {
    const maintenanceListRef = useRef();
    const addButtonRef = useRef();
    const location = useLocation();

    const handleReload = () => {
        if (maintenanceListRef.current && maintenanceListRef.current.reloadData) {
            maintenanceListRef.current.reloadData();
        }
    };

    // Auto-open create dialog nếu có incident data
    useEffect(() => {
        if (location.state?.createFromIncident && location.state?.incidentData) {
            // Trigger click on AddMaintenanceButton to open dialog with pre-filled data
            setTimeout(() => {
                if (addButtonRef.current && addButtonRef.current.openDialogWithIncidentData) {
                    addButtonRef.current.openDialogWithIncidentData(location.state.incidentData);
                }
            }, 100);
        }
    }, [location.state]);

    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* Main Content - Full width */}
            <Box sx={{
                flex: 1,
                backgroundColor: '#fff',
                height: '100vh',
                width: '100%',
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
                <AddMaintenanceButton ref={addButtonRef} onReload={handleReload} />
            </Box>
        </Box>
    );
}

export default Maintenance;
