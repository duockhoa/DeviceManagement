import { useState } from 'react';
import { Box, Tab, Tabs, Typography } from '@mui/material';
import { TabContext, TabPanel } from '@mui/lab';
import MaintenanceList from '../../component/MaintenanceComponent/MaintenanceList';
import MaintenanceForm from '../../component/MaintenanceComponent/MaintenanceForm';

// Component quản lý bảo trì thiết bị
function Maintenance() {
    // State quản lý tab đang được chọn
    const [activeTab, setActiveTab] = useState('list');

    // Xử lý khi thay đổi tab
    const handleChangeTab = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', position: 'relative' }}>
            <Box sx={{ 
                flex: 1, 
                backgroundColor: '#fff', 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                p: 2
            }}>
                {/* Tiêu đề trang */}
                <Typography variant="h5" component="h1" gutterBottom>
                    Quản lý bảo trì thiết bị
                </Typography>

                {/* Tab navigation */}
                <TabContext value={activeTab}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs 
                            value={activeTab} 
                            onChange={handleChangeTab}
                            aria-label="Tabs quản lý bảo trì"
                        >
                            <Tab 
                                label="Danh sách bảo trì" 
                                value="list"
                            />
                            <Tab 
                                label="Thêm mới bảo trì" 
                                value="add"
                            />
                        </Tabs>
                    </Box>

                    {/* Tab content */}
                    <TabPanel value="list" sx={{ p: { xs: 1, md: 2 }, flex: 1 }}>
                        <MaintenanceList />
                    </TabPanel>
                    <TabPanel value="add" sx={{ p: { xs: 1, md: 2 }, flex: 1 }}>
                        <MaintenanceForm />
                    </TabPanel>
                </TabContext>
            </Box>
        </Box>
    );
}

export default Maintenance;
