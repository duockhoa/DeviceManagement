import React from 'react';
import { useSelector } from 'react-redux';
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

function Department({ isOpen, onToggle }) {
    // Lấy dữ liệu departments từ Redux store
    const departments = useSelector(state => state.departments?.departments || []);

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
                        sx: { fontSize: '1.3rem', fontWeight: 'medium' } 
                    }}
                />
                <ListItemIcon sx={{ minWidth: '30px' }}>
                    <Add sx={{ fontSize: '1.8rem', color: '#8e24aa' }} />
                </ListItemIcon>
                {isOpen ? 
                    <ExpandLess sx={{ fontSize: '2rem' }} /> : 
                    <ExpandMore sx={{ fontSize: '2rem' }} />
                }
            </ListItemButton>
            
            <Collapse in={isOpen} timeout="auto" unmountOnExit>
                <Box sx={{ backgroundColor: '#f8f9fa', px: 2, py: 1 }}>
                    {departments.map((department, index) => (
                        <Box key={index} sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.1rem', color: '#666' }}>
                                ✓ {department.name}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </Collapse>
        </Box>
    );
}

export default Department;