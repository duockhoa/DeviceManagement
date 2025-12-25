import { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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
    TextField,
    Snackbar,
    Alert as MuiAlert
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import PersonIcon from '@mui/icons-material/Person';
import BuildIcon from '@mui/icons-material/Build';
import AssignmentIcon from '@mui/icons-material/Assignment';
import incidentsService from '../../services/incidentsService';
import Loading from '../../component/Loading';
import ActionToolbar from '../../components/common/ActionToolbar';
import ActionDialog from '../../components/common/ActionDialog';
import ConfirmDialog from '../../components/common/ConfirmDialog';
import StatusTimeline from '../../components/common/StatusTimeline';
import ActionZone from '../../components/common/ActionZone';
import TriageDialog from '../../components/incident/TriageDialog';
import IsolateDialog from '../../components/incident/IsolateDialog';
import AssignDialog from '../../components/incident/AssignDialog';
import SubmitPostFixDialog from '../../components/incident/SubmitPostFixDialog';
import PostFixCheckDialog from '../../components/incident/PostFixCheckDialog';
import CancelIncidentDialog from '../../components/incident/CancelIncidentDialog';
import CloseIncidentDialog from '../../components/incident/CloseIncidentDialog';
import OperationalStatusBadge from '../../components/common/OperationalStatusBadge';
import { INCIDENT_FLOW, NEXT_ROLE_LABEL } from '../../constants/flowMaps';

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
    const [rootCause, setRootCause] = useState('');
    const [resolutionNotes, setResolutionNotes] = useState('');
    const [preventionMeasures, setPreventionMeasures] = useState('');
    const [downtimeHours, setDowntimeHours] = useState('');
    
    // Dialog states for new action system
    const [dialogOpen, setDialogOpen] = useState({
        triage: false,
        isolate: false,
        assign: false,
        start: false,
        submit_post_fix: false,
        post_fix_check: false,
        close: false,
        cancel: false
    });
    
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success'
    });

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
                setRootCause(data.root_cause || '');
                setResolutionNotes(data.solution || '');
                setPreventionMeasures(data.prevention_measures || '');
                setDowntimeHours(data.downtime_hours || '');
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

    const isClosed = incident?.status === 'closed';
    
    // Universal dialog handlers
    const handleActionClick = (action) => {
        setDialogOpen(prev => ({ ...prev, [action]: true }));
    };
    
    const handleDialogClose = (action) => {
        setDialogOpen(prev => ({ ...prev, [action]: false }));
    };
    
    const handleActionSuccess = async (message) => {
        try {
            const data = await incidentsService.getIncidentById(id);
            setIncident(data);
            setSnackbar({
                open: true,
                message: message,
                severity: 'success'
            });
        } catch (err) {
            console.error('Error reloading incident:', err);
        }
    };
    
    const handleActionError = (error) => {
        const message = error?.response?.data?.message || error?.message || 'Có lỗi xảy ra';
        setSnackbar({
            open: true,
            message: message,
            severity: 'error'
        });
    };
    
    // New action handlers
    const handleTriageSubmit = async (formData) => {
        try {
            await incidentsService.triageIncident(id, formData);
            handleDialogClose('triage');
            await handleActionSuccess('✅ Đã phân loại sự cố thành công');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleIsolateSubmit = async (formData) => {
        try {
            await incidentsService.isolateIncident(id, formData);
            handleDialogClose('isolate');
            await handleActionSuccess('🔒 Đã cô lập thiết bị');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleAssignSubmit = async (formData) => {
        try {
            await incidentsService.assignIncident(id, formData.assigned_to);
            handleDialogClose('assign');
            await handleActionSuccess('👤 Đã phân công kỹ thuật viên');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleStartSubmit = async () => {
        try {
            await incidentsService.startIncident(id);
            handleDialogClose('start');
            await handleActionSuccess('▶️ Đã bắt đầu xử lý sự cố');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleSubmitPostFixSubmit = async (formData) => {
        try {
            await incidentsService.submitPostFix(id, formData);
            handleDialogClose('submit_post_fix');
            await handleActionSuccess('📤 Đã gửi kiểm tra sau sửa');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handlePostFixCheckSubmit = async (formData) => {
        try {
            await incidentsService.postFixCheck(id, formData);
            handleDialogClose('post_fix_check');
            const resultMessage = formData.post_fix_result === 'pass' 
                ? '✅ Kiểm tra đạt - Chuyển sang RESOLVED'
                : '❌ Kiểm tra không đạt - Yêu cầu sửa lại';
            await handleActionSuccess(resultMessage);
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleCloseSubmit = async (formData) => {
        try {
            await incidentsService.closeIncident(id, formData);
            handleDialogClose('close');
            await handleActionSuccess('✔️ Đã đóng sự cố');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleCancelSubmit = async (reason) => {
        try {
            await incidentsService.cancelIncident(id, { cancel_reason: reason });
            handleDialogClose('cancel');
            await handleActionSuccess('✖️ Đã hủy sự cố');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };

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
    const nextRoleLabel = NEXT_ROLE_LABEL.Incident[incident.status] || '—';

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

            <Paper sx={{ p: 2, mb: 2 }}>
                <StatusTimeline statuses={INCIDENT_FLOW} current={incident.status} />
            </Paper>

            <ActionZone
                title="Thao tác"
                current_status_label={status.label}
                next_role_label={nextRoleLabel}
            >
                <ActionToolbar
                    entity="incident"
                    record={incident}
                    onActionClick={handleActionClick}
                />
            </ActionZone>

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

                    {/* Old assessment flow removed - now handled by nextActions dialogs */}
                    {/* Old actual status section removed - now handled by nextActions dialogs */}

                    <Paper sx={{ p: 0, mt: 3, overflow: 'hidden', boxShadow: 3 }}>
                        <Box sx={{ background: '#1976d2', color: '#fff', px: 3, py: 2 }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                Hoàn tất & đóng sự cố
                            </Typography>
                        </Box>
                        <Box sx={{ p: 3 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Nguyên nhân gốc"
                                        value={rootCause}
                                        onChange={(e) => setRootCause(e.target.value)}
                                        disabled={isClosed}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Giải pháp/biện pháp khắc phục"
                                        value={resolutionNotes}
                                        onChange={(e) => setResolutionNotes(e.target.value)}
                                        disabled={isClosed}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        multiline
                                        minRows={3}
                                        label="Biện pháp phòng ngừa"
                                        value={preventionMeasures}
                                        onChange={(e) => setPreventionMeasures(e.target.value)}
                                        disabled={isClosed}
                                    />
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        type="number"
                                        label="Thời gian dừng máy (giờ)"
                                        value={downtimeHours}
                                        onChange={(e) => setDowntimeHours(e.target.value)}
                                        disabled={isClosed}
                                    />
                                </Grid>
                                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                                    {/* Old complete/close actions removed - use ActionToolbar above instead */}
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
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
                        {incident.asset?.operational_status && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="caption" color="text.secondary">
                                    Trạng thái hoạt động:
                                </Typography>
                                <Box sx={{ mt: 0.5 }}>
                                    <OperationalStatusBadge status={incident.asset.operational_status} />
                                </Box>
                            </Box>
                        )}
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
            
            {/* Action Dialogs */}
            <ActionDialog
                open={dialogOpen.triage}
                onClose={() => handleDialogClose('triage')}
                title="Phân loại sự cố"
                icon="🔍"
                onSubmit={handleTriageSubmit}
            >
                <TriageDialog onSubmit={handleTriageSubmit} />
            </ActionDialog>
            
            <ActionDialog
                open={dialogOpen.isolate}
                onClose={() => handleDialogClose('isolate')}
                title="Cô lập thiết bị"
                icon="🔒"
                onSubmit={handleIsolateSubmit}
                confirmText="Xác nhận cô lập"
                isDestructive
            >
                <IsolateDialog incident={incident} onSubmit={handleIsolateSubmit} />
            </ActionDialog>
            
            <ActionDialog
                open={dialogOpen.assign}
                onClose={() => handleDialogClose('assign')}
                title="Phân công kỹ thuật viên"
                icon="👤"
                onSubmit={handleAssignSubmit}
            >
                <AssignDialog onSubmit={handleAssignSubmit} />
            </ActionDialog>
            
            <ConfirmDialog
                open={dialogOpen.start}
                onClose={() => handleDialogClose('start')}
                onConfirm={handleStartSubmit}
                title="Bắt đầu xử lý"
                message="Xác nhận bắt đầu xử lý sự cố này?"
                severity="info"
            />
            
            <ActionDialog
                open={dialogOpen.submit_post_fix}
                onClose={() => handleDialogClose('submit_post_fix')}
                title="Gửi kiểm tra sau sửa"
                icon="📤"
                onSubmit={handleSubmitPostFixSubmit}
            >
                <SubmitPostFixDialog onSubmit={handleSubmitPostFixSubmit} />
            </ActionDialog>
            
            <ActionDialog
                open={dialogOpen.post_fix_check}
                onClose={() => handleDialogClose('post_fix_check')}
                title="Kiểm tra sau sửa"
                icon="✓"
                onSubmit={handlePostFixCheckSubmit}
            >
                <PostFixCheckDialog incident={incident} onSubmit={handlePostFixCheckSubmit} />
            </ActionDialog>
            
            <ActionDialog
                open={dialogOpen.close}
                onClose={() => handleDialogClose('close')}
                title="Đóng sự cố"
                icon="✔️"
                onSubmit={handleCloseSubmit}
            >
                <CloseIncidentDialog incident={incident} onSubmit={handleCloseSubmit} />
            </ActionDialog>
            
            <ActionDialog
                open={dialogOpen.cancel}
                onClose={() => handleDialogClose('cancel')}
                title="Hủy sự cố"
                icon="❌"
                onSubmit={handleCancelSubmit}
                confirmText="Xác nhận hủy"
                isDestructive
            >
                <CancelIncidentDialog incident={incident} onSubmit={handleCancelSubmit} />
            </ActionDialog>
            
            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <MuiAlert
                    severity={snackbar.severity}
                    onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
                    sx={{ width: '100%' }}
                    elevation={6}
                    variant="filled"
                >
                    {snackbar.message}
                </MuiAlert>
            </Snackbar>
        </Box>
    );
}

export default IncidentDetail;
