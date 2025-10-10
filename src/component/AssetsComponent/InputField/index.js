import React from 'react';
import { Box, Typography, TextField } from '@mui/material';

function InputField({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    type = 'text',
    multiline = false,
    rows = 1,
    disabled = false,
    error = false,
    helperText = '',
    width = 'full', // 'full', 'auto', hoặc số cụ thể như '200px', '50%'
    ...otherProps
}) {
    const getTextFieldWidth = () => {
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

    const textFieldProps = getTextFieldWidth();

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="body2" sx={{
                fontSize: '1.2rem',
                fontWeight: 'medium',
                color: '#333',
                minWidth: '40px',
                whiteSpace: 'nowrap'
            }}>
                {label}{required && <span style={{ color: '#f44336' }}> *</span>}:
            </Typography>
            <TextField
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                variant="outlined"
                size="medium"
                type={type}
                multiline={multiline}
                rows={multiline ? rows : undefined}
                disabled={disabled}
                error={error}
                helperText={helperText}
                {...textFieldProps}
                sx={{
                    '& .MuiOutlinedInput-root': {
                        fontSize: '1.2rem',
                        backgroundColor: disabled ? '#f5f5f5' : '#fff',
                        '& fieldset': {
                            borderColor: error ? '#f44336' : '#ddd',
                        },
                        '&:hover fieldset': {
                            borderColor: error ? '#f44336' : '#1976d2',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: error ? '#f44336' : '#1976d2',
                        }
                    },
                    '& .MuiOutlinedInput-input': {
                        padding: '12px 14px',
                    },
                    ...textFieldProps.sx
                }}
                {...otherProps}
            />
        </Box>
    );
}

export default InputField;