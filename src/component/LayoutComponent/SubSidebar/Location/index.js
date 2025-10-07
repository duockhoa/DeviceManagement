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
    LocationOn,
    Add
} from '@mui/icons-material';
import { fetchAreas } from '../../../../redux/slice/areaSlice';

function Location({ isOpen, onToggle }) {
    const dispatch = useDispatch();
    
    // Lấy dữ liệu từ Redux store
    const { areas, loading, error } = useSelector(state => state.areas);

    // Fetch areas khi component mount
    useEffect(() => {
        dispatch(fetchAreas());
    }, [dispatch]);

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
                    <LocationOn sx={{ fontSize: '1.8rem', color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText 
                    primary="Location" 
                    primaryTypographyProps={{ 
                        sx: { fontSize: '1.4rem', fontWeight: 'medium' } 
                    }}
                />
                <ListItemIcon sx={{ minWidth: '30px' }}>
                    <Add sx={{ fontSize: '1.8rem', color: '#1976d2' }} />
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
                    ) : areas.length > 0 ? (
                        areas.map((area, index) => (
                            <Box key={area.id || index} sx={{ mb: 0.5 }}>
                                <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                    ✓ {area.name}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                Không có khu vực
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}

export default Location;