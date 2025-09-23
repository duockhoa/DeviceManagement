import React, { useState } from 'react';
import {
    Paper,
    Box,
    Typography,
    Button,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    IconButton,
    Chip,
    Avatar,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Card,
    CardContent,
    Grid,
    InputAdornment,
    Tooltip,
    Alert,
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Search as SearchIcon,
    Visibility as ViewIcon,
    Devices as DevicesIcon,
    Computer as ComputerIcon,
    LocalHospital as MedicalIcon,
    Build as BuildIcon,
    BusinessCenter as OfficeIcon,
} from '@mui/icons-material';

// Dữ liệu mẫu thiết bị
const mockDevices = [
    {
        id: 1,
        code: 'DK-YT-001',
        name: 'Máy X-Ray DR',
        category: 'Thiết bị y tế',
        brand: 'Siemens',
        model: 'Ysio Max',
        status: 'active',
        location: 'Phòng X-Quang',
        purchaseDate: '2023-01-15',
        warranty: '2025-01-15',
        responsible: 'Nguyễn Văn A',
    },
    {
        id: 2,
        code: 'DK-SX-002',
        name: 'Máy đóng gói tự động',
        category: 'Máy sản xuất',
        brand: 'Bosch',
        model: 'TLM-2000',
        status: 'maintenance',
        location: 'Phân xưởng 1',
        purchaseDate: '2022-08-20',
        warranty: '2024-08-20',
        responsible: 'Trần Thị B',
    },
    {
        id: 3,
        code: 'DK-VP-003',
        name: 'Máy tính Dell OptiPlex',
        category: 'Thiết bị văn phòng',
        brand: 'Dell',
        model: 'OptiPlex 7090',
        status: 'active',
        location: 'Phòng IT',
        purchaseDate: '2023-05-10',
        warranty: '2026-05-10',
        responsible: 'Lê Văn C',
    },
    {
        id: 4,
        code: 'DK-YT-004',
        name: 'Máy siêu âm',
        category: 'Thiết bị y tế',
        brand: 'GE Healthcare',
        model: 'LOGIQ P10',
        status: 'broken',
        location: 'Phòng khám',
        purchaseDate: '2021-12-01',
        warranty: '2023-12-01',
        responsible: 'Phạm Thị D',
    },
    {
        id: 5,
        code: 'DK-SX-005',
        name: 'Máy trộn dược liệu',
        category: 'Máy sản xuất',
        brand: 'IMA',
        model: 'BFC-500',
        status: 'active',
        location: 'Phân xưởng 2',
        purchaseDate: '2023-03-22',
        warranty: '2025-03-22',
        responsible: 'Hoàng Văn E',
    },
];

const deviceCategories = ['Tất cả', 'Thiết bị y tế', 'Máy sản xuất', 'Thiết bị văn phòng', 'Thiết bị khác'];
const deviceStatuses = [
    { value: 'all', label: 'Tất cả', color: 'default' },
    { value: 'active', label: 'Hoạt động', color: 'success' },
    { value: 'maintenance', label: 'Bảo trì', color: 'warning' },
    { value: 'broken', label: 'Hỏng hóc', color: 'error' },
    { value: 'inactive', label: 'Ngừng sử dụng', color: 'default' },
];

function DeviceCategory() {
    const [devices, setDevices] = useState(mockDevices);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('Tất cả');
    const [statusFilter, setStatusFilter] = useState('all');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [dialogMode, setDialogMode] = useState('view'); // 'view', 'add', 'edit'

    // Lọc dữ liệu
    const filteredDevices = devices.filter((device) => {
        const matchesSearch =
            device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            device.brand.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = categoryFilter === 'Tất cả' || device.category === categoryFilter;
        const matchesStatus = statusFilter === 'all' || device.status === statusFilter;

        return matchesSearch && matchesCategory && matchesStatus;
    });

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenDialog = (mode, device = null) => {
        setDialogMode(mode);
        setSelectedDevice(device);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setSelectedDevice(null);
    };

    const getStatusChip = (status) => {
        const statusConfig = deviceStatuses.find((s) => s.value === status);
        return (
            <Chip
                label={statusConfig?.label || status}
                color={statusConfig?.color || 'default'}
                size="small"
                variant="outlined"
            />
        );
    };

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'Thiết bị y tế':
                return <MedicalIcon />;
            case 'Máy sản xuất':
                return <BuildIcon />;
            case 'Thiết bị văn phòng':
                return <ComputerIcon />;
            default:
                return <DevicesIcon />;
        }
    };

    const getStatsSummary = () => {
        const total = devices.length;
        const active = devices.filter((d) => d.status === 'active').length;
        const maintenance = devices.filter((d) => d.status === 'maintenance').length;
        const broken = devices.filter((d) => d.status === 'broken').length;

        return { total, active, maintenance, broken };
    };

    const stats = getStatsSummary();

    return (
        <Box p={3} sx={{ height: '100%', backgroundColor: '#f5f5f5' }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2', mb: 3 }}>
                Danh mục thiết bị
            </Typography>

            <Paper sx={{ p: 2 }}>
                {/* Thanh công cụ */}
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                    <TextField
                        placeholder="Tìm kiếm thiết bị..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ minWidth: 300 }}
                    />

                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Danh mục</InputLabel>
                        <Select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            label="Danh mục"
                        >
                            {deviceCategories.map((category) => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Trạng thái</InputLabel>
                        <Select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            label="Trạng thái"
                        >
                            {deviceStatuses.map((status) => (
                                <MenuItem key={status.value} value={status.value}>
                                    {status.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog('add')}
                        sx={{ ml: 'auto' }}
                    >
                        Thêm thiết bị
                    </Button>
                </Box>

                {/* Bảng dữ liệu */}
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                                <TableCell>
                                    <strong>Mã thiết bị</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Tên thiết bị</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Danh mục</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Thương hiệu</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Trạng thái</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Vị trí</strong>
                                </TableCell>
                                <TableCell>
                                    <strong>Người phụ trách</strong>
                                </TableCell>
                                <TableCell align="center">
                                    <strong>Thao tác</strong>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredDevices
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((device) => (
                                    <TableRow key={device.id} hover>
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="bold" color="primary">
                                                {device.code}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Avatar sx={{ width: 32, height: 32, bgcolor: '#e3f2fd' }}>
                                                    {getCategoryIcon(device.category)}
                                                </Avatar>
                                                <Typography variant="body2">{device.name}</Typography>
                                            </Box>
                                        </TableCell>
                                        <TableCell>{device.category}</TableCell>
                                        <TableCell>
                                            <Typography variant="body2">{device.brand}</Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {device.model}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>{getStatusChip(device.status)}</TableCell>
                                        <TableCell>{device.location}</TableCell>
                                        <TableCell>{device.responsible}</TableCell>
                                        <TableCell align="center">
                                            <Tooltip title="Xem chi tiết">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog('view', device)}
                                                >
                                                    <ViewIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Chỉnh sửa">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleOpenDialog('edit', device)}
                                                >
                                                    <EditIcon />
                                                </IconButton>
                                            </Tooltip>
                                            <Tooltip title="Xóa">
                                                <IconButton size="small" color="error">
                                                    <DeleteIcon />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>

                {/* Phân trang */}
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredDevices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Số dòng mỗi trang:"
                    labelDisplayedRows={({ from, to, count }) =>
                        `${from}-${to} của ${count !== -1 ? count : `hơn ${to}`}`
                    }
                />
            </Paper>

            {/* Dialog chi tiết/thêm/sửa */}
            <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
                <DialogTitle>
                    {dialogMode === 'view' && 'Chi tiết thiết bị'}
                    {dialogMode === 'add' && 'Thêm thiết bị mới'}
                    {dialogMode === 'edit' && 'Chỉnh sửa thiết bị'}
                </DialogTitle>
                <DialogContent>
                    {selectedDevice && (
                        <Box sx={{ mt: 2 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Mã thiết bị"
                                        value={selectedDevice.code}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Tên thiết bị"
                                        value={selectedDevice.name}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <FormControl fullWidth disabled={dialogMode === 'view'}>
                                        <InputLabel>Danh mục</InputLabel>
                                        <Select value={selectedDevice.category} label="Danh mục">
                                            {deviceCategories.slice(1).map((category) => (
                                                <MenuItem key={category} value={category}>
                                                    {category}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Thương hiệu"
                                        value={selectedDevice.brand}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Model"
                                        value={selectedDevice.model}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Vị trí"
                                        value={selectedDevice.location}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Ngày mua"
                                        type="date"
                                        value={selectedDevice.purchaseDate}
                                        disabled={dialogMode === 'view'}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        fullWidth
                                        label="Hết bảo hành"
                                        type="date"
                                        value={selectedDevice.warranty}
                                        disabled={dialogMode === 'view'}
                                        InputLabelProps={{ shrink: true }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        label="Người phụ trách"
                                        value={selectedDevice.responsible}
                                        disabled={dialogMode === 'view'}
                                    />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>{dialogMode === 'view' ? 'Đóng' : 'Hủy'}</Button>
                    {dialogMode !== 'view' && (
                        <Button variant="contained" onClick={handleCloseDialog}>
                            {dialogMode === 'add' ? 'Thêm' : 'Lưu'}
                        </Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default DeviceCategory;
