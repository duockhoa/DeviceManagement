import CalibrationList from '../../component/CalibrationComponent/CalibrationList';
import AddCalibrationButton from '../../component/CalibrationComponent/AddCalibrationBtn';
import {
    Box
} from '@mui/material';

function Calibration() {
    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            {/* Main Content */}
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
