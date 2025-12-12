import React, { useState } from 'react';
import { 
    Box, 
    Typography, 
    Autocomplete, 
    TextField, 
    MenuItem, 
    Divider,
    FormHelperText 
} from '@mui/material';
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
    // Props cho search
    searchable = true,
    noOptionsText = 'Không có lựa chọn nào',
    filterOptions,
    ...otherProps
}) {
    const [inputValue, setInputValue] = useState('');

    const getFieldWidth = () => {
        switch (width) {
            case 'full':
                return { width: '100%' };
            case 'auto':
                return { width: 'auto' };
            default:
                return { width: width };
        }
    };

    const fieldWidth = getFieldWidth();

    // Tìm option hiện tại dựa trên value
    const selectedOption = options.find(option => option[valueKey] === value) || null;

    // Handle thay đổi giá trị
    const handleChange = (event, newValue) => {
        // Nếu chọn option "Thêm mới"
        if (newValue && newValue.isAddNew) {
            if (onAddNew && typeof onAddNew === 'function') {
                onAddNew();
            }
            return; // Không thay đổi value
        }

        if (newValue) {
            onChange(name, newValue[valueKey]);
        } else {
            onChange(name, '');
        }
    };

    // Custom render options để thêm "Thêm mới"
    const renderOption = (props, option) => {
        // Option "Thêm mới"
        if (option.isAddNew) {
            return (
                <Box key="add-new">
                    <Divider sx={{ my: 0.5 }} />
                    <MenuItem
                        {...props}
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
                </Box>
            );
        }

        // Option bình thường
        return (
            <MenuItem 
                {...props} 
                key={option[valueKey]}
                sx={{ fontSize: '1.3rem', py: 1.5 }}
            >
                {option[labelKey]}
            </MenuItem>
        );
    };

    // Custom filter để loại bỏ "Thêm mới" khỏi kết quả tìm kiếm
    const customFilterOptions = (options, { inputValue }) => {
        // Filter các option bình thường
        const filtered = options.filter(option => {
            if (option.isAddNew) return false; // Không filter option "Thêm mới"
            return option[labelKey].toLowerCase().includes(inputValue.toLowerCase());
        });

        // Luôn thêm option "Thêm mới" vào cuối nếu có
        const addNewOption = options.find(opt => opt.isAddNew);
        if (addNewOption) {
            filtered.push(addNewOption);
        }

        return filtered;
    };

    // Thêm option "Thêm mới" vào cuối danh sách nếu cần
    const optionsWithAddNew = showAddNew && onAddNew ? 
        [...options, { isAddNew: true, [valueKey]: 'add-new', [labelKey]: addNewText }] : 
        options;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="body2" sx={{
                fontSize: '1.3rem',
                fontWeight: 'medium',
                color: '#333',
                whiteSpace: 'nowrap',
                mb: 0.5
            }}>
                {label}{required && <span style={{ color: '#f44336' }}> *</span>}:
            </Typography>
            
            <Box sx={{ ...fieldWidth, position: 'relative' }}>
                <Autocomplete
                    value={selectedOption}
                    onChange={handleChange}
                    inputValue={inputValue}
                    onInputChange={(event, newInputValue) => {
                        setInputValue(newInputValue);
                    }}
                    options={optionsWithAddNew}
                    getOptionLabel={(option) => option ? option[labelKey] || '' : ''}
                    renderOption={renderOption}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            name={name}
                            placeholder={placeholder}
                            size="small"
                            error={error}
                            disabled={disabled}
                            sx={{
                                '& .MuiOutlinedInput-root': {
                                    fontSize: '1.3rem',
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
                                    fontSize: '1.3rem',
                                    padding: '12px 14px',
                                }
                            }}
                        />
                    )}
                    noOptionsText={noOptionsText}
                    disabled={disabled}
                    disableClearable={required}
                    filterOptions={filterOptions || customFilterOptions} // Sử dụng custom filter
                    isOptionEqualToValue={(option, value) => {
                        if (!option || !value) return false;
                        return option[valueKey] === value[valueKey];
                    }}
                    // BỎ getOptionDisabled - đây là nguyên nhân gây disable
                    // getOptionDisabled={(option) => option.isAddNew}
                    sx={{
                        '& .MuiAutocomplete-listbox': {
                            fontSize: '1.2rem',
                            maxHeight: '200px'
                        },
                        '& .MuiAutocomplete-option': {
                            fontSize: '1.2rem',
                            minHeight: '40px'
                        },
                        '& .MuiAutocomplete-noOptions': {
                            fontSize: '1.2rem'
                        }
                    }}
                    {...otherProps}
                />
                
                {helperText && (
                    <FormHelperText 
                        error={error}
                        sx={{ 
                            fontSize: '1rem',
                            mt: 0.5,
                            ml: 0
                        }}
                    >
                        {helperText}
                    </FormHelperText>
                )}
            </Box>
        </Box>
    );
}

export default SelectField;