import CalibrationList from '../../component/CalibrationComponent/CalibrationList';
import SubSidebarCalibration from '../../component/LayoutComponent/SubSidebarCalibration';
import AddCalibrationButton from '../../component/CalibrationComponent/AddCalibrationBtn';
import {
    Box,
    useMediaQuery,
    useTheme
} from '@mui/material';

function Calibration() {
    const theme = useTheme();
    const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));
    
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* SubSidebar - hidden on small screens */}
            {isLargeScreen && (
                <Box sx={{ width: '300px', minWidth: '300px' }}>
                    <SubSidebarCalibration />
                </Box>
            )}

            {/* Main Content - 75% width */}
            <Box sx={{
                flex: 1,
                backgroundColor: '#fff',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                p: 1
            }}>
                <CalibrationList />
            </Box>

            {/* Fixed Add Button */}
            <Box sx={{
                position: 'fixed',
                bottom: 40,
                right: 40,
                zIndex: 1000
            }}>
                <AddCalibrationButton />
            </Box>
        </Box>
    );
}

export default Calibration;
