import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Grid,
    Paper,
    TextField,
    MenuItem,
    Button,
    Stack,
    Typography,
    Card,
    CardContent,
    Divider,
    Alert,
    CircularProgress
} from '@mui/material';
import dayjs from 'dayjs';
import { getAllAssets } from '../../../services/assetsService';
import { getMtbfReport, getOeeReport } from '../../../services/reportsService';

const toQueryParams = (filters) => {
    const params = { ...filters };
    if (params.dk_code) {
        params.dk_code = params.dk_code.trim().toUpperCase();
    }
    ['asset_id', 'planned_hours'].forEach((key) => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
            delete params[key];
        }
    });
    ['from', 'to'].forEach((key) => {
        if (!params[key]) delete params[key];
    });
    return params;
};

function StatCard({ title, value, subtitle, statusColor }) {
    return (
        <Card elevation={1} sx={{ height: '100%' }}>
            <CardContent>
                <Typography variant="subtitle2" sx={{ color: '#616161', mb: 0.5 }}>
                    {title}
                </Typography>
                <Typography variant="h4" sx={{ fontWeight: 700, color: statusColor || '#0D47A1' }}>
                    {value}
                </Typography>
                {subtitle ? (
                    <Typography variant="body2" sx={{ color: '#757575', mt: 0.5 }}>
                        {subtitle}
                    </Typography>
                ) : null}
            </CardContent>
        </Card>
    );
}

function StatusBanner({ status, message }) {
    if (status !== 'insufficient_data') return null;
    return (
        <Alert severity="warning" sx={{ mb: 2 }}>
            {message || 'Thiếu dữ liệu để tính toán. Vui lòng kiểm tra filter thời gian hoặc dk_code/thiết bị.'}
        </Alert>
    );
}

function OeeMtbfDashboard() {
    const [assets, setAssets] = useState([]);
    const [loadingAssets, setLoadingAssets] = useState(false);
    const [loadingReports, setLoadingReports] = useState(false);
    const [error, setError] = useState(null);
    const [oeeData, setOeeData] = useState(null);
    const [mtbfData, setMtbfData] = useState(null);

    const defaultFrom = dayjs().subtract(30, 'day').format('YYYY-MM-DD');
    const defaultTo = dayjs().format('YYYY-MM-DD');

    const [filters, setFilters] = useState({
        dk_code: '',
        asset_id: '',
        from: defaultFrom,
        to: defaultTo,
        planned_hours: 160
    });

    useEffect(() => {
        const loadAssets = async () => {
            setLoadingAssets(true);
            try {
                const res = await getAllAssets();
                setAssets(Array.isArray(res) ? res : []);
            } catch (err) {
                setAssets([]);
            } finally {
                setLoadingAssets(false);
            }
        };
        loadAssets();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = async () => {
        setLoadingReports(true);
        setError(null);
        try {
            const params = toQueryParams(filters);
            const [oeeRes, mtbfRes] = await Promise.all([
                getOeeReport(params),
                getMtbfReport(params)
            ]);
            setOeeData(oeeRes || null);
            setMtbfData(mtbfRes || null);
        } catch (err) {
            setError(err?.toString?.() || 'Không thể tải báo cáo');
            setOeeData(null);
            setMtbfData(null);
        } finally {
            setLoadingReports(false);
        }
    };

    const availabilityText = useMemo(() => {
        if (!oeeData) return '—';
        if (oeeData.availability == null) return 'N/A';
        return `${(oeeData.availability * 100).toFixed(2)}%`;
    }, [oeeData]);

    const mtbfText = useMemo(() => {
        if (!mtbfData || mtbfData.mtbf_calendar_hours_avg == null) return 'N/A';
        return `${mtbfData.mtbf_calendar_hours_avg} giờ`;
    }, [mtbfData]);

    const mttrText = useMemo(() => {
        if (!mtbfData || mtbfData.mttr_hours_avg == null) return 'N/A';
        return `${mtbfData.mttr_hours_avg} giờ`;
    }, [mtbfData]);

    const downtimeText = useMemo(() => {
        if (!oeeData || oeeData.downtime_hours == null) return 'N/A';
        return `${oeeData.downtime_hours} giờ`;
    }, [oeeData]);

    useEffect(() => {
        handleApply();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Dashboard OEE / MTBF (read-only)
            </Typography>

            <Paper sx={{ p: 2, mb: 2 }}>
                <Stack spacing={2} direction={{ xs: 'column', md: 'row' }}>
                    <TextField
                        label="Mã DK"
                        name="dk_code"
                        value={filters.dk_code}
                        onChange={handleChange}
                        placeholder="Nhập dk_code"
                        size="small"
                        fullWidth
                    />
                    <TextField
                        select
                        label="Thiết bị"
                        name="asset_id"
                        value={filters.asset_id}
                        onChange={handleChange}
                        size="small"
                        fullWidth
                        disabled={loadingAssets}
                    >
                        <MenuItem value="">Tất cả thiết bị</MenuItem>
                        {(assets || []).map((asset) => (
                            <MenuItem key={asset.id} value={asset.id}>
                                {(asset.dk_code || asset.asset_code || 'N/A')} - {asset.name}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        type="date"
                        label="Từ ngày"
                        name="from"
                        value={filters.from}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        type="date"
                        label="Đến ngày"
                        name="to"
                        value={filters.to}
                        onChange={handleChange}
                        size="small"
                        InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                        label="Planned hours"
                        name="planned_hours"
                        value={filters.planned_hours}
                        onChange={handleChange}
                        size="small"
                        type="number"
                        inputProps={{ min: 0 }}
                    />
                    <Button variant="contained" onClick={handleApply} disabled={loadingReports}>
                        {loadingReports ? <CircularProgress size={20} /> : 'Lọc'}
                    </Button>
                </Stack>
            </Paper>

            {error ? <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert> : null}

            <Grid container spacing={2}>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="Availability"
                        value={availabilityText}
                        subtitle={oeeData?.status || '—'}
                        statusColor={oeeData?.status === 'ok' ? '#2E7D32' : '#F9A825'}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="OEE (L1)"
                        value={availabilityText}
                        subtitle="Performance/Quality: placeholder"
                        statusColor={oeeData?.status === 'ok' ? '#2E7D32' : '#F9A825'}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="MTBF (giờ)"
                        value={mtbfText}
                        subtitle={mtbfData?.status || '—'}
                        statusColor={mtbfData?.status === 'ok' ? '#0D47A1' : '#F57C00'}
                    />
                </Grid>
                <Grid item xs={12} md={3}>
                    <StatCard
                        title="MTTR (giờ)"
                        value={mttrText}
                        subtitle={mtbfData?.status || '—'}
                        statusColor={mtbfData?.status === 'ok' ? '#0D47A1' : '#F57C00'}
                    />
                </Grid>
            </Grid>

            <Box sx={{ mt: 2 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Chi tiết OEE (Availability-only)
                    </Typography>
                    <StatusBanner status={oeeData?.status} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>Downtime (giờ)</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>{downtimeText}</Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>Planned hours</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {oeeData?.planned_hours != null ? oeeData.planned_hours : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>Status</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {oeeData?.status || '—'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>

            <Box sx={{ mt: 2 }}>
                <Paper sx={{ p: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1.5 }}>
                        Chi tiết MTBF / MTTR
                    </Typography>
                    <StatusBanner status={mtbfData?.status} />
                    <Grid container spacing={2}>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>Số sự cố</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {mtbfData?.failure_count != null ? mtbfData.failure_count : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>MTBF (giờ)</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {mtbfData?.mtbf_calendar_hours_avg != null ? mtbfData.mtbf_calendar_hours_avg : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography variant="body2" sx={{ color: '#616161' }}>MTTR (giờ)</Typography>
                                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                        {mtbfData?.mttr_hours_avg != null ? mtbfData.mttr_hours_avg : 'N/A'}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </Box>
    );
}

export default OeeMtbfDashboard;
