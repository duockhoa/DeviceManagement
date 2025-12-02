import { useEffect, useState } from 'react';
import {
    Box,
    Paper,
    Typography,
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    FormControl,
    FormLabel,
    FormGroup,
    FormControlLabel,
    Checkbox,
    Alert,
    CircularProgress,
    Tabs,
    Tab
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Security as SecurityIcon,
    People as PeopleIcon,
    VpnKey as KeyIcon
} from '@mui/icons-material';
import rbacService from '../../services/rbacService';

// Tên module tiếng Việt
const MODULE_NAMES = {
    'assets': 'Thiết bị',
    'maintenance': 'Bảo trì',
    'calibration': 'Hiệu chuẩn',
    'handover': 'Bàn giao',
    'checklist': 'Checklist',
    'work_requests': 'Yêu cầu xử lý',
    'incidents': 'Sự cố',
    'dashboard': 'Trang tổng quan',
    'reports': 'Báo cáo',
    'rbac': 'Phân quyền'
};

export default function RBACManagement() {
    const [tabValue, setTabValue] = useState(0);
    
    // Roles
    const [roles, setRoles] = useState([]);
    const [roleDialog, setRoleDialog] = useState({ open: false, mode: 'create', data: null });
    
    // Permissions
    const [permissions, setPermissions] = useState([]);
    
    // Users & Role Assignment
    const [users, setUsers] = useState([]);
    const [userSearch, setUserSearch] = useState('');
    const [userRoleDialog, setUserRoleDialog] = useState({ open: false, userId: null, currentRoles: [] });
    
    // UI States
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        loadRoles();
        loadPermissions();
        loadUsers();
    }, []);

    const loadRoles = async () => {
        try {
            setLoading(true);
            const res = await rbacService.getAllRoles();
            setRoles(res.data || []);
        } catch (err) {
            setError('Lỗi khi tải roles: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadPermissions = async () => {
        try {
            const res = await rbacService.getAllPermissions();
            setPermissions(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    const loadUsers = async () => {
        try {
            const res = await rbacService.getAllUsers({ limit: 1000 });
            setUsers(res.data || []);
        } catch (err) {
            console.error(err);
            setError('Lỗi khi tải danh sách người dùng');
        }
    };

    const handleCreateRole = () => {
        setRoleDialog({ open: true, mode: 'create', data: { role_name: '', description: '', permission_ids: [] } });
    };

    const handleEditRole = (role) => {
        setRoleDialog({
            open: true,
            mode: 'edit',
            data: {
                id: role.id,
                role_name: role.role_name,
                description: role.description,
                permission_ids: (role.permissions || []).map(p => p.id)
            }
        });
    };

    const handleDeleteRole = async (roleId) => {
        if (!window.confirm('Xác nhận xóa vai trò này?')) return;
        
        try {
            await rbacService.deleteRole(roleId);
            setSuccess('Xóa vai trò thành công');
            loadRoles();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi xóa vai trò');
        }
    };

    const handleSaveRole = async () => {
        try {
            const { mode, data } = roleDialog;
            
            if (mode === 'create') {
                await rbacService.createRole(data);
                setSuccess('Tạo vai trò thành công');
            } else {
                await rbacService.updateRole(data.id, data);
                setSuccess('Cập nhật vai trò thành công');
            }
            
            setRoleDialog({ open: false, mode: 'create', data: null });
            loadRoles();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi lưu vai trò');
        }
    };

    const handleCreatePermission = async () => {
        const module = prompt('Nhập module (assets, maintenance, calibration...):');
        const permissionKey = prompt('Nhập permission key (vd: assets.view):');
        const permissionName = prompt('Nhập tên hiển thị:');
        
        if (!module || !permissionKey || !permissionName) return;
        
        try {
            await rbacService.createPermission({
                module,
                permission_key: permissionKey,
                permission_name: permissionName
            });
            setSuccess('Tạo quyền thành công');
            loadPermissions();
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi tạo quyền');
        }
    };

    const handleAssignRoles = async (userId) => {
        try {
            const res = await rbacService.getUserRoles(userId);
            const currentRoleIds = (res.data || []).map(r => r.id);
            
            setUserRoleDialog({
                open: true,
                userId,
                currentRoles: currentRoleIds
            });
        } catch (err) {
            setError('Lỗi khi tải roles của user');
        }
    };

    const handleSaveUserRoles = async () => {
        try {
            const { userId, currentRoles } = userRoleDialog;
            await rbacService.assignUserRoles(userId, currentRoles);
            setSuccess('Gán vai trò thành công');
            setUserRoleDialog({ open: false, userId: null, currentRoles: [] });
        } catch (err) {
            setError(err.response?.data?.message || 'Lỗi khi gán vai trò');
        }
    };

    const groupedPermissions = permissions.reduce((acc, perm) => {
        if (!acc[perm.module]) acc[perm.module] = [];
        acc[perm.module].push(perm);
        return acc;
    }, {});

    return (
        <Box sx={{ p: 3, bgcolor: '#f5f6fa', minHeight: '100vh' }}>
            {/* Header */}
            <Paper sx={{ p: 3, mb: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <SecurityIcon color="primary" sx={{ fontSize: 40 }} />
                    <Box flex={1}>
                        <Typography variant="h5" fontWeight="bold">
                            Quản lý phân quyền (RBAC)
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Quản lý vai trò, quyền hạn và gán quyền cho người dùng
                        </Typography>
                    </Box>
                </Stack>
            </Paper>

            {/* Alerts */}
            {error && (
                <Alert severity="error" onClose={() => setError(null)} sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            {success && (
                <Alert severity="success" onClose={() => setSuccess(null)} sx={{ mb: 2 }}>
                    {success}
                </Alert>
            )}

            {/* Tabs */}
            <Paper sx={{ mb: 2 }}>
                <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
                    <Tab icon={<PeopleIcon />} label="Vai trò (Roles)" />
                    <Tab icon={<KeyIcon />} label="Quyền (Permissions)" />
                    <Tab icon={<SecurityIcon />} label="Gán quyền cho User" />
                </Tabs>
            </Paper>

            {/* Tab 0: Roles */}
            {tabValue === 0 && (
                <Paper sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Danh sách vai trò</Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreateRole}
                        >
                            Tạo vai trò mới
                        </Button>
                    </Stack>

                    {loading ? (
                        <Box textAlign="center" py={4}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <TableContainer>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tên vai trò</TableCell>
                                        <TableCell>Mô tả</TableCell>
                                        <TableCell>Số quyền</TableCell>
                                        <TableCell>Trạng thái</TableCell>
                                        <TableCell align="right">Thao tác</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {roles.map(role => (
                                        <TableRow key={role.id}>
                                            <TableCell>
                                                <Typography fontWeight="bold">{role.role_name}</Typography>
                                            </TableCell>
                                            <TableCell>{role.description || '-'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={`${role.permissions?.length || 0} quyền`}
                                                    size="small"
                                                    color="primary"
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={role.is_active ? 'Hoạt động' : 'Vô hiệu'}
                                                    size="small"
                                                    color={role.is_active ? 'success' : 'default'}
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleEditRole(role)}
                                                >
                                                    <EditIcon fontSize="small" />
                                                </IconButton>
                                                <IconButton
                                                    size="small"
                                                    color="error"
                                                    onClick={() => handleDeleteRole(role.id)}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </Paper>
            )}

            {/* Tab 1: Permissions */}
            {tabValue === 1 && (
                <Paper sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">Danh sách quyền</Typography>
                            <Typography variant="body2" color="text.secondary">
                                Tổng {permissions.length} quyền trong {Object.keys(groupedPermissions).length} module
                            </Typography>
                        </Box>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleCreatePermission}
                        >
                            Tạo quyền mới
                        </Button>
                    </Stack>

                    <Box sx={{ display: 'grid', gap: 2 }}>
                        {Object.keys(groupedPermissions).sort().map(module => (
                            <Paper key={module} elevation={1} sx={{ overflow: 'hidden' }}>
                                <Box sx={{ 
                                    bgcolor: 'primary.main', 
                                    color: 'white', 
                                    px: 2.5, 
                                    py: 1.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                }}>
                                    <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
                                        {MODULE_NAMES[module] || module}
                                    </Typography>
                                    <Chip 
                                        label={`${groupedPermissions[module].length} quyền`}
                                        size="small"
                                        sx={{ 
                                            bgcolor: 'rgba(255,255,255,0.2)', 
                                            color: 'white',
                                            fontWeight: 500
                                        }}
                                    />
                                </Box>
                                <TableContainer>
                                    <Table size="small">
                                        <TableHead>
                                            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
                                                <TableCell width="35%" sx={{ fontWeight: 600 }}>Tên quyền</TableCell>
                                                <TableCell width="50%" sx={{ fontWeight: 600 }}>Mô tả</TableCell>
                                                <TableCell width="15%" align="center" sx={{ fontWeight: 600 }}>Trạng thái</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {groupedPermissions[module].map(perm => (
                                                <TableRow key={perm.id} hover>
                                                    <TableCell>
                                                        <Typography variant="body2" fontWeight="500" sx={{ mb: 0.5 }}>
                                                            {perm.permission_name}
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary" sx={{ fontFamily: 'monospace' }}>
                                                            {perm.permission_key}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {perm.description || '-'}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={perm.is_active ? 'Hoạt động' : 'Vô hiệu'}
                                                            size="small"
                                                            color={perm.is_active ? 'success' : 'default'}
                                                            sx={{ minWidth: 90 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Paper>
                        ))}
                    </Box>
                </Paper>
            )}

            {/* Tab 2: User Role Assignment */}
            {tabValue === 2 && (
                <Paper sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">Gán vai trò cho người dùng</Typography>
                        <TextField
                            size="small"
                            placeholder="Tìm theo tên, mã NV..."
                            value={userSearch}
                            onChange={(e) => setUserSearch(e.target.value)}
                            sx={{ width: 300 }}
                        />
                    </Stack>
                    
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Tổng số: {users.filter(u => 
                            !userSearch || 
                            u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                            u.employee_code?.toLowerCase().includes(userSearch.toLowerCase())
                        ).length} người dùng
                    </Typography>
                    
                    <TableContainer sx={{ maxHeight: 600 }}>
                        <Table stickyHeader>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Mã NV</TableCell>
                                    <TableCell>Tên</TableCell>
                                    <TableCell>Phòng ban</TableCell>
                                    <TableCell>Chức vụ</TableCell>
                                    <TableCell align="right">Thao tác</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users
                                    .filter(u => 
                                        !userSearch || 
                                        u.name?.toLowerCase().includes(userSearch.toLowerCase()) ||
                                        u.employee_code?.toLowerCase().includes(userSearch.toLowerCase())
                                    )
                                    .map(user => (
                                        <TableRow key={user.id} hover>
                                            <TableCell>{user.employee_code}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.department}</TableCell>
                                            <TableCell>{user.position}</TableCell>
                                            <TableCell align="right">
                                                <Button
                                                    size="small"
                                                    variant="outlined"
                                                    onClick={() => handleAssignRoles(user.id)}
                                                >
                                                    Gán vai trò
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Paper>
            )}

            {/* Role Create/Edit Dialog */}
            <Dialog
                open={roleDialog.open}
                onClose={() => setRoleDialog({ open: false, mode: 'create', data: null })}
                maxWidth="md"
                fullWidth
            >
                <DialogTitle>
                    {roleDialog.mode === 'create' ? 'Tạo vai trò mới' : 'Chỉnh sửa vai trò'}
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} mt={1}>
                        <TextField
                            label="Tên vai trò"
                            fullWidth
                            value={roleDialog.data?.role_name || ''}
                            onChange={(e) => setRoleDialog({
                                ...roleDialog,
                                data: { ...roleDialog.data, role_name: e.target.value }
                            })}
                        />
                        <TextField
                            label="Mô tả"
                            fullWidth
                            multiline
                            rows={2}
                            value={roleDialog.data?.description || ''}
                            onChange={(e) => setRoleDialog({
                                ...roleDialog,
                                data: { ...roleDialog.data, description: e.target.value }
                            })}
                        />
                        
                        <FormControl component="fieldset">
                            <FormLabel component="legend">Chọn quyền cho vai trò này:</FormLabel>
                            <FormGroup>
                                {Object.keys(groupedPermissions).sort().map(module => (
                                    <Box key={module} mb={2}>
                                        <Typography variant="subtitle2" color="primary" mb={1} fontWeight="600">
                                            {MODULE_NAMES[module] || module}
                                        </Typography>
                                        {groupedPermissions[module].map(perm => (
                                            <FormControlLabel
                                                key={perm.id}
                                                control={
                                                    <Checkbox
                                                        checked={(roleDialog.data?.permission_ids || []).includes(perm.id)}
                                                        onChange={(e) => {
                                                            const current = roleDialog.data?.permission_ids || [];
                                                            const next = e.target.checked
                                                                ? [...current, perm.id]
                                                                : current.filter(id => id !== perm.id);
                                                            
                                                            setRoleDialog({
                                                                ...roleDialog,
                                                                data: { ...roleDialog.data, permission_ids: next }
                                                            });
                                                        }}
                                                    />
                                                }
                                                label={`${perm.permission_name} (${perm.permission_key})`}
                                            />
                                        ))}
                                    </Box>
                                ))}
                            </FormGroup>
                        </FormControl>
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setRoleDialog({ open: false, mode: 'create', data: null })}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSaveRole}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>

            {/* User Role Assignment Dialog */}
            <Dialog
                open={userRoleDialog.open}
                onClose={() => setUserRoleDialog({ open: false, userId: null, currentRoles: [] })}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>Gán vai trò cho người dùng</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth sx={{ mt: 2 }}>
                        <FormLabel>Chọn vai trò:</FormLabel>
                        <FormGroup>
                            {roles.map(role => (
                                <FormControlLabel
                                    key={role.id}
                                    control={
                                        <Checkbox
                                            checked={userRoleDialog.currentRoles.includes(role.id)}
                                            onChange={(e) => {
                                                const next = e.target.checked
                                                    ? [...userRoleDialog.currentRoles, role.id]
                                                    : userRoleDialog.currentRoles.filter(id => id !== role.id);
                                                
                                                setUserRoleDialog({ ...userRoleDialog, currentRoles: next });
                                            }}
                                        />
                                    }
                                    label={`${role.role_name} - ${role.description}`}
                                />
                            ))}
                        </FormGroup>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setUserRoleDialog({ open: false, userId: null, currentRoles: [] })}>
                        Hủy
                    </Button>
                    <Button variant="contained" onClick={handleSaveUserRoles}>
                        Lưu
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
