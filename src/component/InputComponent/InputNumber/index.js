import React from 'react';
import { Box, Typography, TextField, InputAdornment } from '@mui/material';

function InputNumber({
    label,
    name,
    value,
    onChange,
    placeholder = '',
    required = false,
    disabled = false,
    error = false,
    helperText = '',
    minLabelWidth = '40px',
    width = 'full',
    // Number specific props
    min = null,
    max = null,
    step = 1,
    decimals = 0, // Số chữ số thập phân
    allowNegative = true,
    thousandSeparator = false, // Hiển thị dấu phẩy ngăn cách hàng nghìn
    prefix = '', // Tiền tố như "₫", "$"
    suffix = '', // Hậu tố như "kg", "m"
    unit = '', // Đơn vị hiển thị
    // Format options
    formatOnBlur = true, // Format khi blur
    selectAllOnFocus = false, // Select all khi focus
    ...otherProps
}) {
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

    // Format số với dấu phẩy ngăn cách
    const formatNumber = (num) => {
        if (!num && num !== 0) return '';
        
        const number = parseFloat(num);
        if (isNaN(number)) return '';

        // Format với số chữ số thập phân
        const formatted = number.toFixed(decimals);
        
        // Thêm dấu phẩy ngăn cách hàng nghìn nếu cần
        if (thousandSeparator) {
            return formatted.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        }
        
        return formatted;
    };

    // Parse số từ string đã format
    const parseNumber = (str) => {
        if (!str) return '';
        // Loại bỏ dấu phẩy và các ký tự không phải số
        const cleaned = str.replace(/[^0-9.-]/g, '');
        return cleaned;
    };

    // Validate giá trị
    const validateValue = (val) => {
        if (!val && val !== 0) return true;
        
        const num = parseFloat(val);
        if (isNaN(num)) return false;
        
        // Kiểm tra min/max
        if (min !== null && num < min) return false;
        if (max !== null && num > max) return false;
        
        // Kiểm tra số âm
        if (!allowNegative && num < 0) return false;
        
        return true;
    };

    // Handle thay đổi giá trị
    const handleChange = (e) => {
        let inputValue = e.target.value;
        
        // Loại bỏ prefix/suffix
        if (prefix) inputValue = inputValue.replace(prefix, '');
        if (suffix) inputValue = inputValue.replace(suffix, '');
        
        // Parse số
        const parsedValue = parseNumber(inputValue);
        
        // Validate
        if (parsedValue && !validateValue(parsedValue)) {
            return; // Không update nếu không hợp lệ
        }
        
        // Tạo event mới
        onChange(name, parsedValue);
    };

    // Handle blur để format
    const handleBlur = (e) => {
        if (formatOnBlur && value) {
            const formatted = formatNumber(value);
            onChange(name, parseNumber(formatted));
        }
        
        if (otherProps.onBlur) {
            otherProps.onBlur(e);
        }
    };

    // Handle focus
    const handleFocus = (e) => {
        if (selectAllOnFocus) {
            e.target.select();
        }
        
        if (otherProps.onFocus) {
            otherProps.onFocus(e);
        }
    };

    // Tạo display value
    const getDisplayValue = () => {
        if (!value && value !== 0) return '';
        
        let displayVal = value.toString();
        
        // Format số nếu cần
        if (thousandSeparator && !error) {
            displayVal = formatNumber(value);
        }
        
        return displayVal;
    };

    // Tạo input props
    const inputProps = {
        min: min,
        max: max,
        step: step,
        ...otherProps.inputProps
    };

    // Tạo start/end adornment
    const startAdornment = prefix ? (
        <InputAdornment position="start">
            <Typography sx={{ fontSize: '1.2rem', color: '#666' }}>
                {prefix}
            </Typography>
        </InputAdornment>
    ) : null;

    const endAdornment = (suffix || unit) ? (
        <InputAdornment position="end">
            <Typography sx={{ fontSize: '1.2rem', color: '#666' }}>
                {suffix || unit}
            </Typography>
        </InputAdornment>
    ) : null;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{
                fontSize: '1.2rem',
                fontWeight: 'medium',
                color: '#333',
                whiteSpace: 'nowrap'
            }}>
                {label}{required && <span style={{ color: '#f44336' }}> *</span>}:
            </Typography>
            
            <Box sx={{ position: 'relative' }}>
                <TextField
                    name={name}
                    value={getDisplayValue()}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onFocus={handleFocus}
                    placeholder={placeholder}
                    variant="outlined"
                    size="small"
                    type="text" // Dùng text để có thể format
                    disabled={disabled}
                    error={error}
                    helperText={helperText}
                    fullWidth={width === 'full'}
                    inputProps={inputProps}
                    InputProps={{
                        startAdornment: startAdornment,
                        endAdornment: endAdornment,
                    }}
            

                    sx={{
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
                            textAlign: thousandSeparator ? 'right' : 'left', // Số thường align right
                        },
                        ...fieldWidth.sx
                    }}
                    {...otherProps}
                />
            </Box>
        </Box>
    );
}

export default InputNumber;