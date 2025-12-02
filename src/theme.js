import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    cssVariables: true,
    palette: {},
    typography: {
        fontSize: 15, // Tăng base từ 14 lên 15
        htmlFontSize: 16,
        body1: {
            fontSize: '1.05rem', // 16.8px
        },
        body2: {
            fontSize: '1rem', // 16px (trước đây 0.875rem = 14px)
        },
        caption: {
            fontSize: '0.9rem', // 14.4px (trước đây 0.75rem = 12px)
        },
        button: {
            fontSize: '1rem', // Tăng cỡ chữ button
            fontWeight: 500,
        },
        h6: {
            fontSize: '1.25rem', // 20px
            fontWeight: 600,
        },
        subtitle1: {
            fontSize: '1.05rem',
        },
        subtitle2: {
            fontSize: '1rem',
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                size: 'medium',
            },
            styleOverrides: {
                root: {
                    '& .MuiInputBase-input': {
                        fontSize: '1rem', // Tăng lên 16px
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '1rem',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '1rem',
                    padding: '8px 18px',
                },
                sizeSmall: {
                    fontSize: '0.9rem',
                    padding: '6px 14px',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '1rem', // Tăng lên rõ ràng
                    fontWeight: 600,
                    minHeight: 48,
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '1rem', // Tăng lên 16px
                    padding: '12px 16px',
                },
                head: {
                    fontSize: '1rem',
                    fontWeight: 600,
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: '0.9rem',
                    height: '28px',
                },
                sizeSmall: {
                    fontSize: '0.85rem',
                    height: '24px',
                },
            },
        },
        MuiTypography: {
            defaultProps: {
                variantMapping: {
                    body1: 'p',
                    body2: 'p',
                },
            },
        },
    },
});

export default theme;

