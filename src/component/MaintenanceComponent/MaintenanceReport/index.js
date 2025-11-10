import { Box, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import { exportToExcel } from '../../../utils/exportUtils';

function MaintenanceReport() {
    const maintenanceList = useSelector(state => state.maintenance.items);
    // Dữ liệu mẫu cho biểu đồ
    const maintenanceData = [
        { month: 'T1', completed: 4, pending: 2, inProgress: 1 },
        { month: 'T2', completed: 3, pending: 3, inProgress: 2 },
        { month: 'T3', completed: 5, pending: 1, inProgress: 1 },
        // ... thêm dữ liệu các tháng khác
    ];

    // Thống kê tổng quan
    const statistics = {
        totalMaintenance: 65,
        completedMaintenance: 45,
        pendingMaintenance: 15,
        inProgressMaintenance: 5
    };

    return (
        <Box sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                    Báo cáo bảo trì thiết bị
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<FileDownloadIcon />}
                    onClick={() => {
                        const data = maintenanceList.map(item => ({
                            'ID': item.id,
                            'Thiết bị': item.deviceName,
                            'Loại bảo trì': item.maintenanceType,
                            'Ngày bảo trì': new Date(item.maintenanceDate).toLocaleDateString('vi-VN'),
                            'Trạng thái': item.status,
                            'Người phụ trách': item.technician,
                            'Mô tả': item.description
                        }));
                        exportToExcel(data, 'BaoCaoBaoTri');
                    }}
                >
                    Xuất Excel
                </Button>
            </Box>

            {/* Thống kê tổng quan */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Tổng số lần bảo trì
                            </Typography>
                            <Typography variant="h4">
                                {statistics.totalMaintenance}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Đã hoàn thành
                            </Typography>
                            <Typography variant="h4" color="success.main">
                                {statistics.completedMaintenance}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Đang chờ xử lý
                            </Typography>
                            <Typography variant="h4" color="warning.main">
                                {statistics.pendingMaintenance}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography color="textSecondary" gutterBottom>
                                Đang thực hiện
                            </Typography>
                            <Typography variant="h4" color="info.main">
                                {statistics.inProgressMaintenance}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Biểu đồ thống kê */}
            <Box sx={{ mt: 4, height: 400 }}>
                <Typography variant="subtitle1" gutterBottom>
                    Thống kê bảo trì theo tháng
                </Typography>
                <BarChart
                    width={800}
                    height={300}
                    data={maintenanceData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="completed" name="Hoàn thành" fill="#4caf50" />
                    <Bar dataKey="pending" name="Chờ xử lý" fill="#ff9800" />
                    <Bar dataKey="inProgress" name="Đang thực hiện" fill="#2196f3" />
                </BarChart>
            </Box>
        </Box>
    );
}

export default MaintenanceReport;