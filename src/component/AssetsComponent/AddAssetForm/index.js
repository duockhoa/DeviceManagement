import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button, Tabs, Tab } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Stack } from '@mui/system';
import { useSelector } from 'react-redux';
import * as React from 'react';
import PropTypes from 'prop-types';

function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

function AddAssetForm({ handleClose }) {
    const assetCategories = useSelector((state) => state.assetCategories.categories);
    const plant = useSelector((state) => state.plants.plants);
    const areas = useSelector((state) => state.areas.areas); // Thêm areas
    const [tabValue, setTabValue] = React.useState(0);

    console.log('Asset Categories:', assetCategories);
    console.log('Plants:', plant);
    console.log('Areas:', areas); // Log areas


    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleSave = () => {
        // Logic lưu form
        console.log('Saving form...');
    };

    const handleReset = () => {
        // Logic reset form
        console.log('Resetting form...');
    };

    return (
        <Box sx={{ width: "100%", height: "90vh", display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                backgroundColor: '#f5f5f5'
            }}>
                <Typography variant="h5" sx={{
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    color: '#333'
                }}>
                    Nhập thông tin thiết bị
                </Typography>

                <IconButton onClick={handleClose} sx={{ color: '#666' }}>
                    <CloseIcon />
                </IconButton>
            </Box>

            <Divider />

            {/* Form Content */}
            <Stack p={2} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Nhập thông tin chung */}
                <Box sx={{ border: '1px solid #ddd', p: 2 }}>
                    {/* Các trường nhập liệu cho thông tin chung */}
                    Thông tin chung
                </Box>
                {/* Thông tin chi tiết */}
                <Box sx={{ mt: 2, border: '1px solid #ddd', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} aria-label="detail tabs">
                            <Tab label="Thông số kỹ thuật" {...a11yProps(0)} />
                            <Tab label="Bảo trì & Bảo dưỡng" {...a11yProps(1)} />
                            <Tab label="Tài liệu đính kèm" {...a11yProps(2)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={tabValue} index={0}>
                        {/* Nội dung tab Thông số kỹ thuật */}
                        <Typography variant="h6" gutterBottom>Thông số kỹ thuật</Typography>
                        {/* Các trường nhập liệu cho thông số kỹ thuật */}
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={1}>
                        {/* Nội dung tab Bảo trì & Bảo dưỡng */}
                        <Typography variant="h6" gutterBottom>Bảo trì & Bảo dưỡng</Typography>
                        {/* Các trường nhập liệu cho bảo trì & bảo dưỡng */}
                    </CustomTabPanel>
                    <CustomTabPanel value={tabValue} index={2}>
                        {/* Nội dung tab Tài liệu đính kèm */}
                        <Typography variant="h6" gutterBottom>Tài liệu đính kèm</Typography>
                        {/* Các trường upload và quản lý tài liệu */}
                    </CustomTabPanel>
                </Box>
            </Stack>

            {/* Action Buttons */}
            <Box sx={{
                p: 2,
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 2,
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
            }}>
                <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<CancelIcon />}
                    sx={{
                        fontSize: '1.3rem',
                        minWidth: 120,
                        color: '#666',
                        borderColor: '#666'
                    }}
                >
                    Làm mới
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{
                        fontSize: '1.3rem',
                        minWidth: 120,
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': {
                            backgroundColor: '#ffebee',
                            borderColor: '#f44336'
                        }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    sx={{
                        fontSize: '1.3rem',
                        minWidth: 120,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#1565c0'
                        }
                    }}
                >
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}

export default AddAssetForm;