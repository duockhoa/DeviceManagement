import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Box,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    Button,
    Stack,
    IconButton,
    Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import incidentsService from '../../services/incidentsService';
import Loading from '../../component/Loading';
import { INCIDENT_STATUS_LABELS } from '../../constants/flowMaps';

const severityConfig = {
    critical: { label: 'Khẩn cấp', color: 'error' },
    high: { label: 'Cao', color: 'warning' },
    medium: { label: 'Trung bình', color: 'info' },
    low: { label: 'Thấp', color: 'success' }
};

/**
 * MyIncidentReports - Trang xem sự cố đã báo cáo (CHỈ XEM)
 * Dành cho END USER - Không có quyền actions
 */
function MyIncidentReports() {
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMyIncidents();
    }, []);

    const loadMyIncidents = async () => {
        try {
            setLoading(true);
            // Backend cần thêm filter myReports=true để lấy incidents của user hiện tại
            const data = await incidentsService.getAllIncidents({ myReports: true });
            setIncidents(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error loading my incidents:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <ReportProblemIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                        <Box>
                            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                                Sự cố của tôi
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Danh sách sự cố bạn đã báo cáo
                            </Typography>
                        </Box>
                    </Stack>
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/incidents/report')}
                    >
                        Báo cáo mới
                    </Button>
                </Stack>
            </Paper>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Mã sự cố</strong></TableCell>
                            <TableCell><strong>Tiêu đề</strong></TableCell>
                            <TableCell><strong>Loại</strong></TableCell>
                            <TableCell><strong>Mức độ</strong></TableCell>
                            <TableCell><strong>Trạng thái</strong></TableCell>
                            <TableCell><strong>Ngày báo cáo</strong></TableCell>
                            <TableCell align="center"><strong>Thao tác</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {incidents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        Chưa có sự cố nào được báo cáo
                                    </Typography>
                                    <Button
                                        variant="outlined"
                                        startIcon={<AddIcon />}
                                        onClick={() => navigate('/incidents/report')}
                                        sx={{ mt: 2 }}
                                    >
                                        Báo cáo sự cố đầu tiên
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ) : (
                            incidents.map((incident) => {
                                const severity = severityConfig[incident.severity] || { label: incident.severity, color: 'default' };
                                const statusLabel = INCIDENT_STATUS_LABELS[incident.status] || incident.status;

                                return (
                                    <TableRow key={incident.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {incident.incident_code}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{incident.title}</TableCell>
                                        <TableCell>
                                            <Chip 
                                                label={
                                                    incident.incident_category === 'EQUIPMENT' ? 'Thiết bị' :
                                                    incident.incident_category === 'FACILITY' ? 'Nhà xưởng' :
                                                    incident.incident_category === 'SYSTEM' ? 'Hệ thống' :
                                                    incident.incident_category === 'OPERATION' ? 'Vận hành' : 
                                                    incident.incident_category
                                                }
                                                size="small"
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={severity.label}
                                                color={severity.color}
                                                size="small"
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={statusLabel}
                                                size="small"
                                                color={
                                                    incident.status === 'resolved' || incident.status === 'closed' ? 'success' :
                                                    incident.status === 'cancelled' ? 'default' :
                                                    'primary'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {new Date(incident.reported_date).toLocaleString('vi-VN')}
                                        </TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => navigate(`/incidents/${incident.id}`)}
                                                    color="primary"
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default MyIncidentReports;
