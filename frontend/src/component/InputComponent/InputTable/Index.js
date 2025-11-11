import * as React from 'react';
import { 
  DataGrid, 
  GridCellModes, 
  GridToolbarContainer,
  GridActionsCellItem 
} from '@mui/x-data-grid';
import { Box, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { 
  Add as AddIcon,
  Delete as DeleteIcon 
} from '@mui/icons-material';

// Custom Toolbar với nút Thêm dòng mới
const CustomToolbar = React.memo(({ onAddRow }) => {
  return (
    <GridToolbarContainer sx={{ 
      p: 1, 
      borderBottom: '1px solid #c4c4c4',
      backgroundColor: '#f8f9fa' 
    }}>
      <Button
        color="primary"
        startIcon={<AddIcon />}
        onClick={onAddRow}
        size="small"
        variant="contained"
        sx={{
          fontSize: '1rem',
          textTransform: 'none',
          backgroundColor: '#1976d2',
          '&:hover': {
            backgroundColor: '#1565c0',
          }
        }}
      >
        Thêm dòng mới
      </Button>
    </GridToolbarContainer>
  );
});

CustomToolbar.displayName = 'CustomToolbar';

export default function InputTable({ 
  initialRows = [], 
  columns = [], 
  showRowNumber = true, 
  onDataChange,
  showAddButton = true,
  showDeleteButton = true,
  confirmDelete = false,
  minRows = 0
}) {
  const [rows, setRows] = React.useState(initialRows);
  const [cellModesModel, setCellModesModel] = React.useState({});
  const [deleteDialog, setDeleteDialog] = React.useState({ open: false, rowId: null });

  // FIX 1: Tránh dependency loop
  React.useEffect(() => {
    setRows(initialRows);
  }, [JSON.stringify(initialRows)]); // Deep comparison

  // FIX 2: Tạo empty row - loại bỏ dependency rows
  const createEmptyRow = React.useCallback(() => {
    const timestamp = Date.now();
    const emptyRow = { id: timestamp };
    
    columns.forEach(col => {
      if (col.field !== 'id' && col.field !== '__rowNumber' && col.field !== 'actions') {
        switch (col.type) {
          case 'number':
            emptyRow[col.field] = null;
            break;
          case 'boolean':
            emptyRow[col.field] = false;
            break;
          case 'singleSelect':
            emptyRow[col.field] = col.valueOptions?.[0] || '';
            break;
          case 'date':
          case 'dateTime':
            emptyRow[col.field] = null;
            break;
          default:
            emptyRow[col.field] = '';
        }
      }
    });
    
    return emptyRow;
  }, [columns]);

  // FIX 3: Debounce onChange callback
  const debouncedOnDataChange = React.useCallback(
    React.useMemo(
      () => {
        if (!onDataChange) return null;
        
        let timeoutId;
        return (data) => {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => {
            onDataChange(data);
          }, 100);
        };
      },
      [onDataChange]
    ),
    [onDataChange]
  );

  // Handle thêm dòng mới
  const handleAddRow = React.useCallback(() => {
    const newRow = createEmptyRow();
    setRows((prevRows) => {
      const updatedRows = [...prevRows, newRow];
      
      // Notify parent component with debounce
      if (debouncedOnDataChange) {
        debouncedOnDataChange(updatedRows);
      }
      
      return updatedRows;
    });

    // FIX 4: Sử dụng setTimeout để tránh update state trong render
    const firstEditableColumn = columns.find(col => 
      col.editable && col.field !== 'id' && col.field !== '__rowNumber' && col.field !== 'actions'
    );
    
    if (firstEditableColumn) {
      setTimeout(() => {
        setCellModesModel((prevModel) => ({
          ...prevModel,
          [newRow.id]: { [firstEditableColumn.field]: { mode: GridCellModes.Edit } }
        }));
      }, 50);
    }
  }, [createEmptyRow, columns, debouncedOnDataChange]);

  // FIX 5: Confirm delete dialog
  const handleDeleteClick = React.useCallback((id) => () => {
    if (confirmDelete) {
      setDeleteDialog({ open: true, rowId: id });
    } else {
      handleDeleteRow(id);
    }
  }, [confirmDelete]);

  const handleDeleteRow = React.useCallback((id) => {
    setRows((prevRows) => {
      // FIX 6: Kiểm tra minRows
      if (prevRows.length <= minRows) {
        console.warn(`Cannot delete row. Minimum ${minRows} rows required.`);
        return prevRows;
      }

      const updatedRows = prevRows.filter((row) => row.id !== id);
      
      // Notify parent component
      if (debouncedOnDataChange) {
        debouncedOnDataChange(updatedRows);
      }
      
      return updatedRows;
    });

    // Clear cell modes for deleted row
    setCellModesModel((prevModel) => {
      const newModel = { ...prevModel };
      delete newModel[id];
      return newModel;
    });

    setDeleteDialog({ open: false, rowId: null });
  }, [debouncedOnDataChange, minRows]);

  const handleDeleteCancel = React.useCallback(() => {
    setDeleteDialog({ open: false, rowId: null });
  }, []);

  // FIX 7: Memoize columns để tránh re-render
  const rowNumberColumn = React.useMemo(() => ({
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
  }), []);

  const actionsColumn = React.useMemo(() => ({
    field: 'actions',
    type: 'actions',
    headerName: 'Thao tác',
    width: 100,
    cellClassName: 'actions',
    headerAlign: 'center',
    renderHeader: () => (
      <Box sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
        Thao tác
      </Box>
    ),
    getActions: ({ id }) => {
      const canDelete = rows.length > minRows;
      return [
        <GridActionsCellItem
          key={`delete-${id}`}
          icon={<DeleteIcon sx={{ fontSize: 20 }} />}
          label="Xóa"
          onClick={handleDeleteClick(id)}
          color="error"
          disabled={!canDelete}
          sx={{
            opacity: canDelete ? 1 : 0.5,
            '&:hover': canDelete ? {
              backgroundColor: '#ffebee',
            } : {}
          }}
        />,
      ];
    },
  }), [handleDeleteClick, rows.length, minRows]);

  const finalColumns = React.useMemo(() => {
    let allColumns = [...columns];
    
    if (showRowNumber) {
      allColumns = [rowNumberColumn, ...allColumns];
    }
    
    if (showDeleteButton) {
      allColumns = [...allColumns, actionsColumn];
    }
    
    return allColumns;
  }, [columns, showRowNumber, showDeleteButton, rowNumberColumn, actionsColumn]);

  // FIX 8: Optimize cell click handler
  const handleCellClick = React.useCallback((params, event) => {
    if (params.field === '__rowNumber' || params.field === 'actions' || !params.isEditable) {
      return;
    }

    if (event.target.nodeType === 1 && !event.currentTarget.contains(event.target)) {
      return;
    }

    setCellModesModel((prevModel) => ({
      ...Object.keys(prevModel).reduce(
        (acc, id) => ({
          ...acc,
          [id]: Object.keys(prevModel[id] || {}).reduce(
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
        ...Object.keys(prevModel[params.id] || {}).reduce(
          (acc, field) => ({ ...acc, [field]: { mode: GridCellModes.View } }),
          {},
        ),
        [params.field]: { mode: GridCellModes.Edit },
      },
    }));
  }, []);

  const handleCellModesModelChange = React.useCallback((newModel) => {
    setCellModesModel(newModel);
  }, []);

  // FIX 9: Optimize row update với error handling
  const handleProcessRowUpdate = React.useCallback((newRow, oldRow) => {
    try {
      setRows((prevRows) => {
        const updatedRows = prevRows.map((row) => (row.id === newRow.id ? newRow : row));
        
        if (debouncedOnDataChange) {
          debouncedOnDataChange(updatedRows);
        }
        
        return updatedRows;
      });
      return newRow;
    } catch (error) {
      console.error('Error updating row:', error);
      return oldRow;
    }
  }, [debouncedOnDataChange]);

  // FIX 10: Error boundary cho row update
  const handleProcessRowUpdateError = React.useCallback((error) => {
    console.error('Row update error:', error);
  }, []);

  return (
    <Box sx={{ height: "100%", width: '100%' }}>
      <DataGrid
        rows={rows}
        columns={finalColumns}
        cellModesModel={cellModesModel}
        onCellModesModelChange={handleCellModesModelChange}
        onCellClick={handleCellClick}
        processRowUpdate={handleProcessRowUpdate}
        onProcessRowUpdateError={handleProcessRowUpdateError}
        hideFooter
        disableRowSelectionOnClick
        slots={showAddButton ? {
          toolbar: CustomToolbar
        } : {}}
        slotProps={showAddButton ? {
          toolbar: { onAddRow: handleAddRow }
        } : {}}
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

          '& .MuiDataGrid-cell[data-field="__rowNumber"]': {
            backgroundColor: '#f8f9fa',
            fontWeight: 'bold',
            color: '#666',
            cursor: 'default',
          },

          '& .MuiDataGrid-columnHeader[data-field="__rowNumber"]': {
            backgroundColor: '#e9ecef',
          },

          '& .MuiDataGrid-cell[data-field="actions"]': {
            backgroundColor: '#f8f9fa',
            justifyContent: 'center',
          },

          '& .MuiDataGrid-columnHeader[data-field="actions"]': {
            backgroundColor: '#e9ecef',
          },

          '& .MuiDataGrid-cell--editing': {
            backgroundColor: '#fff3cd',
          },

          '& .MuiDataGrid-cell--editing .MuiInputBase-root': {
            fontSize: '1.2rem',
            height: '100%',
          },

          '& .MuiDataGrid-cell--editing .MuiInputBase-input': {
            fontSize: '1.2rem !important',
            padding: '8px',
            height: 'auto',
          },

          '& .MuiDataGrid-cell--editing .MuiTextField-root': {
            '& .MuiInputBase-input': {
              fontSize: '1.2rem !important',
              padding: '8px',
            },
          },

          '& .MuiDataGrid-cell--editing .MuiSelect-select': {
            fontSize: '1.2rem !important',
            padding: '8px',
          },

          '& .MuiDataGrid-actionsCell': {
            '& .MuiIconButton-root': {
              color: '#d32f2f',
              '&:hover': {
                backgroundColor: '#ffebee',
                color: '#c62828',
              },
              '&:disabled': {
                color: '#ccc',
              }
            }
          },
          
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: '#fff',
          },
          
          '& .Mui-selected': {
            backgroundColor: '#cce7ff !important',
          }
        }}
      />

      {/* FIX 11: Confirm Delete Dialog */}
      {confirmDelete && (
        <Dialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          maxWidth="xs"
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            Bạn có chắc chắn muốn xóa dòng này không?
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDeleteCancel}>Hủy</Button>
            <Button 
              onClick={() => handleDeleteRow(deleteDialog.rowId)} 
              color="error"
              variant="contained"
            >
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}
