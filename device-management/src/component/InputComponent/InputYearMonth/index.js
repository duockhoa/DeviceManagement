import React from 'react';
import { Box, Typography } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

function InputYearMonth({
    label,
    name,
    value,
    onChange,
    placeholder = 'Chọn tháng/năm',
    required = false,
    disabled = false,
    error = false,
    helperText = '',
    minLabelWidth = '40px',
    width = 'full',
    ...otherProps
}) {
    const fieldWidth = width === 'full' ? { width: '100%' } : { width: width };

    const handleDateChange = (newValue) => {
        const syntheticEvent = {
            target: {
                name: name,
                value: newValue ? newValue.format('YYYY-MM') : ''
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
                pt: 1.5
            }}>
                {label}{required && <span style={{ color: '#f44336' }}> *</span>}:
            </Typography>
            
            <Box sx={fieldWidth}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                        value={value ? dayjs(value) : null}
                        onChange={handleDateChange}
                        views={['year', 'month']}
                        format="MM/YYYY"
                        disabled={disabled}
                        slotProps={{
                            textField: {
                                placeholder: placeholder,
                                size: 'small',
                                error: error,
                                helperText: helperText,
                                fullWidth: width === 'full',
                                sx: {
                                    '& .MuiOutlinedInput-root': {
                                        fontSize: '1.2rem',
                                        backgroundColor: disabled ? '#f5f5f5' : '#fff',
                                    }
                                }
                            }
                        }}
                        {...otherProps}
                    />
                </LocalizationProvider>
            </Box>
        </Box>
    );
}

export default InputYearMonth;