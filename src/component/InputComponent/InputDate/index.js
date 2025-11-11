import React, { forwardRef } from 'react';
import { Box, Typography, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import 'dayjs/locale/vi';

// Set Vietnamese locale
dayjs.locale('vi');

const InputDate = forwardRef(({
    label,
    name,
    value,
    onChange,
    placeholder = 'Chọn ngày',
    required = false,
    disabled = false,
    error = false,
    helperText = '',
    minLabelWidth = '40px',
    width = 'full',
    minDate = null,
    maxDate = null,
    disablePast = false,
    disableFuture = false,
    format = 'DD/MM/YYYY',
    views = ['year', 'month', 'day'],
    ...otherProps
}, ref) => {
    const getFieldWidth = () => {
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

    const fieldWidth = getFieldWidth();

    // Chuyển đổi value string thành dayjs object
    const dateValue = value ? dayjs(value) : null;

    // Handle thay đổi ngày
    const handleDateChange = (newValue) => {
        // Tạo event giả để tương thích với onChange hiện tại
        const syntheticEvent = {
            target: {
                name: name,
                value: newValue ? newValue.format('YYYY-MM-DD') : ''
            }
        };
        onChange(syntheticEvent);
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
            <Typography variant="body2" sx={{
                fontSize: '1.2rem',
                fontWeight: 'medium',
                color: '#333',
                minWidth: minLabelWidth,
                whiteSpace: 'nowrap',
                pt: 1.5 // Align với DatePicker
            }}>
                {label}{required && <span style={{ color: '#f44336' }}> *</span>}:
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={dateValue}
                        onChange={handleDateChange}
                        format={format}
                        views={views}
                        disabled={disabled}
                        minDate={minDate ? dayjs(minDate) : undefined}
                        maxDate={maxDate ? dayjs(maxDate) : undefined}
                        disablePast={disablePast}
                        disableFuture={disableFuture}
                        slotProps={{
                            textField: {
                                name: name,
                                placeholder: placeholder,
                                size: 'small',
                                error: error,
                                helperText: helperText,
                                disabled: disabled,
                                fullWidth: width === 'full',
                                sx: {
                                    '& .MuiOutlinedInput-root': {
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
                                    },
                                    '& .MuiInputBase-input': {
                                        fontSize: '1.2rem',
                                        padding: '10px 14px',
                                    },
                                    ...fieldWidth.sx
                                }
                            },
                            actionBar: {
                                actions: ['clear', 'today']
                            }
                        }}
                        {...otherProps}
                    />
                </LocalizationProvider>
            </Box>
        </Box>
    );
});

InputDate.displayName = 'InputDate';

export default InputDate;