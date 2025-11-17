import { useState, useEffect } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Divider,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Assignment as AssignmentIcon,
    CheckCircle as CheckCircleIcon,
    Schedule as ScheduleIcon,
    Build as BuildIcon,
    AttachMoney as AttachMoneyIcon,
    CalendarMonth as CalendarMonthIcon
} from '@mui/icons-material';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import customAxios from '../../../services/customize-axios';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function MaintenanceReport() {
    const [period, setPeriod] = useState('month');
    const [summaryData, setSummaryData] = useState(null);
    const [monthlyData, setMonthlyData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReportData();
    }, [period]);

    const fetchReportData = async () => {
        try {
            setLoading(true);
            
            // Lấy báo cáo tổng hợp
            const summaryRes = await customAxios.get(`/maintenance/reports/summary?period=${period}`);
            setSummaryData(summaryRes.data.data);

            // Lấy báo cáo theo tháng
            const monthlyRes = await customAxios.get('/maintenance/reports/monthly');
            setMonthlyData(monthlyRes.data.data);
        } catch (error) {
            console.error('Error fetching report data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(value);
    };

    const renderTrendIcon = (value) => {
        if (parseFloat(value) > 0) {
            return <TrendingUpIcon sx={{ color: 'success.main', ml: 1 }} />;
        } else if (parseFloat(value) < 0) {
            return <TrendingDownIcon sx={{ color: 'error.main', ml: 1 }} />;
        }
        return null;
    };

    const maintenanceTypeData = summaryData ? [
        { name: 'Vệ sinh', value: summaryData.current.cleaning },
        { name: 'Kiểm tra', value: summaryData.current.inspection },
        { name: 'Bảo trì', value: summaryData.current.maintenance },
        { name: 'Sửa chữa', value: summaryData.current.repair }
    ] : [];

    const statusData = summaryData ? [
        { name: 'Hoàn thành', value: summaryData.current.completed },
        { name: 'Đang thực hiện', value: summaryData.current.in_progress },
        { name: 'Chờ phê duyệt', value: summaryData.current.awaiting_approval },
        { name: 'Chờ xử lý', value: summaryData.current.pending }
    ] : [];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography>Đang tải dữ liệu...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                    <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                    Báo cáo tổng hợp bảo trì
                </Typography>
                
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Kỳ báo cáo</InputLabel>
                    <Select
                        value={period}
                        label="Kỳ báo cáo"
                        onChange={(e) => setPeriod(e.target.value)}
                    >
                        <MenuItem value="week">Tuần này</MenuItem>
                        <MenuItem value="month">Tháng này</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            {summaryData && (
                <>
                    {/* Cards thống kê tổng quan */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <AssignmentIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                {summaryData.current.total}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                                Tổng số lệnh
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Chip 
                                            label={`${summaryData.changes.total > 0 ? '+' : ''}${summaryData.changes.total}%`}
                                            size="small"
                                            sx={{ 
                                                bgcolor: parseFloat(summaryData.changes.total) >= 0 ? '#4caf50' : '#f44336',
                                                color: '#fff',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ ml: 1, color: '#fff' }}>
                                            so với kỳ trước
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <CheckCircleIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                {summaryData.current.completionRate}%
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                                Tỉ lệ hoàn thành
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Typography variant="caption" sx={{ color: '#fff' }}>
                                        {summaryData.current.completed}/{summaryData.current.total} lệnh hoàn thành
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <BuildIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                {summaryData.current.cleaning + summaryData.current.inspection + summaryData.current.maintenance + summaryData.current.repair}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                                Tổng công việc
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                        <Chip label={`VS: ${summaryData.current.cleaning}`} size="small" sx={{ bgcolor: '#fff', fontSize: '0.7rem' }} />
                                        <Chip label={`KT: ${summaryData.current.inspection}`} size="small" sx={{ bgcolor: '#fff', fontSize: '0.7rem' }} />
                                        <Chip label={`BT: ${summaryData.current.maintenance}`} size="small" sx={{ bgcolor: '#fff', fontSize: '0.7rem' }} />
                                        <Chip label={`SC: ${summaryData.current.repair}`} size="small" sx={{ bgcolor: '#fff', fontSize: '0.7rem' }} />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={3}>
                            <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                                <CardContent>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <AttachMoneyIcon sx={{ fontSize: 40, color: '#fff', mr: 2 }} />
                                        <Box>
                                            <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                {formatCurrency(summaryData.current.totalCost)}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: '#fff' }}>
                                                Chi phí bảo trì
                                            </Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                                        <Chip 
                                            label={`${summaryData.changes.cost > 0 ? '+' : ''}${summaryData.changes.cost}%`}
                                            size="small"
                                            sx={{ 
                                                bgcolor: parseFloat(summaryData.changes.cost) >= 0 ? '#ff9800' : '#4caf50',
                                                color: '#fff',
                                                fontWeight: 'bold'
                                            }}
                                        />
                                        <Typography variant="caption" sx={{ ml: 1, color: '#fff' }}>
                                            so với kỳ trước
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Biểu đồ */}
                    <Grid container spacing={3} sx={{ mb: 3 }}>
                        {/* Biểu đồ phân loại công việc */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Phân loại công việc bảo trì
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={maintenanceTypeData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {maintenanceTypeData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>

                        {/* Biểu đồ trạng thái */}
                        <Grid item xs={12} md={6}>
                            <Paper sx={{ p: 3 }}>
                                <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                    Trạng thái lệnh bảo trì
                                </Typography>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={statusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, value }) => `${name}: ${value}`}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {statusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Paper>
                        </Grid>
                    </Grid>

                    {/* Biểu đồ xu hướng theo tháng */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            <CalendarMonthIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Xu hướng bảo trì 12 tháng gần nhất
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <LineChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis yAxisId="left" />
                                <YAxis yAxisId="right" orientation="right" />
                                <Tooltip />
                                <Legend />
                                <Line yAxisId="left" type="monotone" dataKey="total" stroke="#8884d8" name="Tổng lệnh" />
                                <Line yAxisId="left" type="monotone" dataKey="completed" stroke="#82ca9d" name="Hoàn thành" />
                                <Line yAxisId="right" type="monotone" dataKey="totalCost" stroke="#ffc658" name="Chi phí" />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>

                    {/* Biểu đồ cột theo loại công việc */}
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                            Phân loại công việc theo tháng
                        </Typography>
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart data={monthlyData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="cleaning" fill="#4caf50" name="Vệ sinh" />
                                <Bar dataKey="inspection" fill="#ff9800" name="Kiểm tra" />
                                <Bar dataKey="maintenance" fill="#2196f3" name="Bảo trì" />
                                <Bar dataKey="repair" fill="#f44336" name="Sửa chữa" />
                            </BarChart>
                        </ResponsiveContainer>
                    </Paper>

                    {/* Bảng thống kê theo thiết bị */}
                    {summaryData.assetStats && summaryData.assetStats.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Thống kê theo thiết bị
                            </Typography>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: '#1976d2' }}>
                                            <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Thiết bị</TableCell>
                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Tổng</TableCell>
                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Vệ sinh</TableCell>
                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Kiểm tra</TableCell>
                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Bảo trì</TableCell>
                                            <TableCell align="center" sx={{ color: '#fff', fontWeight: 'bold' }}>Sửa chữa</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {summaryData.assetStats.map((asset, index) => (
                                            <TableRow key={index} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                                                <TableCell sx={{ fontWeight: 500 }}>{asset.assetName}</TableCell>
                                                <TableCell align="center">{asset.total}</TableCell>
                                                <TableCell align="center">{asset.cleaning || 0}</TableCell>
                                                <TableCell align="center">{asset.inspection || 0}</TableCell>
                                                <TableCell align="center">{asset.maintenance || 0}</TableCell>
                                                <TableCell align="center">{asset.repair || 0}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    )}
                </>
            )}
        </Box>
    );
}

export default MaintenanceReport;
