import { useEffect, useMemo, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Grid,
    Card,
    CardContent,
    Chip,
    Stack,
    Checkbox,
    FormControlLabel,
    Button,
    Divider,
    TextField,
    Alert,
} from '@mui/material';
import SecurityIcon from '@mui/icons-material/Security';
import { getAllDepartments } from '../../services/departmentService';

const defaultRoles = ['Admin', 'Manager', 'Technician', 'Viewer'];

const defaultFeatures = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'assets', label: 'Thiết bị' },
    { key: 'asset_categories', label: 'Danh mục thiết bị' },
    { key: 'maintenance_plan', label: 'Kế hoạch bảo trì' },
    { key: 'maintenance_work', label: 'Công việc bảo trì' },
    { key: 'work_requests', label: 'Yêu cầu xử lý' },
    { key: 'incidents', label: 'Sự cố' },
    { key: 'handover', label: 'Bàn giao thiết bị' },
    { key: 'calibration', label: 'Kiểm định/Hiệu chuẩn' },
    { key: 'report', label: 'Báo cáo tổng hợp' },
    { key: 'checklist', label: 'Checklist chuẩn' },
];

const storageKey = 'rbac_config';

export default function AccessControlPage() {
    const [roles, setRoles] = useState(defaultRoles);
    const [features, setFeatures] = useState(defaultFeatures);
    const [matrix, setMatrix] = useState({});
    const [filter, setFilter] = useState('');
    const [saving, setSaving] = useState(false);
    const [deptError, setDeptError] = useState(null);

    useEffect(() => {
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setRoles(parsed.roles || defaultRoles);
                setFeatures(parsed.features || defaultFeatures);
                setMatrix(parsed.matrix || {});
            } catch (_) {
                setRoles(defaultRoles);
                setFeatures(defaultFeatures);
                setMatrix({});
            }
        }
        // Load departments to use as roles
        getAllDepartments()
            .then((depts) => {
                if (Array.isArray(depts) && depts.length > 0) {
                    setRoles(depts.map((d) => d.name));
                }
            })
            .catch((err) => {
                console.error(err);
                setDeptError('Không tải được danh sách phòng ban, dùng bộ mặc định.');
            });
    }, []);

    const filteredFeatures = useMemo(() => {
        if (!filter.trim()) return features;
        const q = filter.toLowerCase();
        return features.filter((f) => f.label.toLowerCase().includes(q) || f.key.toLowerCase().includes(q));
    }, [features, filter]);

    const toggle = (dept, featureKey) => {
        setMatrix((prev) => {
            const row = prev[dept] || {};
            return { ...prev, [dept]: { ...row, [featureKey]: !row[featureKey] } };
        });
    };

    const selectAll = (dept, value) => {
        setMatrix((prev) => {
            const next = { ...prev };
            filteredFeatures.forEach((f) => {
                const row = next[dept] || {};
                row[f.key] = value;
                next[dept] = row;
            });
            return next;
        });
    };

    const save = () => {
        setSaving(true);
        const payload = { roles, features, matrix };
        localStorage.setItem(storageKey, JSON.stringify(payload));
        setTimeout(() => setSaving(false), 400);
    };

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
            <Paper sx={{ p: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <SecurityIcon color="primary" />
                    <Box>
                        <Typography variant="h5" fontWeight="bold">Phân quyền tính năng</Typography>
                        <Typography variant="body2" color="text.secondary">
                            Chọn role nào được phép truy cập từng chức năng. Dữ liệu lưu tại localStorage (RBAC thử nghiệm).
                        </Typography>
                    </Box>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        size="small"
                        placeholder="Lọc chức năng..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                    <Button variant="contained" onClick={save} disabled={saving}>
                        {saving ? 'Đang lưu...' : 'Lưu cấu hình'}
                    </Button>
                </Stack>
            </Paper>

            <Paper sx={{ p: 2 }}>
                <Box
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: `1.6fr repeat(${filteredFeatures.length}, 1fr)`,
                        alignItems: 'center',
                        px: 1,
                        py: 1,
                        bgcolor: '#f5f5f5',
                        borderRadius: 1,
                        fontWeight: 'bold',
                    }}
                >
                    <Typography variant="subtitle2">Phòng ban</Typography>
                    {filteredFeatures.map((f) => (
                        <Typography key={f.key} variant="subtitle2" textAlign="center">
                            {f.label}
                        </Typography>
                    ))}
                </Box>
                <Divider sx={{ my: 1 }} />
                <Stack spacing={1}>
                    {roles.map((dept) => (
                        <Box
                            key={dept}
                            sx={{
                                display: 'grid',
                                gridTemplateColumns: `1.6fr repeat(${filteredFeatures.length}, 1fr)`,
                                alignItems: 'center',
                                px: 1,
                                py: 1,
                                borderRadius: 1,
                                border: '1px solid #e0e0e0',
                                bgcolor: '#fff',
                            }}
                        >
                            <Stack direction="row" alignItems="center" spacing={1}>
                                <Typography variant="body2" fontWeight="bold">{dept}</Typography>
                                <FormControlLabel
                                    control={<Checkbox size="small" />}
                                    label="All"
                                    onChange={(_, checked) => selectAll(dept, checked)}
                                />
                            </Stack>
                            {filteredFeatures.map((f) => (
                                <Box key={`${dept}-${f.key}`} sx={{ textAlign: 'center' }}>
                                    <Checkbox
                                        checked={Boolean(matrix[dept]?.[f.key])}
                                        onChange={() => toggle(dept, f.key)}
                                    />
                                </Box>
                            ))}
                        </Box>
                    ))}
                </Stack>
            </Paper>
        </Box>
    );
}
