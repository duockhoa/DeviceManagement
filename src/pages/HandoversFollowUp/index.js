import { useEffect, useState } from 'react';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Divider,
    Grid,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TextField,
    Typography,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LockIcon from '@mui/icons-material/Lock';
import handoversService from '../../services/handoversService';

function HandoversFollowUp() {
    const [list, setList] = useState([]);
    const [selected, setSelected] = useState(null);
    const [form, setForm] = useState({
        actualCondition: '',
        issues: '',
        actionTaken: '',
        completionDate: '',
        qaReview: '',
        notes: ''
    });
    const [message, setMessage] = useState(null);
    const [closeDialog, setCloseDialog] = useState(false);
    const [closeReason, setCloseReason] = useState('');

    const load = async () => {
        const data = await handoversService.list();
        setList(data);
    };

    useEffect(() => {
        load();
    }, []);

    const handleSelect = (handover) => {
        setSelected(handover);
        // Reset form để nhập đánh giá mới
        setForm({
            actualCondition: '',
            issues: '',
            actionTaken: '',
            completionDate: '',
            qaReview: '',
            notes: ''
        });
        setMessage(null);
    };

    const handleSave = async () => {
        if (!selected) return;
        await handoversService.addFollowUpRecord(selected.id, form);
        setMessage('Đã lưu đánh giá theo dõi.');
        // Reset form sau khi lưu
        setForm({
            actualCondition: '',
            issues: '',
            actionTaken: '',
            completionDate: '',
            qaReview: '',
            notes: ''
        });
        load();
    };

    const handleCloseHandover = async () => {
        if (!selected || !closeReason.trim()) {
            return;
        }
        await handoversService.closeHandover(selected.id, closeReason);
        setCloseDialog(false);
        setCloseReason('');
        setSelected(null);
        setMessage('Đã đóng lệnh bàn giao.');
        load();
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 3 }}>
                Theo dõi sau bàn giao
            </Typography>
            
            <Grid container spacing={3}>
                <Grid item xs={12} md={5}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Danh sách đã tiếp nhận
                        </Typography>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Bộ phận bàn giao</TableCell>
                                    <TableCell>Bộ phận tiếp nhận</TableCell>
                                    <TableCell>Lý do</TableCell>
                                    <TableCell>Trạng thái</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {list
                                    .filter((h) => h.status === 'accepted' || h.status === 'follow_up')
                                    .map((h) => (
                                        <TableRow
                                            key={h.id}
                                            hover
                                            selected={selected?.id === h.id}
                                            onClick={() => handleSelect(h)}
                                            sx={{ 
                                                cursor: 'pointer',
                                                backgroundColor: selected?.id === h.id ? 'action.selected' : 'inherit'
                                            }}
                                        >
                                            <TableCell>{h.fromDept}</TableCell>
                                            <TableCell>{h.toDept}</TableCell>
                                            <TableCell>{h.reason}</TableCell>
                                            <TableCell>
                                                <Chip 
                                                    label={h.status === 'follow_up' ? 'Đang theo dõi' : 'Đã nhận'}
                                                    color={h.status === 'follow_up' ? 'warning' : 'success'}
                                                    size="small"
                                                    icon={h.status === 'follow_up' ? undefined : <CheckCircleIcon />}
                                                />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                {list.filter((h) => h.status === 'closed').length > 0 && (
                                    <>
                                        <TableRow>
                                            <TableCell colSpan={4} sx={{ bgcolor: 'grey.200', fontWeight: 600, py: 1 }}>
                                                Đã đóng
                                            </TableCell>
                                        </TableRow>
                                        {list
                                            .filter((h) => h.status === 'closed')
                                            .map((h) => (
                                                <TableRow
                                                    key={h.id}
                                                    hover
                                                    selected={selected?.id === h.id}
                                                    onClick={() => handleSelect(h)}
                                                    sx={{ 
                                                        cursor: 'pointer',
                                                        backgroundColor: selected?.id === h.id ? 'action.selected' : 'inherit',
                                                        opacity: 0.7
                                                    }}
                                                >
                                                    <TableCell>{h.fromDept}</TableCell>
                                                    <TableCell>{h.toDept}</TableCell>
                                                    <TableCell>{h.reason}</TableCell>
                                                    <TableCell>
                                                        <Chip 
                                                            label="Đã đóng"
                                                            color="default"
                                                            size="small"
                                                            icon={<LockIcon />}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                    </>
                                )}
                            </TableBody>
                        </Table>
                    </Paper>
                </Grid>
                
                <Grid item xs={12} md={7}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Cập nhật thông tin theo dõi
                        </Typography>
                        {selected ? (
                            <>
                                <Table size="small" sx={{ mb: 3 }}>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, width: '35%', bgcolor: 'grey.100' }}>
                                                Bộ phận bàn giao
                                            </TableCell>
                                            <TableCell>{selected.fromDept}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                                                Bộ phận tiếp nhận
                                            </TableCell>
                                            <TableCell>{selected.toDept}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>
                                                Lý do bàn giao
                                            </TableCell>
                                            <TableCell>{selected.reason}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>

                                {selected.closedAt && (
                                    <Alert severity="success" icon={<LockIcon />} sx={{ mb: 3 }}>
                                        <Typography variant="body2">
                                            <strong>Đã đóng lúc:</strong> {new Date(selected.closedAt).toLocaleString('vi-VN')}
                                        </Typography>
                                        <Typography variant="body2">
                                            <strong>Lý do đóng:</strong> {selected.closeReason}
                                        </Typography>
                                    </Alert>
                                )}

                                <Divider sx={{ mb: 3 }} />

                                {/* Lịch sử đánh giá */}
                                {selected.followUps && selected.followUps.length > 0 && (
                                    <>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                            Lịch sử đánh giá ({selected.followUps.length} lần)
                                        </Typography>
                                        <Paper variant="outlined" sx={{ mb: 3, maxHeight: 400, overflow: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Ngày đánh giá</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Tình trạng</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Vấn đề</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Hành động</TableCell>
                                                        <TableCell sx={{ fontWeight: 600, bgcolor: 'grey.100' }}>Đánh giá QA/QC</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selected.followUps.map((record, idx) => (
                                                        <TableRow key={idx}>
                                                            <TableCell sx={{ whiteSpace: 'nowrap' }}>
                                                                {new Date(record.created_at).toLocaleString('vi-VN')}
                                                            </TableCell>
                                                            <TableCell>{record.actual_condition || '-'}</TableCell>
                                                            <TableCell>{record.issues || '-'}</TableCell>
                                                            <TableCell>{record.action_taken || '-'}</TableCell>
                                                            <TableCell>{record.qa_review || '-'}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Paper>
                                    </>
                                )}

                                <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                                    Thêm đánh giá mới
                                </Typography>

                                <Stack spacing={2.5}>
                                    <TextField
                                        label="Tình trạng thực tế sau tiếp nhận"
                                        placeholder="Mô tả tình trạng thiết bị/tài sản sau khi tiếp nhận..."
                                        multiline
                                        rows={2}
                                        value={form.actualCondition}
                                        onChange={(e) => setForm((p) => ({ ...p, actualCondition: e.target.value }))}
                                        fullWidth
                                        disabled={selected.status === 'closed'}
                                    />
                                    
                                    <TextField
                                        label="Vấn đề phát hiện (nếu có)"
                                        placeholder="Mô tả các vấn đề, hư hỏng hoặc thiếu sót phát hiện..."
                                        multiline
                                        rows={2}
                                        value={form.issues}
                                        onChange={(e) => setForm((p) => ({ ...p, issues: e.target.value }))}
                                        fullWidth
                                        disabled={selected.status === 'closed'}
                                    />

                                    <TextField
                                        label="Hành động đã thực hiện"
                                        placeholder="Các biện pháp khắc phục, sửa chữa hoặc điều chỉnh đã thực hiện..."
                                        multiline
                                        rows={2}
                                        value={form.actionTaken}
                                        onChange={(e) => setForm((p) => ({ ...p, actionTaken: e.target.value }))}
                                        fullWidth
                                        disabled={selected.status === 'closed'}
                                    />

                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                label="Ngày hoàn thành xử lý"
                                                type="date"
                                                value={form.completionDate}
                                                onChange={(e) => setForm((p) => ({ ...p, completionDate: e.target.value }))}
                                                fullWidth
                                                InputLabelProps={{ shrink: true }}
                                                disabled={selected.status === 'closed'}
                                            />
                                        </Grid>
                                    </Grid>

                                    <TextField
                                        label="Đánh giá QA/QC"
                                        placeholder="Đánh giá chất lượng sau bàn giao, mức độ hài lòng..."
                                        multiline
                                        rows={2}
                                        value={form.qaReview}
                                        onChange={(e) => setForm((p) => ({ ...p, qaReview: e.target.value }))}
                                        fullWidth
                                        disabled={selected.status === 'closed'}
                                    />

                                    <TextField
                                        label="Ghi chú bổ sung"
                                        placeholder="Các thông tin bổ sung khác..."
                                        multiline
                                        rows={2}
                                        value={form.notes}
                                        onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                                        fullWidth
                                        disabled={selected.status === 'closed'}
                                    />

                                    <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                                        <Button 
                                            variant="contained" 
                                            onClick={handleSave}
                                            sx={{ minWidth: 150 }}
                                            disabled={selected.status === 'closed'}
                                        >
                                            Lưu đánh giá
                                        </Button>
                                        <Button 
                                            variant="contained"
                                            color="success"
                                            onClick={() => setCloseDialog(true)}
                                            startIcon={<LockIcon />}
                                            disabled={selected.status === 'closed'}
                                        >
                                            Đóng lệnh bàn giao
                                        </Button>
                                        <Button 
                                            variant="outlined" 
                                            onClick={() => {
                                                setSelected(null);
                                                setMessage(null);
                                            }}
                                        >
                                            Hủy
                                        </Button>
                                    </Box>
                                    
                                    {message && <Alert severity="success" icon={<CheckCircleIcon />}>{message}</Alert>}
                                </Stack>
                            </>
                        ) : (
                            <Alert severity="info">
                                Chọn một lệnh bàn giao từ danh sách bên trái để cập nhật thông tin theo dõi.
                            </Alert>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog xác nhận đóng lệnh */}
            <Dialog open={closeDialog} onClose={() => setCloseDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Xác nhận đóng lệnh bàn giao</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                        Bạn có chắc chắn muốn đóng lệnh bàn giao này? Sau khi đóng, bạn sẽ không thể thêm đánh giá mới.
                    </Typography>
                    <TextField
                        label="Lý do đóng lệnh *"
                        placeholder="Ví dụ: Thiết bị hoạt động ổn định, không có vấn đề phát sinh..."
                        multiline
                        rows={3}
                        fullWidth
                        value={closeReason}
                        onChange={(e) => setCloseReason(e.target.value)}
                        required
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setCloseDialog(false)}>
                        Hủy
                    </Button>
                    <Button 
                        variant="contained" 
                        color="success"
                        onClick={handleCloseHandover}
                        disabled={!closeReason.trim()}
                    >
                        Xác nhận đóng
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default HandoversFollowUp;
