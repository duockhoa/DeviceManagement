import * as React from 'react';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function InputTable({ rows, columns, showRowNumber = true  }) {
  const [cellModesModel, setCellModesModel] = React.useState({});

  // Tạo cột số thứ tự
  const rowNumberColumn = {
    field: '__rowNumber',
    headerName: 'STT',
    width: 60,
    editable: false,
    sortable: false,
    filterable: false,
    disableColumnMenu: true,
    headerAlign: 'center',
    align: 'center',
    renderHeader: () => (
      <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        STT
      </Box>
    ),
    renderCell: (params) => (
      <Box sx={{ 
        fontWeight: 'bold', 
        fontSize: '1.2rem',
        color: '#666'
      }}>
        {params.api.getRowIndexRelativeToVisibleRows(params.id) + 1}
      </Box>
    ),
  };

  // Kết hợp cột STT với các cột khác
  const finalColumns = React.useMemo(() => {
    if (showRowNumber) {
      return [rowNumberColumn, ...columns];
    }
    return columns;
  }, [columns, showRowNumber]);

  const handleCellClick = React.useCallback((params, event) => {
    // Không cho phép edit cột STT
    if (params.field === '__rowNumber' || !params.isEditable) {
      return;
    }

    // Ignore portal
    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => {
      return {
        // Revert the mode of the other cells from other rows
        ...Object.keys(prevModel).reduce(
          (acc, id) => ({
            ...acc,
            [id]: Object.keys(prevModel[id]).reduce(
              (acc2, field) => ({
                ...acc2,
                [field]: { mode: GridCellModes.View },
              }),
              {},
            ),
          }),
          {},
        ),
        [params.id]: {
          // Revert the mode of other cells in the same row
          ...Object.keys(prevModel[params.id] || {}).reduce(
            (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
            {},
          ),
          [params.field]: { mode: GridCellModes.Edit },
        },
      };
    });
  }, []);

  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  return (
    <Box sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={finalColumns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
        getRowHeight={()=> "auto"}
        hideFooter
        sx={{
          border: '1px solid #c4c4c4',
          
          '& .MuiDataGrid-columnHeaders': {
            borderBottom: '1px solid #c4c4c4',
            backgroundColor: '#f1f1f1',
            fontWeight: 'bold',
            fontSize: '1.2rem',
          },
          
          '& .MuiDataGrid-columnHeader': {
            borderRight: '1px solid #c4c4c4',
            padding: '8px',
            fontSize: '1.2rem',
          },
          
          '& .MuiDataGrid-cell': {
            borderRight: '1px solid #c4c4c4',
            borderBottom: '1px solid #c4c4c4',
            padding: '8px',
            fontSize: '1.2rem',
            '&:focus': {
              outline: '2px solid #0078d4',
            },
          },

          // Style riêng cho cột STT
          '& .MuiDataGrid-cell[data-field="__rowNumber"]': {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold',
            color: '#666',
            cursor: 'default',
          },

          // Style cho header cột STT
          '& .MuiDataGrid-columnHeader[data-field="__rowNumber"]': {
            backgroundColor: '#e9ecef',
          },

          // Style cho cell đang edit
          '& .MuiDataGrid-cell--editing': {
            backgroundColor: '#fff3cd',
          },

          // Style cho input trong cell edit
          '& .MuiDataGrid-cell--editing .MuiInputBase-root': {
            fontSize: '1.2rem',
            height: '100%',
          },

          '& .MuiDataGrid-cell--editing .MuiInputBase-input': {
            fontSize: '1.2rem !important',
            padding: '8px',
            height: 'auto',
          },

          // Style cho TextField trong edit mode
          '& .MuiDataGrid-cell--editing .MuiTextField-root': {
            '& .MuiInputBase-input': {
              fontSize: '1.2rem !important',
              padding: '8px',
            },
          },

          // Style cho Select trong edit mode
          '& .MuiDataGrid-cell--editing .MuiSelect-select': {
            fontSize: '1.2rem !important',
            padding: '8px',
          },
          
          // Grid lines rõ ràng
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#fff',
          },
          
          // Selected cell
          '& .Mui-selected': {
            backgroundColor: '#cce7ff !important',
          }
        }}
      />
    </Box>
  );
}
