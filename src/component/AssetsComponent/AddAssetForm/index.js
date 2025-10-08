import Box from '@mui/material/Box';
import { Typography, IconButton, Divider, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { Stack } from '@mui/system';
import { useSelector } from 'react-redux';

function AddAssetForm({ handleClose }) {
    const assetCategories = useSelector((state) => state.assetCategories.categories);
    const plant = useSelector((state) => state.plants.plants);
    
    console.log('Asset Categories:', assetCategories);
    console.log('Plants:', plant);

    const handleSave = () => {
        // Logic lưu form
        console.log('Saving form...');
    };

    const handleReset = () => {
        // Logic reset form
        console.log('Resetting form...');
    };

    return (
        <Box sx={{ width: "100%", height: "90vh"  , display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                p: 2,
                backgroundColor: '#f5f5f5'
            }}>
                <Typography variant="h5" sx={{ 
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    color: '#333'
                }}>
                    Nhập thông tin thiết bị
                </Typography>
                
                <IconButton onClick={handleClose} sx={{ color: '#666' }}>
                    <CloseIcon />
                </IconButton>
            </Box>
            
            <Divider />
            
            {/* Form Content */}
            <Stack p={2} sx={{  display: 'flex', flexDirection: 'column' , flexGrow: 1 }}>
                {/* Nhập thông tin chung */}
                <Box sx={{ border : '1px solid #ddd', p: 2 }}>
                    {/* Các trường nhập liệu cho thông tin chung */}
                    Thông tin chung
                </Box>
                {/* Thông tin chi tiết */}
                <Box sx={{ mt: 2, border : '1px solid #ddd', p: 2, flex: 1 }}>
                    Tab các thông tin chi tiết
                    {/* Các trường nhập liệu cho thông tin chi tiết */}
                </Box>
            </Stack>
            
            {/* Action Buttons */}
            <Box sx={{ 
                p: 2, 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: 2,
                borderTop: '1px solid #e0e0e0',
                backgroundColor: '#fafafa'
            }}>
                <Button
                    variant="outlined"
                    onClick={handleReset}
                    startIcon={<CancelIcon />}
                    sx={{ 
                        fontSize: '1.3rem', 
                        minWidth: 120,
                        color: '#666',
                        borderColor: '#666'
                    }}
                >
                    Làm mới
                </Button>
                <Button
                    variant="outlined"
                    onClick={handleClose}
                    sx={{ 
                        fontSize: '1.3rem', 
                        minWidth: 120,
                        color: '#f44336',
                        borderColor: '#f44336',
                        '&:hover': {
                            backgroundColor: '#ffebee',
                            borderColor: '#f44336'
                        }
                    }}
                >
                    Hủy
                </Button>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    startIcon={<SaveIcon />}
                    sx={{ 
                        fontSize: '1.3rem', 
                        minWidth: 120,
                        backgroundColor: '#1976d2',
                        '&:hover': {
                            backgroundColor: '#1565c0'
                        }
                    }}
                >
                    Lưu
                </Button>
            </Box>
        </Box>
    );
}

export default AddAssetForm;