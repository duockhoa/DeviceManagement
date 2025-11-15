import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    Divider,
    IconButton,
    Card,
    CardContent,
    CardMedia,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
    Button,
    CircularProgress,
    Alert,
    Dialog
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';
import InventoryIcon from '@mui/icons-material/Inventory';
import TuneIcon from '@mui/icons-material/Tune';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAssetById } from '../../../redux/slice/assetsSlice';
import { fetchMaintenanceByAsset } from '../../../redux/slice/maintenanceSlice';
import Loading from '../../Loading';
import EditAssetForm from '../EditAssetForm';

function TabPanel({ children, value, index, ...other }) {
    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`asset-tabpanel-${index}`}
            aria-labelledby={`asset-tab-${index}`}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

function AssetDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    
    const [tabValue, setTabValue] = useState(0);
    const [asset, setAsset] = useState(null);
    const [maintenanceHistory, setMaintenanceHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);

    useEffect(() => {
        const loadAssetData = async () => {
            try {
                setLoading(true);
                const assetData = await dispatch(fetchAssetById(id)).unwrap();
                setAsset(assetData);

                // Load maintenance history
                const maintenanceData = await dispatch(fetchMaintenanceByAsset(id)).unwrap();
                setMaintenanceHistory(maintenanceData);
            } catch (err) {
                setError(err.message || 'Không thể tải thông tin thiết bị');
                console.error('Error loading asset:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            loadAssetData();
        }
    }, [id, dispatch]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    const handleEdit = () => {
        setEditDialogOpen(true);
    };

    const handleCloseEdit = () => {
        setEditDialogOpen(false);
        // Reload asset data sau khi đóng dialog
        if (id) {
            dispatch(fetchAssetById(id)).unwrap()
                .then(data => setAsset(data))
                .catch(err => console.error('Error reloading asset:', err));
        }
    };

    const handleBack = () => {
        navigate('/devices');
    };

    if (loading) {
        return <Loading />;
    }

    if (error) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="error">{error}</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        );
    }

    if (!asset) {
        return (
            <Box sx={{ p: 3 }}>
                <Alert severity="warning">Không tìm thấy thông tin thiết bị</Alert>
                <Button startIcon={<ArrowBackIcon />} onClick={handleBack} sx={{ mt: 2 }}>
                    Quay lại
                </Button>
            </Box>
        );
    }

    const getStatusColor = (status) => {
        switch (status) {
            case 'active': return 'success';
            case 'inactive': return 'error';
            default: return 'default';
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 'active': return 'Hoạt động';
            case 'inactive': return 'Ngừng hoạt động';
            default: return 'Không xác định';
        }
    };

    return (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', p: 3, backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <Paper sx={{ p: 2, mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <IconButton onClick={handleBack}>
                        <ArrowBackIcon />
                    </IconButton>
                    <Box>
                        <Typography variant="h5" sx={{ fontWeight: 'bold', fontSize: '1.8rem' }}>
                            {asset.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.2rem' }}>
                            Mã thiết bị: {asset.asset_code}
                        </Typography>
                    </Box>
                    <Chip 
                        label={getStatusLabel(asset.status)} 
                        color={getStatusColor(asset.status)}
                        size="small"
                    />
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button 
                        startIcon={<EditIcon />} 
                        variant="outlined"
                        onClick={handleEdit}
                    >
                        Chỉnh sửa
                    </Button>
                </Box>
            </Paper>

            {/* Main Content */}
            <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                {/* Left Column - Image & Basic Info */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ mb: 2 }}>
                        <CardMedia
                            component="img"
                            height="300"
                            image={asset.image || '/placeholder-image.png'}
                            alt={asset.name}
                            sx={{ objectFit: 'contain', p: 2, backgroundColor: '#fafafa' }}
                        />
                        <CardContent>
                            <Typography variant="h6" gutterBottom sx={{ fontSize: '1.4rem', fontWeight: 'bold' }}>Thông tin cơ bản</Typography>
                            <Divider sx={{ mb: 2 }} />
                            
                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Danh mục:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {asset.SubCategory?.Category?.name || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Loại thiết bị:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {asset.SubCategory?.name || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Phòng ban:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {asset.Department?.name || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Vị trí:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {asset.Area?.name || 'N/A'}
                                </Typography>
                                {asset.Area?.Plant && (
                                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                        {asset.Area.Plant.name}
                                    </Typography>
                                )}
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Người tạo:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {asset.Creator?.name || 'N/A'}
                                </Typography>
                            </Box>

                            <Box sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Ngày tạo:</Typography>
                                <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>
                                    {asset.created_at ? new Date(asset.created_at).toLocaleDateString('vi-VN') : 'N/A'}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Right Column - Detailed Info */}
                <Grid item xs={12} md={8}>
                    <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                        <Tabs value={tabValue} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <Tab icon={<DescriptionIcon />} label="Thông tin chung" />
                            <Tab icon={<InventoryIcon />} label="Thành phần" />
                            <Tab icon={<TuneIcon />} label="Thông số kỹ thuật" />
                            <Tab icon={<BuildIcon />} label="Lịch sử bảo trì" />
                            <Tab icon={<AttachFileIcon />} label="Tài liệu" />
                        </Tabs>

                        <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                            {/* Tab 0: General Info */}
                            <TabPanel value={tabValue} index={0}>
                                {asset.GeneralInfo ? (
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Năm sản xuất:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.manufacture_year || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Nhà sản xuất:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.manufacturer || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Xuất xứ:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.country_of_origin || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Model:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.model || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Số serial:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.serial_number || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Nhà cung cấp:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.supplier || 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Thời hạn bảo hành:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.warranty_period_months ? 
                                                    `${asset.GeneralInfo.warranty_period_months} tháng` : 'N/A'}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} md={6}>
                                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '1.1rem' }}>Hết hạn bảo hành:</Typography>
                                            <Typography variant="body1" sx={{ mb: 2, fontSize: '1.2rem' }}>
                                                {asset.GeneralInfo.warranty_expiry_date ? 
                                                    new Date(asset.GeneralInfo.warranty_expiry_date).toLocaleDateString('vi-VN') : 'N/A'}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                ) : (
                                    <Alert severity="info">Chưa có thông tin chung</Alert>
                                )}
                            </TabPanel>

                            {/* Tab 1: Components */}
                            <TabPanel value={tabValue} index={1}>
                                {asset.Components && asset.Components.length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Tên linh kiện</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Mã linh kiện</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Thông số</strong></TableCell>
                                                    <TableCell align="center"><strong style={{ fontSize: '1.2rem' }}>Số lượng</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Đơn vị</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Ghi chú</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {asset.Components.map((component) => (
                                                    <TableRow key={component.id}>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{component.component_name}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{component.component_code}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{component.specification}</TableCell>
                                                        <TableCell align="center" sx={{ fontSize: '1.2rem' }}>{component.quantity}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{component.unit}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{component.remarks}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Alert severity="info">Chưa có thông tin thành phần</Alert>
                                )}
                            </TabPanel>

                            {/* Tab 2: Specifications */}
                            <TabPanel value={tabValue} index={2}>
                                {asset.Specifications && asset.Specifications.length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Thông số</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Giá trị</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Ghi chú</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {asset.Specifications.map((spec) => (
                                                    <TableRow key={spec.id}>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{spec.SpecCategory?.spec_name || 'N/A'}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{spec.value}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{spec.remarks}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Alert severity="info">Chưa có thông số kỹ thuật</Alert>
                                )}
                            </TabPanel>

                            {/* Tab 3: Maintenance History */}
                            <TabPanel value={tabValue} index={3}>
                                {maintenanceHistory && maintenanceHistory.length > 0 ? (
                                    <TableContainer>
                                        <Table size="small">
                                            <TableHead>
                                                <TableRow>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Mã bảo trì</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Tiêu đề</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Loại</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Ngày thực hiện</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Trạng thái</strong></TableCell>
                                                    <TableCell><strong style={{ fontSize: '1.2rem' }}>Kỹ thuật viên</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {maintenanceHistory.map((maintenance) => (
                                                    <TableRow key={maintenance.id}>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{maintenance.maintenance_code}</TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{maintenance.title}</TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={maintenance.maintenance_type === 'preventive' ? 'Phòng ngừa' : 'Sửa chữa'}
                                                                size="small"
                                                                color={maintenance.maintenance_type === 'preventive' ? 'primary' : 'warning'}
                                                                sx={{ fontSize: '1.2rem' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>
                                                            {new Date(maintenance.scheduled_date).toLocaleDateString('vi-VN')}
                                                        </TableCell>
                                                        <TableCell>
                                                            <Chip 
                                                                label={maintenance.status}
                                                                size="small"
                                                                color="default"
                                                                sx={{ fontSize: '1.2rem' }}
                                                            />
                                                        </TableCell>
                                                        <TableCell sx={{ fontSize: '1.2rem' }}>{maintenance.technician?.name || 'N/A'}</TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                ) : (
                                    <Alert severity="info">Chưa có lịch sử bảo trì</Alert>
                                )}
                            </TabPanel>

                            {/* Tab 4: Attachments */}
                            <TabPanel value={tabValue} index={4}>
                                {asset.Attachments && asset.Attachments.length > 0 ? (
                                    <Box>
                                        {asset.Attachments.map((attachment) => (
                                            <Card key={attachment.id} sx={{ mb: 2 }}>
                                                <CardContent>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                                        <AttachFileIcon color="primary" />
                                                        <Box sx={{ flexGrow: 1 }}>
                                                            <Typography variant="body1" sx={{ fontSize: '1.2rem' }}>{attachment.file_name}</Typography>
                                                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '1.1rem' }}>
                                                                {attachment.description || 'No description'}
                                                            </Typography>
                                                        </Box>
                                                        <Button size="small" variant="outlined">
                                                            Tải xuống
                                                        </Button>
                                                    </Box>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </Box>
                                ) : (
                                    <Alert severity="info">Chưa có tài liệu đính kèm</Alert>
                                )}
                            </TabPanel>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            {/* Dialog chỉnh sửa thiết bị */}
            <Dialog
                open={editDialogOpen}
                onClose={handleCloseEdit}
                maxWidth="xl"
                fullWidth
            >
                {asset && (
                    <EditAssetForm 
                        handleClose={handleCloseEdit} 
                        assetData={asset}
                    />
                )}
            </Dialog>
        </Box>
    );
}

export default AssetDetail;
