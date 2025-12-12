// Common styling constants for forms and inputs

export const formSpacing = {
    small: 1.5,
    medium: 2,
    large: 3,
};

export const inputSizes = {
    labelFontSize: '1.3rem',
    inputFontSize: '1.3rem',
    placeholderFontSize: '1.2rem',
    helperFontSize: '1.1rem',
};

export const buttonSizes = {
    small: {
        fontSize: '1.2rem',
        padding: '8px 16px',
    },
    medium: {
        fontSize: '1.3rem',
        padding: '10px 20px',
    },
    large: {
        fontSize: '1.4rem',
        padding: '12px 24px',
    },
};

export const formLayoutStyles = {
    dialogPadding: '24px',
    sectionSpacing: '20px',
    fieldSpacing: '16px',
};

export const commonInputStyles = {
    '& .MuiOutlinedInput-root': {
        fontSize: '1.3rem',
        '& fieldset': {
            borderColor: '#ddd',
        },
        '&:hover fieldset': {
            borderColor: '#1976d2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#1976d2',
        },
    },
    '& .MuiInputBase-input': {
        fontSize: '1.2rem',
        padding: '12px 14px',
    },
    '& .MuiInputLabel-root': {
        fontSize: '1.2rem',
    },
    '& .MuiFormHelperText-root': {
        fontSize: '1.2rem',
    },
};
