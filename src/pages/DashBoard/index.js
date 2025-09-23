import { Paper, Box, Grid, Card, CardContent, Typography, LinearProgress, Chip, Avatar } from '@mui/material';
import {
    Devices as DevicesIcon,
    Build as BuildIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    TrendingUp as TrendingUpIcon,
    Assignment as AssignmentIcon,
} from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    ResponsiveContainer,
} from 'recharts';

// Dữ liệu mẫu
const deviceStats = [
    { name: 'Thiết bị y tế', count: 45, color: '#1976d2' },
    { name: 'Máy sản xuất', count: 32, color: '#388e3c' },
    { name: 'Thiết bị văn phòng', count: 28, color: '#f57c00' },
    { name: 'Thiết bị khác', count: 15, color: '#7b1fa2' },
];

const statusData = [
    { name: 'Hoạt động tốt', value: 85, color: '#4caf50' },
    { name: 'Cần bảo trì', value: 12, color: '#ff9800' },
    { name: 'Hỏng hóc', value: 3, color: '#f44336' },
];

const maintenanceData = [
    { month: 'T1', scheduled: 8, completed: 6 },
    { month: 'T2', scheduled: 12, completed: 10 },
    { month: 'T3', scheduled: 15, completed: 14 },
    { month: 'T4', scheduled: 10, completed: 9 },
    { month: 'T5', scheduled: 18, completed: 16 },
    { month: 'T6', scheduled: 14, completed: 13 },
];

function DashBoard() {
    return (
        <Box p={3} sx={{ height: '100%', backgroundColor: '#f5f5f5', overflow: 'auto' }} component={Paper}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                Tổng quan quản lý thiết bị
            </Typography>

            {/* Cards thống kê tổng quan */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
                        <CardContent sx={{ color: 'white' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        120
                                    </Typography>
                                    <Typography variant="body2">Tổng thiết bị</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <DevicesIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #388e3c 0%, #66bb6a 100%)' }}>
                        <CardContent sx={{ color: 'white' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        102
                                    </Typography>
                                    <Typography variant="body2">Hoạt động tốt</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <CheckCircleIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f57c00 0%, #ffb74d 100%)' }}>
                        <CardContent sx={{ color: 'white' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        15
                                    </Typography>
                                    <Typography variant="body2">Cần bảo trì</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <BuildIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #d32f2f 0%, #ef5350 100%)' }}>
                        <CardContent sx={{ color: 'white' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        3
                                    </Typography>
                                    <Typography variant="body2">Hỏng hóc</Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <WarningIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Biểu đồ và thống kê */}
            <Grid container spacing={3}>
                {/* Biểu đồ cột - Thiết bị theo loại */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Thiết bị theo loại
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={deviceStats}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="count" fill="#1976d2" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Biểu đồ tròn - Trạng thái thiết bị */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Trạng thái thiết bị
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}%`}
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Biểu đồ đường - Lịch bảo trì */}
                <Grid item xs={12} md={8}>
                    <Card sx={{ height: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Lịch bảo trì 6 tháng qua
                            </Typography>
                            <ResponsiveContainer width="100%" height={300}>
                                <LineChart data={maintenanceData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="month" />
                                    <YAxis />
                                    <Tooltip />
                                    <Line
                                        type="monotone"
                                        dataKey="scheduled"
                                        stroke="#1976d2"
                                        name="Dự kiến"
                                        strokeWidth={2}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="completed"
                                        stroke="#4caf50"
                                        name="Hoàn thành"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Thông báo nhanh */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                Thông báo quan trọng
                            </Typography>
                            <Box sx={{ mt: 2 }}>
                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: '#fff3e0',
                                        borderRadius: 1,
                                        borderLeft: '4px solid #ff9800',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Máy X-Ray phòng 201
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Cần bảo trì định kỳ trong 3 ngày
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: '#ffebee',
                                        borderRadius: 1,
                                        borderLeft: '4px solid #f44336',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Máy ly tâm Lab
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Báo lỗi - cần kiểm tra ngay
                                    </Typography>
                                </Box>

                                <Box
                                    sx={{
                                        mb: 2,
                                        p: 2,
                                        backgroundColor: '#e8f5e8',
                                        borderRadius: 1,
                                        borderLeft: '4px solid #4caf50',
                                    }}
                                >
                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                        Máy siêu âm
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Bảo trì hoàn thành - hoạt động tốt
                                    </Typography>
                                </Box>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}

export default DashBoard;
