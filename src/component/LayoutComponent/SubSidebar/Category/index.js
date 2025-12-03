import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AssetCategoryForm from '../../../CategoriesComponent/AssetCategoryForm';
import {
    Box,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Collapse,
    Typography,
    IconButton,
    Dialog
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    Category as CategoryIcon,
    Add
} from '@mui/icons-material';
import { fetchAssetCategories } from '../../../../redux/slice/assetCategoriesSlice';

function Categories({ isOpen, onToggle }) {
    const dispatch = useDispatch();
    const [open, setOpen] = React.useState(false);
    
    // Lấy dữ liệu từ Redux store
    const { categories, loading, error } = useSelector(state => state.assetCategories);

    // Fetch asset categories khi component mount
    useEffect(() => {
        dispatch(fetchAssetCategories());
    }, [dispatch]);

    // Handle click nút Add
    const handleAddClick = (event) => {
        event.stopPropagation(); // Ngăn không cho trigger onToggle
        setOpen(true);
    };
    
    const handleClose = () => {
        setOpen(false);
        dispatch(fetchAssetCategories()); // Refresh list after adding
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
                    <CategoryIcon sx={{ fontSize: '1.8rem', color: '#1976d2' }} />
                </ListItemIcon>
                <ListItemText 
                    primary="Loại thiết bị" 
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
                    ) : categories.length > 0 ? (
                        categories.map((category, index) => (
                            <Box key={category.id || index} sx={{ mb: 0.5 }}>
                                <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                    ✓ {category.name}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Box sx={{ mb: 0.5 }}>
                            <Typography sx={{ fontSize: '1.4rem', color: '#666' }}>
                                Không có loại thiết bị
                            </Typography>
                        </Box>
                    )}
                </Box>
            </Collapse>
            
            <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
                <AssetCategoryForm handleClose={handleClose} />
            </Dialog>
        </Box>
    );
}

export default Categories;