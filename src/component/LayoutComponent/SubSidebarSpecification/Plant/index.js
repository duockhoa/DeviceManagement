import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PlantFrom from '../../../PlantComponent/PlantFrom';
import {
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    Dialog,
    IconButton
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Apartment,
    Add
} from '@mui/icons-material';
import { fetchPlants } from '../../../../redux/slice/plantSlice';

function Plant({ isOpen, onToggle }) {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);

    // Lấy dữ liệu từ Redux store
    const { plants, loading, error } = useSelector(state => state.plants);

    // Fetch plants khi component mount
    useEffect(() => {
        dispatch(fetchPlants());
    }, [dispatch]);

    // Handle click nút Add
    const handleAddClick = (event) => {
        event.stopPropagation(); // Ngăn không cho trigger onToggle
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        dispatch(fetchPlants()); // Refresh list after adding
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
                    <Apartment sx={{ fontSize: '1.8rem', color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText
                    primary="Plant"
                    primaryTypographyProps={{
                        sx: { fontSize: '1.4rem', fontWeight: 'medium' }
                    }}
                />
                <IconButton
                    size="small"
                    onClick={handleAddClick}
                    sx={{
                        '&:hover': {
                            backgroundColor: 'rgba(25, 118, 210, 0.1)',
                        }
                    }}
                >
                    <Add sx={{ fontSize: '1.8rem', color: '#1976d2' }} />
                </IconButton>
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
                    ) : plants.length > 0 ? (
                        plants.map((plant, index) => (
                            <Box key={plant.id || index} sx={{ mb: 0.5 }}>
                                <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                    ✓ {plant.name}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                Không có plant
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>
            
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <PlantFrom handleClose={handleClose} />
            </Dialog>
        </Box>
    );
}

export default Plant;
