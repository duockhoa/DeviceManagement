import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    TextField,
    InputAdornment
} from '@mui/material';
import {
    Search
} from '@mui/icons-material';
import Plant from './Plant';
import Department from './Department';
import Categories from './Category';
import Location from './Location';

function SubSidebar() {
    const [openSections, setOpenSections] = useState({
        plant: true,
        location: true,
        category: true,
        department: true
    });

    const [searchTerm, setSearchTerm] = useState('');

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    return (
        <Box
            sx={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f9fa',
                borderRight: '1px solid #e0e0e0',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {/* Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
                <Typography variant="h6" sx={{ fontSize: '1.4rem', fontWeight: 'bold', mb: 1 }}>
                    Tài sản  Tài sản
                </Typography>
                
                {/* Search */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search sx={{ fontSize: '1.8rem', color: '#666' }} />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            fontSize: '1.3rem',
                        }
                    }}
                />
            </Box>

            {/* Filter Sections */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
                <List sx={{ p: 0 }}>
                    {/* Plant Section */}
                    <Plant 
                        isOpen={openSections.plant}
                        onToggle={() => toggleSection('plant')}
                    />

                    {/* Location Section */}
                    <Location 
                        isOpen={openSections.location}
                        onToggle={() => toggleSection('location')}
                    />

                    {/* Categories Section */}
                    <Categories 
                        isOpen={openSections.category}
                        onToggle={() => toggleSection('category')}
                    />

                    {/* Department Section */}
                    <Department 
                        isOpen={openSections.department}
                        onToggle={() => toggleSection('department')}
                    />
                </List>
            </Box>
        </Box>
    );
}

export default SubSidebar;