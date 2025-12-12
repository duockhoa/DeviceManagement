// Shared DataGrid styling configuration
export const commonDataGridStyles = {
    border: 'none',
    '& .MuiDataGrid-root': {
        fontSize: '1.3rem',
    },
    '& .MuiDataGrid-cell': {
        fontSize: '1.3rem',
        padding: '12px 16px',
        borderBottom: '1px solid #f0f0f0',
    },
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: '#fafafa',
        borderBottom: '2px solid #e0e0e0',
        fontSize: '1.4rem',
        fontWeight: 600,
        minHeight: '56px !important',
        maxHeight: '56px !important',
    },
    '& .MuiDataGrid-columnHeader': {
        fontSize: '1.4rem',
        fontWeight: 600,
        padding: '12px 16px',
        '&:focus': {
            outline: 'none',
        },
        '&:focus-within': {
            outline: 'none',
        },
    },
    '& .MuiDataGrid-columnHeaderTitle': {
        fontSize: '1.4rem',
        fontWeight: 600,
    },
    '& .MuiDataGrid-row': {
        '&:hover': {
            backgroundColor: '#f8f9fa',
        },
        '&.Mui-selected': {
            backgroundColor: '#e3f2fd',
            '&:hover': {
                backgroundColor: '#bbdefb',
            },
        },
    },
    '& .MuiDataGrid-footerContainer': {
        borderTop: '2px solid #e0e0e0',
        minHeight: '52px',
    },
    '& .MuiTablePagination-root': {
        fontSize: '1.3rem',
    },
    '& .MuiTablePagination-select': {
        fontSize: '1.3rem',
    },
    '& .MuiTablePagination-displayedRows': {
        fontSize: '1.3rem',
    },
};

export const getDataGridSxProps = (customStyles = {}) => ({
    ...commonDataGridStyles,
    ...customStyles,
});
