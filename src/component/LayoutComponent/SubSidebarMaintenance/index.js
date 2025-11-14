import React, { useState } from 'react';
import {
    Box,
    Typography,
    List,
    TextField,
    InputAdornment,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    FormControlLabel,
    Checkbox,
    Chip
} from '@mui/material';
import {
    Search,
    ExpandMore,
    FilterList
} from '@mui/icons-material';

function SubSidebarMaintenance() {
    const [openSections, setOpenSections] = useState({
        status: true,
        priority: false,
        type: false,
        technician: false
    });

    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({
        status: [],
        priority: [],
        type: [],
        technician: []
    });

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const handleFilterChange = (category, value) => {
        setFilters(prev => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter(item => item !== value)
                : [...prev[category], value]
        }));
    };

    const statusOptions = [
        { value: 'pending', label: 'Chờ xử lý', color: 'warning' },
        { value: 'in_progress', label: 'Đang thực hiện', color: 'info' },
        { value: 'completed', label: 'Hoàn thành', color: 'success' },
        { value: 'cancelled', label: 'Đã hủy', color: 'error' }
    ];

    const priorityOptions = [
        { value: 'low', label: 'Thấp', color: 'success' },
        { value: 'medium', label: 'Trung bình', color: 'warning' },
        { value: 'high', label: 'Cao', color: 'error' },
        { value: 'critical', label: 'Khẩn cấp', color: 'error' }
    ];

    const typeOptions = [
        { value: 'preventive', label: 'Bảo trì phòng ngừa' },
        { value: 'corrective', label: 'Bảo trì sửa chữa' }
    ];

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
                <Typography variant="h6" sx={{ fontSize: '1.4rem', fontWeight: 'bold', mb: 2 }}>
                    BỘ LỌC BẢO TRÌ
                </Typography>

                {/* Search */}
                <TextField
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm bảo trì..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ mb: 2 }}
                />
            </Box>

            {/* Filters */}
            <Box sx={{ flex: 1, overflow: 'auto', p: 1 }}>
                {/* Status Filter */}
                <Accordion
                    expanded={openSections.status}
                    onChange={() => toggleSection('status')}
                    sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Trạng thái
                        </Typography>
                        {filters.status.length > 0 && (
                            <Chip
                                label={filters.status.length}
                                size="small"
                                color="primary"
                                sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                            />
                        )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1 }}>
                        {statusOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={filters.status.includes(option.value)}
                                        onChange={() => handleFilterChange('status', option.value)}
                                    />
                                }
                                label={
                                    <Chip
                                        label={option.label}
                                        size="small"
                                        color={option.color}
                                        variant="outlined"
                                        sx={{ fontSize: '0.8rem' }}
                                    />
                                }
                                sx={{ width: '100%', mb: 0.5 }}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>

                {/* Priority Filter */}
                <Accordion
                    expanded={openSections.priority}
                    onChange={() => toggleSection('priority')}
                    sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Ưu tiên
                        </Typography>
                        {filters.priority.length > 0 && (
                            <Chip
                                label={filters.priority.length}
                                size="small"
                                color="primary"
                                sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                            />
                        )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1 }}>
                        {priorityOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={filters.priority.includes(option.value)}
                                        onChange={() => handleFilterChange('priority', option.value)}
                                    />
                                }
                                label={
                                    <Chip
                                        label={option.label}
                                        size="small"
                                        color={option.color}
                                        variant="outlined"
                                        sx={{ fontSize: '0.8rem' }}
                                    />
                                }
                                sx={{ width: '100%', mb: 0.5 }}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>

                {/* Type Filter */}
                <Accordion
                    expanded={openSections.type}
                    onChange={() => toggleSection('type')}
                    sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Loại bảo trì
                        </Typography>
                        {filters.type.length > 0 && (
                            <Chip
                                label={filters.type.length}
                                size="small"
                                color="primary"
                                sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                            />
                        )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1 }}>
                        {typeOptions.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                control={
                                    <Checkbox
                                        size="small"
                                        checked={filters.type.includes(option.value)}
                                        onChange={() => handleFilterChange('type', option.value)}
                                    />
                                }
                                label={
                                    <Typography variant="body2" sx={{ fontSize: '0.9rem' }}>
                                        {option.label}
                                    </Typography>
                                }
                                sx={{ width: '100%', mb: 0.5 }}
                            />
                        ))}
                    </AccordionDetails>
                </Accordion>

                {/* Technician Filter */}
                <Accordion
                    expanded={openSections.technician}
                    onChange={() => toggleSection('technician')}
                    sx={{ mb: 1, boxShadow: 'none', border: '1px solid #e0e0e0' }}
                >
                    <AccordionSummary expandIcon={<ExpandMore />}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                            Kỹ thuật viên
                        </Typography>
                        {filters.technician.length > 0 && (
                            <Chip
                                label={filters.technician.length}
                                size="small"
                                color="primary"
                                sx={{ ml: 1, height: 18, fontSize: '0.7rem' }}
                            />
                        )}
                    </AccordionSummary>
                    <AccordionDetails sx={{ p: 1 }}>
                        <Typography variant="body2" color="textSecondary" sx={{ fontSize: '0.8rem' }}>
                            Chức năng lọc theo kỹ thuật viên sẽ được cập nhật sau
                        </Typography>
                    </AccordionDetails>
                </Accordion>
            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: '1px solid #e0e0e0', backgroundColor: '#fff' }}>
                <Typography variant="caption" color="textSecondary">
                    Tổng số bộ lọc: {Object.values(filters).flat().length}
                </Typography>
            </Box>
        </Box>
    );
}

export default SubSidebarMaintenance;