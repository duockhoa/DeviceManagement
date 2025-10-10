import React from 'react';
import { Box, Typography, FormControl, Select, MenuItem, FormHelperText } from '@mui/material';

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

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{
                fontSize: '1.2rem',
                fontWeight: 'medium',
                color: '#333',
                minWidth: '60px',
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
                            padding: '12px 14px',
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