import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
    Box,
    Paper,
    Typography,
    Chip,
    Grid,
    Divider,
    Button,
    Stack,
    Alert,
    TextField
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import incidentsService from '../../services/incidentsService';
import Loading from '../../component/Loading';

const severityConfig = {
    critical: { label: 'Khẩn cấp', color: 'error' },
    high: { label: 'Cao', color: 'warning' },
    medium: { label: 'Trung bình', color: 'info' },
    low: { label: 'Thấp', color: 'success' }
};

const statusConfig = {
    reported: { label: 'Mới báo cáo', color: 'warning' },
    investigating: { label: 'Đang điều tra', color: 'info' },
    in_progress: { label: 'Đang xử lý', color: 'primary' },
    resolved: { label: 'Đã giải quyết', color: 'success' },
    closed: { label: 'Đã đóng', color: 'default' }
};

function IncidentDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.user.userInfo);
    const [incident, setIncident] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [approveLoading, setApproveLoading] = useState(false);
    const [assessment, setAssessment] = useState({
        assessment_notes: '',
        solution_plan: '',
        handover_notes: ''
    });
    const [assessmentSent, setAssessmentSent] = useState(false);
    const [actualStatus, setActualStatus] = useState('');
    const [actualAction, setActualAction] = useState('');
    const [savingActual, setSavingActual] = useState(false);
    const [actualLocked, setActualLocked] = useState(false);

    const isManager = Boolean(user?.position?.includes('GĐ') || user?.position?.includes('TP') || user?.role === 'manager');
    const canAssess = Boolean(user?.id);

    useEffect(() => {
        const loadIncident = async () => {
            try {
                setLoading(true);
                const data = await incidentsService.getIncidentById(id);
                setIncident(data);
                setError(null);
                setAssessment({
                    assessment_notes: data.assessment_notes || '',
                    solution_plan: data.solution_plan || '',
                    handover_notes: data.handover_notes || ''
                });
                setAssessmentSent(Boolean(data.assessment_notes || data.solution_plan));
                setActualStatus(data.handover_notes || '');
                setActualAction(data.solution || '');
                setActualLocked(Boolean(data.solution || data.handover_notes));
            } catch (err) {
                setError('Không thể tải chi tiết sự cố. Vui lòng thử lại.');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadIncident();
        }
    }, [id]);

    const attachmentList = useMemo(() => {
        if (!incident?.images) return [];
        if (Array.isArray(incident.images)) return incident.images;
        try {
            const parsed = JSON.parse(incident.images);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) {
            return [];
        }
    }, [incident]);

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
                <Button startIcon={<ArrowBackIcon />} sx={{ mt: 2 }} onClick={() => navigate('/incidents')}>
                    Quay lại danh sách
                </Button>
            </Box>
        );
    }

    if (!incident) {
        return null;
    }

    const severity = severityConfig[incident.severity] || { label: incident.severity, color: 'default' };
    const status = statusConfig[incident.status] || { label: incident.status, color: 'default' };

    const handleAssess = async () => {
        try {
            setSubmitting(true);
            await incidentsService.assessIncident(id, assessment);
            const data = await incidentsService.getIncidentById(id);
            setIncident(data);
            setAssessmentSent(true);
            setActualStatus(data.handover_notes || '');
            setActualAction(data.solution || '');
            alert('Đã gửi đánh giá sự cố');
        } catch (err) {
            alert(err || 'Không thể gửi đánh giá');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSaveActual = async () => {
        try {
            setSavingActual(true);
            await incidentsService.updateIncident(id, {
                handover_notes: actualStatus,
                solution: actualAction
            });
            const data = await incidentsService.getIncidentById(id);
            setIncident(data);
            setActualLocked(true);
            alert('Đã lưu tình trạng thực tế & cách thức xử lý');
        } catch (err) {
            alert(err || 'Không thể lưu');
        } finally {
            setSavingActual(false);
        }
    };

    const handleApprove = async () => {
        if (!window.confirm('Duyệt phương án và tạo lệnh sửa chữa?')) return;
        try {
            setApproveLoading(true);
            const result = await incidentsService.approveSolution(id);
            const maintenanceId = result?.maintenance?.id;
            if (maintenanceId) {
                alert('Đã duyệt và tạo lệnh bảo trì thành công!');
                navigate('/maintenance');
            } else {
                alert('Đã duyệt phương án sự cố.');
                const data = await incidentsService.getIncidentById(id);
                setIncident(data);
            }
        } catch (err) {
            alert(err || 'Không thể duyệt phương án');
        } finally {
            setApproveLoading(false);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
                            Quay lại
                        </Button>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                                Chi tiết sự cố
                            </Typography>
                            <Typography variant="subtitle1" color="text.secondary">
                                {incident.incident_code}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1}>
                        <Chip label={severity.label} color={severity.color} icon={<ReportProblemIcon />} />
                        <Chip label={status.label} color={status.color} />
                    </Stack>
                </Stack>
            </Paper>

            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            <AssignmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thông tin sự cố
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            <strong>Tiêu đề:</strong> {incident.title}
                        </Typography>
                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                            <strong>Mô tả:</strong> {incident.description || 'Không có'}
                        </Typography>
                    </Paper>

                    {incident.impact && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Ảnh hưởng
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Typography sx={{ whiteSpace: 'pre-wrap' }}>{incident.impact}</Typography>
                        </Paper>
                    )}

                    {(incident.solution || incident.root_cause || incident.prevention_measures) && (
                        <Paper sx={{ p: 3, mb: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Kết quả xử lý
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {incident.root_cause && (
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Nguyên nhân:</strong> {incident.root_cause}
                                </Typography>
                            )}
                            {incident.solution && (
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Giải pháp:</strong> {incident.solution}
                                </Typography>
                            )}
                            {incident.prevention_measures && (
                                <Typography sx={{ mb: 1 }}>
                                    <strong>Biện pháp phòng ngừa:</strong> {incident.prevention_measures}
                                </Typography>
                            )}
                        </Paper>
                    )}

                    {attachmentList.length > 0 && (
                        <Paper sx={{ p: 3 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                                Hình ảnh đính kèm
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            <Stack direction="row" spacing={2} flexWrap="wrap">
                                {attachmentList.map((src, index) => (
                                    <Box
                                        key={`${src}-${index}`}
                                        component="img"
                                        src={src}
                                        alt={`incident-${index}`}
                                        sx={{ width: 180, height: 120, objectFit: 'cover', borderRadius: 1, boxShadow: 1 }}
                                    />
                                ))}
                            </Stack>
                        </Paper>
                    )}

                    {/* Đánh giá & phương án */}
                    {canAssess && !assessmentSent && (
                        <Paper sx={{ p: 0, mt: 3, overflow: 'hidden', boxShadow: 3 }}>
                            <Box sx={{ background: '#1976d2', color: '#fff', px: 3, py: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Đánh giá & phương án thực tế
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            label="Đánh giá thực tế"
                                            value={assessment.assessment_notes}
                                            onChange={(e) => setAssessment(prev => ({ ...prev, assessment_notes: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            label="Phương án xử lý"
                                            value={assessment.solution_plan}
                                            onChange={(e) => setAssessment(prev => ({ ...prev, solution_plan: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            label="Tình trạng & cách thức xử lý"
                                            value={assessment.handover_notes}
                                            onChange={(e) => setAssessment(prev => ({ ...prev, handover_notes: e.target.value }))}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                        <Button variant="contained" onClick={handleAssess} disabled={submitting}>
                                            {submitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                                        </Button>
                                        {isManager && (
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleApprove}
                                                disabled={approveLoading}
                                            >
                                                {approveLoading ? 'Đang duyệt...' : 'Duyệt & tạo bảo trì'}
                                            </Button>
                                        )}
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>
                    )}

                    {assessmentSent && (
                        <Paper sx={{ p: 0, mt: 3, overflow: 'hidden', boxShadow: 3 }}>
                            <Box sx={{ background: '#1976d2', color: '#fff', px: 3, py: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                    Tình trạng thực tế & cách thức xử lý
                                </Typography>
                            </Box>
                            <Box sx={{ p: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            label="Tình trạng thực tế"
                                            value={actualStatus}
                                            onChange={(e) => setActualStatus(e.target.value)}
                                            disabled={actualLocked}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            multiline
                                            minRows={4}
                                            label="Cách thức xử lý"
                                            value={actualAction}
                                            onChange={(e) => setActualAction(e.target.value)}
                                            disabled={actualLocked}
                                        />
                                    </Grid>
                                    {!actualLocked && (
                                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button variant="contained" onClick={handleSaveActual} disabled={savingActual}>
                                                {savingActual ? 'Đang lưu...' : 'Lưu thông tin'}
                                            </Button>
                                            {isManager && (
                                                <Button
                                                    variant="contained"
                                                    color="success"
                                                    onClick={handleApprove}
                                                    disabled={approveLoading}
                                                >
                                                    {approveLoading ? 'Đang duyệt...' : 'Duyệt & tạo bảo trì'}
                                                </Button>
                                            )}
                                        </Grid>
                                    )}
                                    {actualLocked && isManager && (
                                        <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                                            <Button
                                                variant="contained"
                                                color="success"
                                                onClick={handleApprove}
                                                disabled={approveLoading}
                                            >
                                                {approveLoading ? 'Đang duyệt...' : 'Duyệt & tạo bảo trì'}
                                            </Button>
                                        </Grid>
                                    )}
                                </Grid>
                            </Box>
                        </Paper>
                    )}
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            <BuildIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Thiết bị
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography>
                            <strong>Tên:</strong> {incident.asset?.name || 'N/A'}
                        </Typography>
                        <Typography>
                            <strong>Mã:</strong> {incident.asset?.asset_code || 'N/A'}
                        </Typography>
                        <Typography>
                            <strong>Vị trí:</strong> {incident.asset?.location || 'N/A'}
                        </Typography>
                        {incident.handover_required && (
                            <>
                                <Divider sx={{ my: 2 }} />
                                <Typography>
                                    <strong>Yêu cầu bàn giao:</strong> Có
                                </Typography>
                                {incident.handover_notes && (
                                    <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                                        <strong>Thông tin bàn giao:</strong> {incident.handover_notes}
                                    </Typography>
                                )}
                                {incident.notes && (
                                    <Typography sx={{ mt: 1, whiteSpace: 'pre-wrap' }}>
                                        <strong>Theo dõi sau bàn giao:</strong> {incident.notes}
                                    </Typography>
                                )}
                            </>
                        )}
                    </Paper>

                    <Paper sx={{ p: 3, mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            <PersonIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                            Người liên quan
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2">Người báo cáo</Typography>
                            <Typography>{incident.reporter?.name || 'N/A'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {incident.reporter?.email}
                            </Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Người xử lý</Typography>
                            <Typography>{incident.assignee?.name || 'Chưa phân công'}</Typography>
                            <Typography variant="body2" color="text.secondary">
                                {incident.assignee?.email}
                            </Typography>
                        </Box>
                    </Paper>

                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            Mốc thời gian
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        <Typography>
                            <strong>Ngày báo cáo:</strong>{' '}
                            {incident.reported_date ? new Date(incident.reported_date).toLocaleString('vi-VN') : 'N/A'}
                        </Typography>
                        <Typography>
                            <strong>Bắt đầu xử lý:</strong>{' '}
                            {incident.started_date ? new Date(incident.started_date).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                        </Typography>
                        <Typography>
                            <strong>Giải quyết:</strong>{' '}
                            {incident.resolved_date ? new Date(incident.resolved_date).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                        </Typography>
                        <Typography>
                            <strong>Đóng:</strong>{' '}
                            {incident.closed_date ? new Date(incident.closed_date).toLocaleString('vi-VN') : 'Chưa cập nhật'}
                        </Typography>
                        {incident.maintenance_id && (
                            <Typography sx={{ mt: 1 }}>
                                <strong>Lệnh bảo trì:</strong> #{incident.maintenance_id}
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
}

export default IncidentDetail;
