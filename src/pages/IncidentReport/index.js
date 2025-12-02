import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Divider,
    Grid,
    MenuItem,
    Paper,
    Stack,
    Switch,
    TextField,
    Typography,
} from '@mui/material';
import incidentsService from '../../services/incidentsService';
import { getAllAssets } from '../../services/assetsService';
import Loading from '../../component/Loading';

const severityOptions = [
    { value: 'critical', label: 'Khẩn cấp' },
    { value: 'high', label: 'Cao' },
    { value: 'medium', label: 'Trung bình' },
    { value: 'low', label: 'Thấp' }
];

function IncidentReport() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [form, setForm] = useState({
        asset_id: '',
        title: '',
        description: '',
        severity: 'medium',
        impact: '',
        images: '',
        handover_required: false,
        handover_notes: '',
        follow_up_notes: ''
    });

    const assetOptions = useMemo(() => assets || [], [assets]);

    useEffect(() => {
        const loadAssets = async () => {
            try {
                setLoading(true);
                const data = await getAllAssets();
                setAssets(data || []);
                setError(null);
            } catch (err) {
                setError('Không tải được danh sách thiết bị. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        loadAssets();
    }, []);

    const handleChange = (field) => (event) => {
        setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

    const parseImages = (input) => {
        if (!input) return [];
        return input
            .split('\n')
            .map((line) => line.trim())
            .filter(Boolean);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!form.asset_id || !form.title) {
            setError('Vui lòng chọn thiết bị và nhập tiêu đề sự cố.');
            return;
        }

        try {
            setSubmitting(true);
            await incidentsService.createIncident({
                asset_id: Number(form.asset_id),
                title: form.title,
                description: form.description,
                severity: form.severity,
                impact: form.impact,
                images: parseImages(form.images),
                handover_required: form.handover_required,
                handover_notes: form.handover_notes,
                follow_up_notes: form.follow_up_notes
            });
            setSuccess('Đã gửi báo cáo sự cố thành công.');
            setForm({
                asset_id: '',
                title: '',
                description: '',
                severity: 'medium',
                impact: '',
                images: '',
                handover_required: false,
                handover_notes: '',
                follow_up_notes: ''
            });
        } catch (err) {
            setError(err?.toString?.() || 'Không thể gửi báo cáo sự cố.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                    Báo cáo sự cố thiết bị
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                    Nhập thông tin sự cố, chọn thiết bị và mức độ để gửi bộ phận phụ trách.
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 2 }}>
                            Thông tin sự cố
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    required
                                    label="Thiết bị"
                                    value={form.asset_id}
                                    onChange={handleChange('asset_id')}
                                    helperText="Chọn thiết bị gặp sự cố"
                                >
                                    {assetOptions.map((asset) => (
                                        <MenuItem key={asset.id} value={asset.id}>
                                            {asset.name} ({asset.asset_code})
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Mức độ"
                                    value={form.severity}
                                    onChange={handleChange('severity')}
                                >
                                    {severityOptions.map((opt) => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Tiêu đề sự cố"
                                    value={form.title}
                                    onChange={handleChange('title')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={4}
                                    label="Mô tả sự cố"
                                    value={form.description}
                                    onChange={handleChange('description')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Ảnh hưởng (nếu có)"
                                    value={form.impact}
                                    onChange={handleChange('impact')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={3}
                                    label="Ảnh đính kèm (mỗi dòng một URL)"
                                    value={form.images}
                                    onChange={handleChange('images')}
                                    placeholder="https://.../image1.jpg\nhttps://.../image2.jpg"
                                />
                            </Grid>
                        </Grid>
                    </Paper>

                    <Paper variant="outlined" sx={{ p: 2 }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                Bàn giao (tùy chọn)
                            </Typography>
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2">Không</Typography>
                                <Switch
                                    checked={form.handover_required}
                                    onChange={(e) =>
                                        setForm((prev) => ({ ...prev, handover_required: e.target.checked }))
                                    }
                                />
                                <Typography variant="body2">Cần bàn giao</Typography>
                            </Stack>
                        </Stack>
                        <Divider sx={{ mb: 2 }} />
                        {form.handover_required ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Thông tin bàn giao"
                                        helperText="Người nhận, thời gian, địa điểm, hướng dẫn cụ thể..."
                                        value={form.handover_notes}
                                        onChange={handleChange('handover_notes')}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Theo dõi sau bàn giao"
                                        helperText="Kế hoạch kiểm tra/giám sát sau khi bàn giao."
                                        value={form.follow_up_notes}
                                        onChange={handleChange('follow_up_notes')}
                                    />
                                </Grid>
                            </Grid>
                        ) : (
                            <Typography color="text.secondary">
                                Bật “Cần bàn giao” nếu thiết bị phải chuyển giao cho bộ phận khác.
                            </Typography>
                        )}
                    </Paper>

                    <Stack direction="row" spacing={2} sx={{ mt: 3 }} justifyContent="flex-end">
                        <Button
                            type="button"
                            variant="outlined"
                            onClick={() =>
                                setForm({
                                    asset_id: '',
                                    title: '',
                                    description: '',
                                    severity: 'medium',
                                    impact: '',
                                    images: '',
                                    handover_required: false,
                                    handover_notes: '',
                                    follow_up_notes: ''
                                })
                            }
                        >
                            Làm mới
                        </Button>
                        <Button type="submit" variant="contained" disabled={submitting}>
                            {submitting ? 'Đang gửi...' : 'Gửi báo cáo'}
                        </Button>
                    </Stack>
                </Box>
            </Paper>
        </Box>
    );
}

export default IncidentReport;
