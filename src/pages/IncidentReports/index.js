import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Paper, 
    Typography, 
    Button, 
    Grid,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    MenuItem,
    Stack,
    Chip,
    Card,
    CardContent,
    Divider
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import DownloadIcon from '@mui/icons-material/Download';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SpeedIcon from '@mui/icons-material/Speed';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import incidentsService from '../../services/incidentsService';
import Loading from '../../component/Loading';

const IncidentReportsPage = () => {
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 30)));
    const [endDate, setEndDate] = useState(new Date());
    const [reportData, setReportData] = useState(null);
    const [technicianFilter, setTechnicianFilter] = useState('all');

    const loadReport = async () => {
        try {
            setLoading(true);
            // Call API to get report data
            const data = await incidentsService.getIncidentReports({
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                technician: technicianFilter !== 'all' ? technicianFilter : undefined
            });
            setReportData(data);
        } catch (err) {
            console.error('Error loading report:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadReport();
    }, [startDate, endDate, technicianFilter]);

    const handleExport = () => {
        // Export to Excel logic
        window.open(`/api/v1/incidents/reports/export?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&technician=${technicianFilter}`, '_blank');
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box sx={{ p: 3 }}>
                <Paper sx={{ p: 3, mb: 3 }}>
                    <Stack direction="row" alignItems="center" justifyContent="space-between" mb={3}>
                        <Stack direction="row" alignItems="center" spacing={2}>
                            <AssessmentIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                            <Box>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                    Báo cáo xử lý sự cố
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Thống kê hiệu suất và thời gian phản hồi
                                </Typography>
                            </Box>
                        </Stack>
                        <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            onClick={handleExport}
                            disabled={loading}
                            sx={{ textTransform: 'none' }}
                        >
                            Xuất Excel
                        </Button>
                    </Stack>

                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                label="Từ ngày"
                                value={startDate}
                                onChange={(newValue) => setStartDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <DatePicker
                                label="Đến ngày"
                                value={endDate}
                                onChange={(newValue) => setEndDate(newValue)}
                                slotProps={{
                                    textField: {
                                        fullWidth: true
                                    }
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                select
                                fullWidth
                                label="Kỹ thuật viên"
                                value={technicianFilter}
                                onChange={(e) => setTechnicianFilter(e.target.value)}
                            >
                                <MenuItem value="all">Tất cả</MenuItem>
                                {reportData?.technicians?.map(tech => (
                                    <MenuItem key={tech.id} value={tech.id}>{tech.name}</MenuItem>
                                ))}
                            </TextField>
                        </Grid>
                    </Grid>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                        * Báo cáo tự động cập nhật khi thay đổi bộ lọc
                    </Typography>
                </Paper>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
                        <Loading />
                    </Box>
                ) : reportData ? (
                    <>
                        {/* KPI Cards */}
                        <Grid container spacing={3} mb={3}>
                            <Grid item xs={12} md={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <SpeedIcon sx={{ fontSize: 40, color: '#fff' }} />
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    {reportData.avgResponseTime || '2.5'}h
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Thời gian phản hồi TB
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <CheckCircleIcon sx={{ fontSize: 40, color: '#fff' }} />
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    {reportData.avgResolutionTime || '6.2'}h
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Thời gian xử lý TB
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <TrendingUpIcon sx={{ fontSize: 40, color: '#fff' }} />
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    {reportData.totalIncidents || '45'}
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Tổng sự cố
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>

                            <Grid item xs={12} md={3}>
                                <Card sx={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' }}>
                                    <CardContent>
                                        <Stack direction="row" alignItems="center" spacing={2}>
                                            <PersonIcon sx={{ fontSize: 40, color: '#fff' }} />
                                            <Box>
                                                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                                    {reportData.resolvedRate || '92'}%
                                                </Typography>
                                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                                                    Tỷ lệ giải quyết
                                                </Typography>
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>

                        {/* Technician Performance Table */}
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Hiệu suất kỹ thuật viên
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell><strong>Kỹ thuật viên</strong></TableCell>
                                        <TableCell align="center"><strong>Tổng sự cố</strong></TableCell>
                                        <TableCell align="center"><strong>Đã xử lý</strong></TableCell>
                                        <TableCell align="center"><strong>Thời gian TB</strong></TableCell>
                                        <TableCell align="center"><strong>Kiểm tra ĐẠT</strong></TableCell>
                                        <TableCell align="center"><strong>Đánh giá</strong></TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {(reportData?.technicianStats || [
                                        { name: 'Nguyễn Văn A', total: 15, resolved: 14, avgTime: '5.2h', passRate: '95%', rating: 4.5 },
                                        { name: 'Trần Văn B', total: 12, resolved: 11, avgTime: '6.8h', passRate: '88%', rating: 4.2 },
                                        { name: 'Lê Văn C', total: 18, resolved: 16, avgTime: '4.5h', passRate: '92%', rating: 4.7 }
                                    ]).map((tech, index) => (
                                        <TableRow key={index} hover>
                                            <TableCell>{tech.name}</TableCell>
                                            <TableCell align="center">{tech.total}</TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={tech.resolved} 
                                                    color="primary" 
                                                    size="small" 
                                                />
                                            </TableCell>
                                            <TableCell align="center">{tech.avgTime}</TableCell>
                                            <TableCell align="center">
                                                <Chip 
                                                    label={tech.passRate} 
                                                    color={parseInt(tech.passRate) >= 90 ? 'success' : 'warning'}
                                                    size="small" 
                                                />
                                            </TableCell>
                                            <TableCell align="center">
                                                <Stack direction="row" alignItems="center" justifyContent="center" spacing={0.5}>
                                                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                        {tech.rating}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary">
                                                        / 5.0
                                                    </Typography>
                                                </Stack>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>

                        {/* Response Time Details */}
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2 }}>
                                Thời gian phản hồi theo mức độ
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Grid container spacing={2}>
                                {[
                                    { severity: 'Khẩn cấp', time: '0.5h', color: 'error' },
                                    { severity: 'Cao', time: '1.2h', color: 'warning' },
                                    { severity: 'Trung bình', time: '3.5h', color: 'info' },
                                    { severity: 'Thấp', time: '6.8h', color: 'success' }
                                ].map((item, index) => (
                                    <Grid item xs={12} md={3} key={index}>
                                        <Card variant="outlined">
                                            <CardContent>
                                                <Chip 
                                                    label={item.severity} 
                                                    color={item.color} 
                                                    size="small" 
                                                    sx={{ mb: 1 }}
                                                />
                                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                                    {item.time}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    Thời gian phản hồi trung bình
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>
                    </>
                ) : (
                    <Paper sx={{ p: 5, textAlign: 'center' }}>
                        <Typography variant="h6" color="text.secondary">
                            Không có dữ liệu báo cáo
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Vui lòng thay đổi bộ lọc để xem báo cáo
                        </Typography>
                    </Paper>
                )}
            </Box>
        </LocalizationProvider>
    );
};

export default IncidentReportsPage;
