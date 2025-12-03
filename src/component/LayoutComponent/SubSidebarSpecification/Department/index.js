import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Business,
    Add
} from '@mui/icons-material';
import { fetchDepartments } from '../../../../redux/slice/departmentSlice';

function Department({ isOpen, onToggle }) {
    const dispatch = useDispatch();
    
    // Lấy dữ liệu departments từ Redux store
    const { departments, loading, error } = useSelector(state => state.departments);
    
    // Fetch departments khi component mount
    useEffect(() => {
        dispatch(fetchDepartments());
    }, [dispatch]);
    
    // Handle click nút Add
    const handleAddClick = (event) => {
        event.stopPropagation();
        alert('Chức năng thêm phòng ban đang được phát triển');
    };

    return (
        <Box>
            <ListItemButton 
                onClick={onToggle}
                sx={{ 
                    backgroundColor: '#fff',
                    borderBottom: '1px solid #e0e0e0',
                    py: 1.5
                }}
            >
                <ListItemIcon sx={{ minWidth: '35px' }}>
                    <Business sx={{ fontSize: '1.8rem', color: '#8e24aa' }} />
                </ListItemIcon>
                <ListItemText 
                    primary="Phòng ban quản lý" 
                    primaryTypographyProps={{ 
                        sx: { fontSize: '1.4rem', fontWeight: 'medium' } 
                    }}
                />
                <ListItemIcon 
                    sx={{ 
                        minWidth: '30px',
                        minHeight: '30px',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: 'rgba(142, 36, 170, 0.1)',
                        }
                    }}
                    onClick={handleAddClick}
                >
                    <Add sx={{ fontSize: '1.8rem', color: '#8e24aa', margin: 'auto' }} />
                </ListItemIcon>
                {isOpen ? 
                    <ExpandLess sx={{ fontSize: '2rem' }} /> : 
                    <ExpandMore sx={{ fontSize: '2rem' }} />
                }
            </ListItemButton>
            
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ backgroundColor: '#f8f9fa', px: 2, py: 1 }}>
                    {loading ? (
                        <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                Loading...
                            </Typography>
                        </Box>
                    ) : error ? (
                        <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#d32f2f' }}>
                                Error: {error}
                            </Typography>
                        </Box>
                    ) : departments && departments.length > 0 ? (
                        departments.map((department, index) => (
                            <Box key={department.id || index} sx={{ mb: 0.5 }}>
                                <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                    ✓ {department.name}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                Không có phòng ban
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}

export default Department;