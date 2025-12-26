import { useEffect, useMemo, useState } from 'react';
import { Paper, Box, Grid, Card, CardContent, Typography, LinearProgress, Chip, Avatar, Divider } from '@mui/material';
import {
    Devices as DevicesIcon,
    Build as BuildIcon,
    Warning as WarningIcon,
    CheckCircle as CheckCircleIcon,
    TrendingUp as TrendingUpIcon,
    ReportProblem as ReportProblemIcon,
    Security as SecurityIcon,
    Speed as SpeedIcon,
    AccessTime as AccessTimeIcon,
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
import incidentsService from '../../services/incidentsService';
import { getAllAssets } from '../../services/assetsService';
import { getAllMaintenance } from '../../services/maintenanceService';
import { getOeeReport } from '../../services/reportsService';
const severityConfig = {
    critical: { label: 'Khẩn cấp', color: '#d32f2f', weight: 4 },
    high: { label: 'Cao', color: '#f57c00', weight: 3 },
    medium: { label: 'Trung bình', color: '#0288d1', weight: 2 },
    low: { label: 'Thấp', color: '#2e7d32', weight: 1 },
};

const statusConfig = {
    reported: { label: 'Đã báo cáo', color: '#512da8', progress: 10 },
    triaged: { label: 'Đã phân loại', color: '#1976d2', progress: 20 },
    out_of_service: { label: 'Ngừng hoạt động', color: '#d32f2f', progress: 30 },
    assigned: { label: 'Đã phân công', color: '#0288d1', progress: 40 },
    in_progress: { label: 'Đang xử lý', color: '#0288d1', progress: 60 },
    post_fix_check: { label: 'Đang kiểm tra', color: '#f57c00', progress: 80 },
    resolved: { label: 'Đã xử lý', color: '#2e7d32', progress: 90 },
    closed: { label: 'Đã đóng', color: '#616161', progress: 100 },
    cancelled: { label: 'Đã hủy', color: '#757575', progress: 100 }
};

const formatRelativeTime = (value) => {
    if (!value) return 'Chưa cập nhật';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Chưa cập nhật';
    const diffMinutes = Math.round((Date.now() - date.getTime()) / 60000);
    if (diffMinutes < 1) return 'Vừa xong';
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    const hours = Math.round(diffMinutes / 60);
    if (hours < 24) return `${hours} giờ trước`;
    const days = Math.round(hours / 24);
    return `${days} ngày trước`;
};

const formatMinutes = (minutes) => {
    if (!minutes && minutes !== 0) return 'Chưa có dữ liệu';
    if (minutes < 1) return '< 1 phút';
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    if (hours === 0) return `${mins} phút`;
    return `${hours}h ${mins}p`;
};

function DashBoard() {
    const [assets, setAssets] = useState([]);
    const [maintenances, setMaintenances] = useState([]);
    const [incidentStats, setIncidentStats] = useState({ total: 0, byStatus: [], bySeverity: [] });
    const [incidentList, setIncidentList] = useState([]);
    const [incidentError, setIncidentError] = useState(null);
    const [incidentLoading, setIncidentLoading] = useState(false);
    const [summaryLoading, setSummaryLoading] = useState(false);
    const [summaryError, setSummaryError] = useState(null);
    const [oeeStat, setOeeStat] = useState({ data: null, loading: false, error: null });

    const plannedDailyHours = 24; // giả định 24h/day cho biểu đồ đường (ước tính từ downtime sự cố)

    useEffect(() => {
        const loadIncidents = async () => {
            setIncidentLoading(true);
            setIncidentError(null);
            try {
                const [statsRes, listRes] = await Promise.all([
                    incidentsService.getIncidentStatistics(),
                    incidentsService.getAllIncidents(),
                ]);
                setIncidentStats(statsRes || { total: 0, byStatus: [], bySeverity: [] });
                setIncidentList(Array.isArray(listRes) ? listRes : []);
            } catch (error) {
                setIncidentError(error?.toString?.() || 'Không thể tải dữ liệu sự cố');
                setIncidentStats({ total: 0, byStatus: [], bySeverity: [] });
                setIncidentList([]);
            } finally {
                setIncidentLoading(false);
            }
        };
        loadIncidents();
    }, []);

    useEffect(() => {
        const loadSummary = async () => {
            setSummaryLoading(true);
            setSummaryError(null);
            try {
                const [assetRes, maintenanceRes] = await Promise.all([getAllAssets(), getAllMaintenance()]);
                const assetList = Array.isArray(assetRes) ? assetRes : assetRes?.data || [];
                const maintenanceList = Array.isArray(maintenanceRes) ? maintenanceRes : maintenanceRes?.data || [];
                setAssets(assetList);
                setMaintenances(maintenanceList);
            } catch (error) {
                setSummaryError(error?.toString?.() || 'Không thể tải dữ liệu thiết bị/bảo trì');
                setAssets([]);
                setMaintenances([]);
            } finally {
                setSummaryLoading(false);
            }
        };
        loadSummary();
    }, []);

    useEffect(() => {
        const loadOee = async () => {
            setOeeStat((prev) => ({ ...prev, loading: true, error: null }));
            try {
                const to = new Date();
                const from = new Date();
                from.setDate(to.getDate() - 30);
                const res = await getOeeReport({ from: from.toISOString(), to: to.toISOString(), planned_hours: 160 });
                setOeeStat({ data: res || null, loading: false, error: null });
            } catch (error) {
                setOeeStat({ data: null, loading: false, error: error?.response?.data?.message || error.message });
            }
        };
        loadOee();
    }, []);

    const statusCounts = useMemo(() => {
        const counts = {};
        (incidentStats.byStatus || []).forEach((item) => {
            const status = item?.status || item?.dataValues?.status;
            const count = Number(item?.count ?? item?.dataValues?.count ?? 0);
            if (status) counts[status] = count;
        });
        return counts;
    }, [incidentStats]);

    const severityCounts = useMemo(() => {
        const counts = {};
        (incidentStats.bySeverity || []).forEach((item) => {
            const severity = item?.severity || item?.dataValues?.severity;
            const count = Number(item?.count ?? item?.dataValues?.count ?? 0);
            if (severity) counts[severity] = count;
        });
        return counts;
    }, [incidentStats]);

    // Biểu đồ đường OEE (Availability ước tính từ downtime sự cố theo ngày, plannedDailyHours cố định)
    const oeeLineData = useMemo(() => {
        if (!incidentList || !incidentList.length) return [];
        const map = new Map();
        incidentList.forEach((inc) => {
            const d = inc.reported_date ? new Date(inc.reported_date) : null;
            if (!d || Number.isNaN(d.getTime())) return;
            const key = d.toISOString().slice(0, 10);
            const prev = map.get(key) || 0;
            const dt = inc.downtime_hours != null ? Number(inc.downtime_hours) : 0;
            map.set(key, prev + (Number.isFinite(dt) ? dt : 0));
        });
        const keys = Array.from(map.keys()).sort();
        return keys.map((k) => {
            const downtime = map.get(k) || 0;
            const planned = plannedDailyHours;
            const availability = planned > 0 ? Math.max(0, Math.min(1, (planned - downtime) / planned)) : null;
            return { date: k, downtime, availability: availability != null ? Number(availability.toFixed(3)) : null };
        });
    }, [incidentList]);

    const openIncidentCount = useMemo(() => {
        const openStatuses = ['reported', 'investigating', 'in_progress'];
        return openStatuses.reduce((sum, key) => sum + (statusCounts[key] || 0), 0);
    }, [statusCounts]);

    const riskScore = useMemo(() => {
        const total = Object.values(severityCounts).reduce((sum, val) => sum + val, 0);
        if (!total) return 0;
        const maxWeight = 4;
        const weighted = Object.entries(severityCounts).reduce((sum, [severity, count]) => {
            const weight = severityConfig[severity]?.weight || 1;
            return sum + weight * count;
        }, 0);
        return Math.min(100, Math.round((weighted / (total * maxWeight)) * 100));
    }, [severityCounts]);

    const avgResponseText = useMemo(() => {
        const durations = (incidentList || [])
            .map((incident) => {
                const start = incident.started_date || incident.resolved_date || incident.closed_date;
                const reported = incident.reported_date;
                if (!start || !reported) return null;
                const diffMinutes = (new Date(start) - new Date(reported)) / 60000;
                if (!Number.isFinite(diffMinutes) || diffMinutes < 0) return null;
                return diffMinutes;
            })
            .filter((v) => v !== null);

        if (!durations.length) return 'Chưa có dữ liệu';
        const avg = durations.reduce((sum, v) => sum + v, 0) / durations.length;
        return formatMinutes(avg);
    }, [incidentList]);

    const incidentsToShow = useMemo(() => (incidentList || []).slice(0, 3), [incidentList]);

    const totalDevices = assets.length;
    const activeDevices = assets.filter((item) => item.status === 'active').length;
    const maintenanceOpen = maintenances.filter((m) => ['pending', 'in_progress', 'awaiting_approval'].includes(m.status)).length;
    const deviceStats = useMemo(() => {
        const palette = ['#1976d2', '#388e3c', '#f57c00', '#7b1fa2', '#00897b', '#c2185b'];
        const counts = {};
        assets.forEach((asset) => {
            const category = asset?.SubCategory?.Category?.name || asset?.SubCategory?.name || 'Khác';
            counts[category] = (counts[category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, count], idx) => ({ name, count, color: palette[idx % palette.length] }));
    }, [assets]);

    const statusData = useMemo(() => {
        return [
            { name: 'Hoạt động tốt', value: activeDevices, color: '#4caf50' },
            { name: 'Cần bảo trì', value: maintenanceOpen, color: '#ff9800' },
            { name: 'Hỏng hóc', value: openIncidentCount, color: '#f44336' },
        ];
    }, [activeDevices, maintenanceOpen, openIncidentCount]);

    const maintenanceData = useMemo(() => {
        const now = new Date();
        const months = [];
        for (let i = 5; i >= 0; i -= 1) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            months.push({ key: `${date.getFullYear()}-${date.getMonth() + 1}`, label: `T${date.getMonth() + 1}` });
        }

        return months.map(({ key, label }) => {
            const [year, month] = key.split('-').map((v) => parseInt(v, 10));
            const scheduled = maintenances.filter((m) => {
                const d = new Date(m.scheduled_date);
                return d.getFullYear() === year && d.getMonth() + 1 === month;
            }).length;
            const completed = maintenances.filter((m) => {
                const endDate = m.actual_end_date || m.scheduled_date;
                const d = new Date(endDate);
                return m.status === 'completed' && d.getFullYear() === year && d.getMonth() + 1 === month;
            }).length;
            return { month: label, scheduled, completed };
        });
    }, [maintenances]);

    const getSeverityColor = (severity) => severityConfig[severity]?.color || '#616161';
    const getSeverityLabel = (severity) => severityConfig[severity]?.label || severity || 'N/A';
    const getStatusLabel = (status) => statusConfig[status]?.label || status || 'N/A';
    const getStatusColor = (status) => statusConfig[status]?.color || '#616161';
    const getProgressFromStatus = (status) => statusConfig[status]?.progress || 0;

    return (
        <Box p={3} sx={{ height: '100%', backgroundColor: '#f5f5f5', overflow: 'auto' }} component={Paper}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                Tổng quan quản lý thiết bị
            </Typography>
            {summaryError && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {summaryError}
                </Typography>
            )}

            {/* Cards thống kê tổng quan */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #0D47A1 0%, #42a5f5 100%)' }}>
                        <CardContent sx={{ color: 'white' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {oeeStat.loading ? '...' : (oeeStat.data?.availability != null ? `${(oeeStat.data.availability * 100).toFixed(1)}%` : 'N/A')}
                                    </Typography>
                                    <Typography variant="body2">OEE (Availability)</Typography>
                                    <Typography variant="caption" display="block">
                                        {oeeStat.error ? `Lỗi: ${oeeStat.error}` : `Downtime: ${oeeStat.data?.downtime_hours != null ? oeeStat.data.downtime_hours.toFixed(2) : '—'}h`}
                                    </Typography>
                                    <Typography variant="caption" display="block">
                                        {oeeStat.data?.status || '—'}{oeeStat.data?.source ? ` • ${oeeStat.data.source}` : ''}
                                    </Typography>
                                </Box>
                                <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 56, height: 56 }}>
                                    <TrendingUpIcon fontSize="large" />
                                </Avatar>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card sx={{ height: '100%', background: 'linear-gradient(135deg, #1976d2 0%, #42a5f5 100%)' }}>
                        <CardContent sx={{ color: 'white' }}>
                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {summaryLoading ? '...' : totalDevices}
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
                                        {summaryLoading ? '...' : activeDevices}
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
                                        {summaryLoading ? '...' : maintenanceOpen}
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
                                        {incidentLoading ? '...' : openIncidentCount}
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

                {/* Biểu đồ đường - OEE (Availability ước tính theo downtime sự cố) */}
                <Grid item xs={12} md={6}>
                    <Card sx={{ height: 400 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                                OEE (Availability) theo ngày
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Nguồn: downtime sự cố; planned_hours/ngày giả định {plannedDailyHours}h. Nếu thiếu dữ liệu downtime, đường sẽ phẳng ở 100%.
                            </Typography>
                            <ResponsiveContainer width="100%" height={280}>
                                <LineChart data={oeeLineData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                    <YAxis domain={[0, 1]} tickFormatter={(v) => `${Math.round(v * 100)}%`} />
                                    <Tooltip formatter={(v, n) => (n === 'availability' ? `${(v * 100).toFixed(2)}%` : v)} />
                                    <Line type="monotone" dataKey="availability" stroke="#0D47A1" strokeWidth={2} dot={false} isAnimationActive={false} />
                                </LineChart>
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

            {/* Đánh giá sự cố & rủi ro */}
            <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                    <Card>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                <Box>
                                    <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', mb: 0 }}>
                                        Đánh giá sự cố & rủi ro
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Ưu tiên xử lý sự cố ảnh hưởng vận hành thiết bị và dịch vụ
                                    </Typography>
                                </Box>
                                <Chip
                                    icon={<TrendingUpIcon />}
                                    label={incidentLoading ? 'Đang tải dữ liệu...' : 'Bảng theo dõi trực tiếp'}
                                    sx={{ backgroundColor: '#e3f2fd', fontWeight: 'bold' }}
                                />
                            </Box>

                            <Grid container spacing={2} mb={1}>
                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #fff8e1 0%, #fff3e0 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '#f57c00' }}>
                                            <ReportProblemIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h5" fontWeight="bold">
                                                {openIncidentCount}
                                            </Typography>
                                            <Typography variant="body2">Sự cố đang mở</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #e8f5e9 0%, #f1f8e9 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '#2e7d32' }}>
                                            <SpeedIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">
                                                {avgResponseText}
                                            </Typography>
                                            <Typography variant="body2">Thời gian phản hồi trung bình</Typography>
                                        </Box>
                                    </Box>
                                </Grid>

                                <Grid item xs={12} md={4}>
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            background: 'linear-gradient(135deg, #e3f2fd 0%, #e8eaf6 100%)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 2,
                                        }}
                                    >
                                        <Avatar sx={{ bgcolor: '#3949ab' }}>
                                            <SecurityIcon />
                                        </Avatar>
                                        <Box width="100%">
                                            <Typography variant="body2" fontWeight="bold">
                                                Điểm rủi ro hiện tại
                                            </Typography>
                                            <LinearProgress
                                                variant="determinate"
                                                value={riskScore}
                                                sx={{ height: 8, borderRadius: 4, backgroundColor: '#c5cae9' }}
                                            />
                                            <Typography variant="caption" color="text.secondary">
                                                {riskScore}% ngưỡng cảnh báo
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                                {incidentError && (
                                    <Grid item xs={12}>
                                        <Typography color="error" variant="body2">
                                            {incidentError}
                                        </Typography>
                                    </Grid>
                                )}

                                {!incidentError && !incidentLoading && incidentsToShow.length === 0 && (
                                    <Grid item xs={12}>
                                        <Typography variant="body2" color="text.secondary">
                                            Chưa có sự cố nào được ghi nhận.
                                        </Typography>
                                    </Grid>
                                )}

                                {incidentsToShow.map((incident) => (
                                    <Grid item xs={12} md={4} key={incident.id}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: 2,
                                                backgroundColor: '#fafafa',
                                                border: '1px solid #e0e0e0',
                                                height: '100%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                gap: 1,
                                            }}
                                        >
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <Box display="flex" alignItems="center" gap={1.5}>
                                                    <Avatar sx={{ bgcolor: getSeverityColor(incident.severity) }}>
                                                        <WarningIcon />
                                                    </Avatar>
                                                    <Box>
                                                        <Typography variant="subtitle1" fontWeight="bold">
                                                            {incident.title}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Mã {incident.incident_code || incident.id} •{' '}
                                                            {incident.assignee?.name || incident.reporter?.name || 'Chưa phân công'}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                                <Chip
                                                    label={getSeverityLabel(incident.severity)}
                                                    size="small"
                                                    sx={{
                                                        fontWeight: 'bold',
                                                        backgroundColor: `${getSeverityColor(incident.severity)}22`,
                                                        color: getSeverityColor(incident.severity),
                                                    }}
                                                />
                                            </Box>

                                            <Typography variant="body2" color="text.secondary">
                                                {incident.impact || incident.description || 'Chưa cập nhật tác động'}
                                            </Typography>

                                            <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                                                <Chip
                                                    label={getStatusLabel(incident.status)}
                                                    size="small"
                                                    sx={{
                                                        backgroundColor: `${getStatusColor(incident.status)}22`,
                                                        color: getStatusColor(incident.status),
                                                        fontWeight: 'bold',
                                                    }}
                                                />
                                                <Chip
                                                    icon={<AccessTimeIcon />}
                                                    label={formatRelativeTime(incident.updated_at || incident.reported_date)}
                                                    size="small"
                                                    sx={{ backgroundColor: '#f5f5f5' }}
                                                />
                                            </Box>

                                            <Box mt={1}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={getProgressFromStatus(incident.status)}
                                                    sx={{
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#e0e0e0',
                                                        '& .MuiLinearProgress-bar': {
                                                            backgroundColor: getSeverityColor(incident.severity),
                                                        },
                                                    }}
                                                />
                                                <Typography variant="caption" color="text.secondary" align="right">
                                                    Hoàn thành {getProgressFromStatus(incident.status)}%
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

        </Box>
    );
}

export default DashBoard;
