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
import ActionStepCard from '../../components/incident/ActionStepCard';
import AcknowledgeDialog from '../../components/incident/AcknowledgeDialog';
import ResolveDialog from '../../components/incident/ResolveDialog';
import CancelIncidentDialog from '../../components/incident/CancelIncidentDialog';
import CloseIncidentDialog from '../../components/incident/CloseIncidentDialog';
import OperationalStatusBadge from '../../components/common/OperationalStatusBadge';
import { INCIDENT_FLOW, INCIDENT_STATUS_LABELS, NEXT_ROLE_LABEL } from '../../constants/flowMaps';

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
    
    // Dialog states for simplified action system
    const [dialogOpen, setDialogOpen] = useState({
        acknowledge: false,
        resolve: false,
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
        console.log('[DEBUG handleActionClick]', 'action:', action, 'dialogOpen before:', JSON.stringify(dialogOpen));
        setDialogOpen(prev => {
            const newState = { ...prev, [action]: true };
            console.log('[DEBUG handleActionClick]', 'dialogOpen after:', JSON.stringify(newState));
            return newState;
        });
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
    
    // Simplified action handlers
    const handleAcknowledgeSubmit = async (formData = {}) => {
        try {
            await incidentsService.acknowledgeIncident(id, formData);
            handleDialogClose('acknowledge');
            await handleActionSuccess('✅ Đã tiếp nhận và bắt đầu xử lý sự cố');
        } catch (err) {
            handleActionError(err);
            throw err;
        }
    };
    
    const handleResolveSubmit = async (formData) => {
        try {
            await incidentsService.resolveIncident(id, formData);
            handleDialogClose('resolve');
            await handleActionSuccess('✅ Đã đánh dấu sự cố đã giải quyết');
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

    console.log('[DEBUG IncidentDetail Render]', 'ID:', incident.id, 'Status:', incident.status, 'NextActions:', incident.nextActions, 'isResolved:', incident.status === 'resolved');

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
                <StatusTimeline 
                    statuses={INCIDENT_FLOW} 
                    current={incident.status} 
                    statusLabels={INCIDENT_STATUS_LABELS}
                />
            </Paper>

            {/* Action Step Card - Simplified Workflow */}
            {incident.status === 'reported' && (
                <ActionStepCard
                    title="📋 Sự cố mới - Chờ tiếp nhận"
                    description="Bộ phận liên quan đã nhận thông báo, vui lòng tiếp nhận và bắt đầu xử lý"
                    icon="🔔"
                    variant="warning"
                    steps={[
                        `✅ Thông báo đã gửi đến: ${incident.incident_category === 'EQUIPMENT' ? 'Bảo trì & Kỹ thuật' : 
                          incident.incident_category === 'FACILITY' ? 'Cơ sở hạ tầng' :
                          incident.incident_category === 'SYSTEM' ? 'IT & Kỹ thuật' : 'Sản xuất & Kế hoạch'}`,
                        'Bộ phận tiếp nhận và xác nhận',
                        'Bắt đầu xử lý hoặc tạo lệnh bảo trì (nếu cần)'
                    ]}
                    assignee={nextRoleLabel}
                    actions={[
                        {
                            label: '✅ Tiếp nhận xử lý',
                            onClick: () => handleActionClick('acknowledge')
                        }
                    ]}
                />
            )}

            {incident.status === 'in_progress' && (
                <ActionStepCard
                    title={
                        incident.incident_category === 'EQUIPMENT' 
                            ? '🔧 Đang xử lý - Có thể tạo lệnh bảo trì'
                            : '⚙️ Đang xử lý sự cố'
                    }
                    description={
                        incident.incident_category === 'EQUIPMENT'
                            ? 'Sự cố thiết bị: Xử lý trực tiếp hoặc tạo lệnh bảo trì chi tiết'
                            : 'Tiến hành xử lý và ghi nhận kết quả khi hoàn thành'
                    }
                    icon="⚡"
                    variant="info"
                    steps={
                        incident.incident_category === 'EQUIPMENT' 
                            ? [
                                'Xử lý trực tiếp nếu đơn giản',
                                'Hoặc tạo lệnh bảo trì nếu phức tạp',
                                'Ghi nhận giải pháp khi hoàn thành'
                            ]
                            : [
                                'Tiến hành xử lý',
                                'Ghi nhận giải pháp áp dụng',
                                'Đánh dấu đã giải quyết'
                            ]
                    }
                    assignee="Bộ phận đang xử lý"
                    actions={
                        incident.incident_category === 'EQUIPMENT'
                            ? [
                                {
                                    label: '🔧 Tạo lệnh Bảo trì',
                                    onClick: () => {
                                        navigate('/maintenance', {
                                            state: {
                                                createFromIncident: true,
                                                incidentData: {
                                                    incident_id: incident.id,
                                                    incident_code: incident.incident_code,
                                                    asset_id: incident.asset_id,
                                                    asset_code: incident.asset?.asset_code,
                                                    asset_name: incident.asset?.name,
                                                    title: incident.title,
                                                    description: incident.description,
                                                    severity: incident.severity,
                                                    maintenance_type: 'corrective'
                                                }
                                            }
                                        });
                                    }
                                },
                                {
                                    label: '✅ Đã giải quyết',
                                    onClick: () => handleActionClick('resolve')
                                }
                            ]
                            : [
                                {
                                    label: '✅ Đã giải quyết',
                                    onClick: () => handleActionClick('resolve')
                                }
                            ]
                    }
                />
            )}

            {incident.status === 'resolved' && (
                <>
                    {console.log('[DEBUG IncidentDetail] Rendering close action card - Status:', incident.status, 'NextActions:', incident.nextActions)}
                    <ActionStepCard
                        title="🎯 Đã giải quyết - Chờ đóng"
                        description="Sự cố đã được xử lý xong, xác nhận và đóng hoàn tất"
                        icon="📝"
                        variant="success"
                        steps={[
                            '✅ Đã xử lý xong',
                            'Xem xét giải pháp',
                            'Đóng sự cố hoàn tất'
                        ]}
                        assignee={nextRoleLabel}
                        actions={[
                            {
                                label: '📝 Đóng sự cố',
                                onClick: () => handleActionClick('close')
                            }
                        ]}
                    />
                </>
            )}

            <ActionZone
                title="Thao tác khác"
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
            {/* Simplified Workflow Dialogs */}
            <AcknowledgeDialog
                open={dialogOpen.acknowledge}
                onClose={() => handleDialogClose('acknowledge')}
                onSubmit={handleAcknowledgeSubmit}
            />
            
            <ResolveDialog
                open={dialogOpen.resolve}
                onClose={() => handleDialogClose('resolve')}
                onSubmit={handleResolveSubmit}
            />
            
            <CloseIncidentDialog
                open={dialogOpen.close}
                onClose={() => handleDialogClose('close')}
                incident={incident}
                onSubmit={handleCloseSubmit}
            />
            
            <CancelIncidentDialog
                open={dialogOpen.cancel}
                onClose={() => handleDialogClose('cancel')}
                incident={incident}
                onSubmit={handleCancelSubmit}
            />
            
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
