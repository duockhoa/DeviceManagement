import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, FormHelperText, Divider } from '@mui/material';
import { Add } from '@mui/icons-material';

function SelectField({
    label,
    name,
    value,
    onChange,
    options = [],
    required = false,
    disabled = false,
    error = false,
    helperText = '',
    width = 'full',
    placeholder = 'Chọn...',
    valueKey = 'id',
    labelKey = 'name',
    minLabelWidth = '60px',
    // Props mới cho "Thêm mới"
    showAddNew = false,
    addNewText = 'Thêm mới',
    onAddNew,
    ...otherProps
}) {
    const getSelectWidth = () => {
        switch (width) {
            case 'full':
                return { fullWidth: true };
            case 'auto':
                return { fullWidth: false };
            default:
                return {
                    fullWidth: false,
                    sx: {
                        width: width,
                        ...otherProps.sx
                    }
                };
        }
    };

    const selectProps = getSelectWidth();

    const handleAddNewClick = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (onAddNew && typeof onAddNew === 'function') {
            onAddNew();
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{
                fontSize: '1.2rem',
                fontWeight: 'medium',
                color: '#333',
                minWidth: minLabelWidth,
                whiteSpace: 'nowrap'
            }}>
                {label}{required && <span style={{ color: '#f44336' }}> *</span>}:
            </Typography>
            <FormControl error={error} {...selectProps}>
                <Select
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    displayEmpty
                    size='small'
                    sx={{
                        fontSize: '1.2rem',
                        backgroundColor: disabled ? '#f5f5f5' : '#fff',
                        '& .MuiOutlinedInput-notchedOutline': {
                            borderColor: error ? '#f44336' : '#ddd',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: error ? '#f44336' : '#1976d2',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: error ? '#f44336' : '#1976d2',
                        },
                        '& .MuiSelect-select': {
                            padding: '10px 14px',
                        },
                        ...selectProps.sx
                    }}
                    {...otherProps}
                >
                    <MenuItem key="empty" value="" sx={{ fontSize: '1.2rem', color: '#999' }}>
                        {placeholder}
                    </MenuItem>
                    
                    {Array.isArray(options) && options.map((option, index) => (
                        <MenuItem
                            key={option[valueKey] || `option-${index}`}
                            value={option[valueKey]}
                            sx={{ fontSize: '1.2rem' }}
                        >
                            {option[labelKey]}
                        </MenuItem>
                    ))}
                    
                    {/* Option "Thêm mới" */}
                    {showAddNew && onAddNew && (
                        <>
                            <Divider sx={{ my: 0.5 }} />
                            <MenuItem
                                key="add-new"
                                onClick={handleAddNewClick}
                                sx={{
                                    fontSize: '1.2rem',
                                    color: '#1976d2',
                                    fontWeight: 'medium',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    '&:hover': {
                                        backgroundColor: '#e3f2fd',
                                    }
                                }}
                            >
                                <Add sx={{ fontSize: '1.6rem' }} />
                                {addNewText}
                            </MenuItem>
                        </>
                    )}
                </Select>
                {helperText && (
                    <FormHelperText sx={{ fontSize: '1.2rem' }}>
                        {helperText}
                    </FormHelperText>
                )}
            </FormControl>
        </Box>
    );
}

export default SelectField;