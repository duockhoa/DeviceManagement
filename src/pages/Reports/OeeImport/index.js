import { useMemo, useRef, useState } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Alert,
    Stack,
    LinearProgress,
    TextField,
    Chip,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    IconButton
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';
import { v4 as uuidv4 } from 'uuid';
import { previewOeeImport, commitOeeImport } from '../../../services/oeeImportService';

function StatusChip({ status, reasons }) {
    if (status === 'valid') return <Chip label="valid" color="success" size="small" />;
    if (status === 'unmatched_asset') return <Chip label="unmatched_asset" color="warning" size="small" />;
    if (status === 'insufficient_data') return <Chip label="insufficient_data" color="error" size="small" />;
    return <Chip label={status || 'unknown'} size="small" />;
}

export default function OeeImportPage() {
    const fileInputRef = useRef(null);
    const [file, setFile] = useState(null);
    const [rows, setRows] = useState([]);
    const [batch, setBatch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [open, setOpen] = useState(false);
    const [idempotencyKey, setIdempotencyKey] = useState(uuidv4());

    const handleFileSelect = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.name.endsWith('.csv')) {
            alert('Vui lòng chọn file CSV');
            return;
        }
        setFile(f);
        setRows([]);
        setBatch(null);
        setError(null);
        setOpen(true);
        e.target.value = '';
    };

    const handlePreview = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            const res = await previewOeeImport({ idempotencyKey, file });
            setRows(res.rows || []);
            setBatch(res.batch || null);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
            setRows([]);
            setBatch(null);
        } finally {
            setLoading(false);
        }
    };

    const handleCommit = async () => {
        if (!file) return;
        setLoading(true);
        setError(null);
        try {
            const res = await commitOeeImport({ idempotencyKey, file });
            setBatch(res.batch || batch);
            alert('Commit thành công');
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    const validCount = useMemo(() => rows.filter((r) => r.data_status === 'valid').length, [rows]);
    const unmatchedCount = useMemo(() => rows.filter((r) => r.data_status === 'unmatched_asset').length, [rows]);
    const insufficientCount = useMemo(() => rows.filter((r) => r.data_status === 'insufficient_data').length, [rows]);

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>OEE Import (Phase 1)</Typography>
            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                <Button variant="contained" startIcon={<UploadFileIcon />} onClick={() => fileInputRef.current?.click()}>
                    Upload CSV
                </Button>
                <input ref={fileInputRef} type="file" accept=".csv" style={{ display: 'none' }} onChange={handleFileSelect} />
                <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => setIdempotencyKey(uuidv4())}>
                    Reset batch key
                </Button>
            </Stack>

            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <Dialog open={open} onClose={() => !loading && setOpen(false)} maxWidth="xl" fullWidth>
                <DialogTitle>Preview OEE Import</DialogTitle>
                <DialogContent dividers>
                    {loading && <LinearProgress sx={{ mb: 2 }} />}
                    {file && <Alert severity="info" sx={{ mb: 2 }}>File: {file.name}</Alert>}
                    <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                        <Button variant="contained" onClick={handlePreview} disabled={loading || !file}>Preview</Button>
                        <Button variant="contained" color="success" onClick={handleCommit} disabled={loading || !file}>Commit</Button>
                    </Stack>

                    {batch && (
                        <Card sx={{ mb: 2 }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight={700}>Batch summary</Typography>
                                <Stack direction="row" spacing={2} sx={{ mt: 1, flexWrap: 'wrap' }}>
                                    <Chip icon={<CheckCircleIcon />} label={`Valid: ${batch.valid_rows || 0}`} color="success" />
                                    <Chip icon={<ErrorOutlineIcon />} label={`Insufficient: ${batch.insufficient_data_rows || 0}`} color="warning" />
                                    <Chip icon={<ErrorOutlineIcon />} label={`Unmatched: ${batch.unmatched_asset_rows || 0}`} color="error" />
                                    <Chip label={`Total: ${batch.total_rows || 0}`} />
                                </Stack>
                            </CardContent>
                        </Card>
                    )}

                    {rows.length > 0 && (
                        <Box sx={{ overflow: 'auto' }}>
                            <Table size="small" stickyHeader>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>#</TableCell>
                                        <TableCell>Code</TableCell>
                                        <TableCell>Status</TableCell>
                                        <TableCell>Asset ID</TableCell>
                                        <TableCell>Availability</TableCell>
                                        <TableCell>Performance</TableCell>
                                        <TableCell>Quality</TableCell>
                                        <TableCell>OEE</TableCell>
                                        <TableCell>Downtime (min)</TableCell>
                                        <TableCell>Net avail (min)</TableCell>
                                        <TableCell>Errors</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {rows.map((r) => (
                                        <TableRow key={r.row_index} hover>
                                            <TableCell>{r.row_index}</TableCell>
                                            <TableCell>{r.normalized_code || '—'}</TableCell>
                                            <TableCell><StatusChip status={r.data_status} /></TableCell>
                                            <TableCell>{r.asset_id || '—'}</TableCell>
                                            <TableCell>{r.availability != null ? r.availability.toFixed(4) : '—'}</TableCell>
                                            <TableCell>{r.performance != null ? r.performance.toFixed(4) : '—'}</TableCell>
                                            <TableCell>{r.quality != null ? r.quality.toFixed(4) : '—'}</TableCell>
                                            <TableCell>{r.oee != null ? r.oee.toFixed(4) : '—'}</TableCell>
                                            <TableCell>{r.total_downtime_minutes != null ? r.total_downtime_minutes : '—'}</TableCell>
                                            <TableCell>{r.net_available_minutes != null ? r.net_available_minutes : '—'}</TableCell>
                                            <TableCell>
                                                {(r.errors || []).map((e, idx) => (
                                                    <Chip key={idx} label={e} size="small" color="warning" sx={{ mr: 0.5, mb: 0.5 }} />
                                                ))}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    )}

                    {!rows.length && !loading && <Alert severity="info">Tải CSV và bấm Preview để xem kết quả.</Alert>}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} disabled={loading}>Đóng</Button>
                </DialogActions>
            </Dialog>

            <Card>
                <CardContent>
                    <Typography variant="subtitle1" fontWeight={700}>Hướng dẫn</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        - Dùng template CSV Phase 1 (các cột theo spec).<br />
                        - Hàng `unmatched_asset` cần kiểm tra lại asset_code/dk_code.<br />
                        - Hàng `insufficient_data` do thiếu planned_time, net_available hoặc qty = 0.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
