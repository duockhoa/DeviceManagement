import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Chip
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Business,
    Add
} from '@mui/icons-material';
import { fetchPlants } from '../../../../redux/slice/plantSlice';

function Plant({ isOpen, onToggle }) {
    const dispatch = useDispatch();
    
    // Lấy dữ liệu từ Redux store
    const { plants, loading, error } = useSelector(state => state.plants);

    // Fetch plants khi component mount
    useEffect(() => {
        dispatch(fetchPlants());
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
                    <Business sx={{ fontSize: '1.8rem', color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText 
                    primary="Plant" 
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
                        <Chip 
                            label="Loading..."
                            size="small"
                            sx={{ 
                                fontSize: '1.2rem',
                                backgroundColor: '#f0f0f0',
                                color: '#666'
                            }}
                        />
                    ) : error ? (
                        <Chip 
                            label={`Error: ${error}`}
                            size="small"
                            sx={{ 
                                fontSize: '1.2rem',
                                backgroundColor: '#ffebee',
                                color: '#d32f2f'
                            }}
                        />
                    ) : plants.length > 0 ? (
                        plants.map((plant, index) => (
                            <Chip 
                                key={plant.id || index}
                                label={plant.name}
                                size="small"
                                sx={{ 
                                    fontSize: '1.2rem',
                                    backgroundColor: '#e3f2fd',
                                    color: '#1976d2',
                                    fontWeight: 'medium',
                                    mr: 1,
                                    mb: 1
                                }}
                            />
                        ))
                    ) : (
                        <Chip 
                            label="Không có nhà máy"
                            size="small"
                            sx={{ 
                                fontSize: '1.2rem',
                                backgroundColor: '#f0f0f0',
                                color: '#666'
                            }}
                        />
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}

export default Plant;