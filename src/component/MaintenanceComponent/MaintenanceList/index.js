import { Box, Button, IconButton, Tooltip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useDispatch, useSelector } from 'react-redux';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useState, useEffect } from 'react';
import { fetchMaintenance, setSelectedItem } from '../../../redux/slice/maintenanceSlice';

function MaintenanceList() {
    const dispatch = useDispatch();
    
    // Lấy dữ liệu từ Redux store
    const { items: maintenanceList, loading } = useSelector(state => state.maintenance);

    // Lấy danh sách bảo trì khi component được mount
    useEffect(() => {
        dispatch(fetchMaintenance());
    }, [dispatch]);

    // Định nghĩa cột cho DataGrid
    const columns = [
        { 
            field: 'deviceName', 
            headerName: 'Tên thiết bị', 
            width: 200,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span>{params.value}</span>
                </Tooltip>
            )
        },
        { 
            field: 'maintenanceDate', 
            headerName: 'Ngày bảo trì', 
            width: 150,
            valueFormatter: (params) => {
                return new Date(params.value).toLocaleDateString('vi-VN');
            }
        },
        { 
            field: 'status', 
            headerName: 'Trạng thái', 
            width: 130,
            renderCell: (params) => {
                const statusColors = {
                    'pending': '#FFA500',
                    'in-progress': '#0000FF',
                    'completed': '#008000'
                };
                const statusLabels = {
                    'pending': 'Chờ xử lý',
                    'in-progress': 'Đang thực hiện',
                    'completed': 'Hoàn thành'
                };
                return (
                    <Box
                        sx={{
                            backgroundColor: statusColors[params.value],
                            color: 'white',
                            padding: '5px 10px',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                        }}
                    >
                        {statusLabels[params.value]}
                    </Box>
                );
            }
        },
        { 
            field: 'assignedTo', 
            headerName: 'Người thực hiện', 
            width: 160 
        },
        { 
            field: 'description', 
            headerName: 'Mô tả', 
            width: 200,
            renderCell: (params) => (
                <Tooltip title={params.value}>
                    <span>{params.value}</span>
                </Tooltip>
            )
        },
        {
            field: 'actions',
            headerName: 'Thao tác',
            width: 120,
            sortable: false,
            renderCell: (params) => (
                <Box>
                    <Tooltip title="Sửa">
                        <IconButton
                            onClick={() => handleEdit(params.row)}
                            color="primary"
                            size="small"
                        >
                            <EditIcon />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <IconButton
                            onClick={() => handleDelete(params.row.id)}
                            color="error"
                            size="small"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        }
    ];

    // Xử lý khi click nút sửa
    const handleEdit = (row) => {
        dispatch(setSelectedItem(row));
    };

    // Xử lý khi click nút xóa
    const handleDelete = (id) => {
        // TODO: Thêm dialog xác nhận xóa
        console.log('Delete maintenance with id:', id);
    };

    return (
        <Box sx={{ height: 600, width: '100%' }}>
            <DataGrid
                rows={maintenanceList}
                columns={columns}
                pageSize={10}
                rowsPerPageOptions={[10, 25, 50]}
                checkboxSelection
                disableSelectionOnClick
                loading={loading}
                density="comfortable"
                getRowId={(row) => row.id}
                sx={{
                    '& .MuiDataGrid-columnHeaders': {
                        backgroundColor: '#f5f5f5',
                    },
                    '& .MuiDataGrid-cell:focus': {
                        outline: 'none'
                    }
                }}
            />
        </Box>
    );
}

export default MaintenanceList;