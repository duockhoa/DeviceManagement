import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAssets } from "../../redux/slice/assetsSlice";
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    Autocomplete,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import Loading from '../../component/Loading';
import axios from '../../services/customize-axios';

function AssetSpecifications() {
    const dispatch = useDispatch();
    const assets = useSelector((state) => state.assets.assets);
    const loading = useSelector((state) => state.assets.loading);
    
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [specifications, setSpecifications] = useState([]);
    const [specCategories, setSpecCategories] = useState([]);
    const [loadingSpecs, setLoadingSpecs] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState({});

    useEffect(() => {
        dispatch(fetchAssets());
        fetchSpecCategories();
    }, [dispatch]);

    const fetchSpecCategories = async () => {
        try {
            const response = await axios.get('/specification-categories');
            setSpecCategories(response.data.data || []);
        } catch (error) {
            console.error('Error fetching spec categories:', error);
        }
    };

    const fetchAssetSpecifications = async (assetId) => {
        setLoadingSpecs(true);
        try {
            const response = await axios.get(`/assets/${assetId}/specifications`);
            setSpecifications(response.data.data || []);
        } catch (error) {
            console.error('Error fetching specifications:', error);
            setSpecifications([]);
        } finally {
            setLoadingSpecs(false);
        }
    };

    const handleAssetChange = (event, value) => {
        setSelectedAsset(value);
        if (value) {
            fetchAssetSpecifications(value.id);
        } else {
            setSpecifications([]);
        }
    };

    const handleEdit = (spec) => {
        setEditingId(spec.id);
        setEditValue({
            spec_value: spec.spec_value || '',
            numeric_value: spec.numeric_value || '',
            remarks: spec.remarks || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue({});
    };

    const handleSaveEdit = async (specId) => {
        try {
            await axios.put(`/assets/${selectedAsset.id}/specifications/${specId}`, editValue);
            fetchAssetSpecifications(selectedAsset.id);
            setEditingId(null);
            setEditValue({});
        } catch (error) {
            console.error('Error updating specification:', error);
            alert('Lỗi khi cập nhật thông số!');
        }
    };

    const handleDelete = async (specId) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông số này?')) {
            try {
                await axios.delete(`/assets/${selectedAsset.id}/specifications/${specId}`);
                fetchAssetSpecifications(selectedAsset.id);
            } catch (error) {
                console.error('Error deleting specification:', error);
                alert('Lỗi khi xóa thông số!');
            }
        }
    };

    const handleAddNew = async () => {
        // TODO: Open dialog to add new specification
        const newSpec = {
            spec_category_id: null,
            spec_value: '',
            numeric_value: null,
            remarks: ''
        };
        // This would open a dialog, for now just alert
        alert('Chức năng thêm mới đang phát triển');
    };

    const columns = [
        {
            field: 'SpecCategory.spec_code',
            headerName: 'Mã thông số',
            width: 150,
            valueGetter: (params) => params.row.SpecCategory?.spec_code || '',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {params.row.SpecCategory?.spec_code}
                </Typography>
            )
        },
        {
            field: 'SpecCategory.spec_name',
            headerName: 'Tên thông số',
            width: 200,
            valueGetter: (params) => params.row.SpecCategory?.spec_name || '',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.row.SpecCategory?.spec_name}
                </Typography>
            )
        },
        {
            field: 'spec_value',
            headerName: 'Giá trị',
            width: 200,
            editable: false,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            value={editValue.spec_value}
                            onChange={(e) => setEditValue({ ...editValue, spec_value: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'numeric_value',
            headerName: 'Giá trị số',
            width: 120,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            type="number"
                            value={editValue.numeric_value}
                            onChange={(e) => setEditValue({ ...editValue, numeric_value: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'SpecCategory.unit',
            headerName: 'Đơn vị',
            width: 100,
            valueGetter: (params) => params.row.SpecCategory?.unit || '',
            renderCell: (params) => (
                <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                    {params.row.SpecCategory?.unit || '-'}
                </Typography>
            )
        },
        {
            field: 'remarks',
            headerName: 'Ghi chú',
            width: 200,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <TextField
                            size="small"
                            value={editValue.remarks}
                            onChange={(e) => setEditValue({ ...editValue, remarks: e.target.value })}
                            fullWidth
                        />
                    );
                }
                return (
                    <Typography variant="body2" sx={{ fontSize: '1.2rem' }}>
                        {params.value || '-'}
                    </Typography>
                );
            }
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            sortable: false,
            renderCell: (params) => {
                if (editingId === params.row.id) {
                    return (
                        <Box>
                            <Tooltip title="Lưu">
                                <IconButton
                                    size="small"
                                    color="success"
                                    onClick={() => handleSaveEdit(params.row.id)}
                                >
                                    <SaveIcon />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Hủy">
                                <IconButton
                                    size="small"
                                    color="default"
                                    onClick={handleCancelEdit}
                                >
                                    <CancelIcon />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    );
                }
                return (
                    <Box>
                        <Tooltip title="Sửa">
                            <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEdit(params.row)}
                            >
                                <EditIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDelete(params.row.id)}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>
                );
            }
        }
    ];

    if (loading) {
        return <Loading />;
    }

    return (
        <Box sx={{ p: 3, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Paper sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                            Thông số kỹ thuật thiết bị
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Chọn thiết bị để xem và chỉnh sửa thông số kỹ thuật
                        </Typography>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        <Button
                            variant="outlined"
                            startIcon={<DownloadIcon />}
                            disabled={!selectedAsset}
                        >
                            Xuất Excel
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<UploadIcon />}
                            disabled={!selectedAsset}
                        >
                            Nhập Excel
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={handleAddNew}
                            disabled={!selectedAsset}
                        >
                            Thêm thông số
                        </Button>
                    </Stack>
                </Box>

                <Autocomplete
                    options={assets}
                    getOptionLabel={(option) => `${option.asset_code} - ${option.name}`}
                    value={selectedAsset}
                    onChange={handleAssetChange}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Chọn thiết bị"
                            placeholder="Tìm kiếm theo mã hoặc tên thiết bị..."
                        />
                    )}
                    sx={{ width: 500 }}
                />
            </Paper>

            <Paper sx={{ p: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
                {!selectedAsset ? (
                    <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100%' 
                    }}>
                        <Typography variant="h6" color="text.secondary">
                            Vui lòng chọn thiết bị để xem thông số kỹ thuật
                        </Typography>
                    </Box>
                ) : (
                    <Box sx={{ height: "100%", width: '100%', display: 'flex', flexDirection: 'column' }}>
                        <DataGrid
                            rows={specifications}
                            columns={columns}
                            loading={loadingSpecs}
                            pageSize={10}
                            rowsPerPageOptions={[10, 25, 50]}
                            disableSelectionOnClick
                            sx={{
                                flex: 1,
                                border: 'none',
                                '& .MuiDataGrid-cell': {
                                    fontSize: '1.2rem',
                                    borderBottom: '1px solid #f0f0f0'
                                },
                                '& .MuiDataGrid-columnHeaders': {
                                    fontSize: '1.2rem',
                                    fontWeight: 'bold',
                                    backgroundColor: '#f8f9fa',
                                    borderBottom: '2px solid #e0e0e0'
                                },
                                '& .MuiDataGrid-row': {
                                    minHeight: '60px !important'
                                }
                            }}
                        />
                    </Box>
                )}
            </Paper>
        </Box>
    );
}

export default AssetSpecifications;
