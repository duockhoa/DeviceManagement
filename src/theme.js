import { createTheme } from '@mui/material/styles';

// A custom theme for this app
const theme = createTheme({
    cssVariables: true,
    palette: {},
    typography: {
        fontSize: 14,
        htmlFontSize: 12, // Vì html root = 75% = 12px
        fontFamily: '"IBM Plex Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        body1: {
            fontSize: '1.4rem', // 16.8px
        },
        body2: {
            fontSize: '1.3rem', // 15.6px
        },
        caption: {
            fontSize: '1.2rem', // 14.4px
        },
        button: {
            fontSize: '1.3rem', // 15.6px
            fontWeight: 500,
            textTransform: 'none',
        },
        h6: {
            fontSize: '1.6rem', // 19.2px
            fontWeight: 600,
        },
        h5: {
            fontSize: '1.8rem', // 21.6px
            fontWeight: 600,
        },
        subtitle1: {
            fontSize: '1.3rem', // 15.6px
        },
        subtitle2: {
            fontSize: '1.2rem', // 14.4px
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
                        fontSize: '1.3rem', // 15.6px
                        padding: '12px 14px',
                    },
                    '& .MuiInputLabel-root': {
                        fontSize: '1.3rem',
                    },
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    fontSize: '1.3rem', // 15.6px
                    padding: '10px 20px',
                    borderRadius: '6px',
                },
                sizeSmall: {
                    fontSize: '1.2rem',
                    padding: '8px 16px',
                },
                sizeLarge: {
                    fontSize: '1.4rem',
                    padding: '12px 24px',
                },
            },
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    minHeight: 52,
                    padding: '12px 20px',
                },
            },
        },
        MuiTableCell: {
            styleOverrides: {
                root: {
                    fontSize: '1.3rem', // 15.6px
                    padding: '14px 16px',
                },
                head: {
                    fontSize: '1.4rem', // 16.8px
                    fontWeight: 600,
                    backgroundColor: '#f5f5f5',
                },
            },
        },
        MuiChip: {
            styleOverrides: {
                root: {
                    fontSize: '1.2rem', // 14.4px
                    height: '30px',
                    borderRadius: '6px',
                },
                sizeSmall: {
                    fontSize: '1.1rem',
                    height: '26px',
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    fontSize: '1.3rem', // 15.6px
                    border: 'none',
                    '& .MuiDataGrid-cell': {
                        fontSize: '1.3rem',
                        padding: '12px 16px',
                    },
                    '& .MuiDataGrid-columnHeader': {
                        fontSize: '1.4rem',
                        fontWeight: 600,
                        backgroundColor: '#fafafa',
                    },
                    '& .MuiDataGrid-columnHeaderTitle': {
                        fontWeight: 600,
                    },
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

