import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
    getAllMaintenance,
    getMaintenanceById,
    createMaintenance,
    updateMaintenance,
    deleteMaintenance,
    getMaintenanceByAsset,
    getMaintenanceByStatus,
    getMaintenanceByTechnician,
    approveMaintenance,
    rejectMaintenance
} from '../../services/maintenanceService';

// Fetch tất cả maintenance records
export const fetchMaintenance = createAsyncThunk(
    'maintenance/fetchMaintenance',
    async () => {
        const response = await getAllMaintenance();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách bảo trì');
        }
    }
);

// Fetch maintenance theo ID
export const fetchMaintenanceById = createAsyncThunk(
    'maintenance/fetchMaintenanceById',
    async (id) => {
        const response = await getMaintenanceById(id);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin bảo trì');
        }
    }
);

// Fetch maintenance theo asset
export const fetchMaintenanceByAsset = createAsyncThunk(
    'maintenance/fetchMaintenanceByAsset',
    async (assetId) => {
        const response = await getMaintenanceByAsset(assetId);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy lịch sử bảo trì thiết bị');
        }
    }
);

// Fetch maintenance theo status
export const fetchMaintenanceByStatus = createAsyncThunk(
    'maintenance/fetchMaintenanceByStatus',
    async (status) => {
        const response = await getMaintenanceByStatus(status);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách bảo trì theo trạng thái');
        }
    }
);

// Tạo maintenance mới
export const createMaintenanceRecord = createAsyncThunk(
    'maintenance/createMaintenanceRecord',
    async (maintenanceData) => {
        const response = await createMaintenance(maintenanceData);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể tạo lịch bảo trì mới');
        }
    }
);

// Cập nhật maintenance
export const updateMaintenanceRecord = createAsyncThunk(
    'maintenance/updateMaintenanceRecord',
    async ({ id, data }) => {
        const response = await updateMaintenance(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể cập nhật bảo trì');
        }
    }
);

// Xóa maintenance
export const deleteMaintenanceRecord = createAsyncThunk(
    'maintenance/deleteMaintenanceRecord',
    async ({ id, reason }) => {
        const response = await deleteMaintenance(id, reason);
        if (response && response.success) {
            return response;
        } else {
            throw new Error(response?.message || 'Không thể xóa bảo trì');
        }
    }
);

// Phê duyệt maintenance
export const approveMaintenanceRecord = createAsyncThunk(
    'maintenance/approveMaintenanceRecord',
    async ({ id, data }) => {
        const response = await approveMaintenance(id, data);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể phê duyệt bảo trì');
        }
    }
);

// Từ chối phê duyệt maintenance
export const rejectMaintenanceRecord = createAsyncThunk(
    'maintenance/rejectMaintenanceRecord',
    async ({ id, reason }) => {
        const response = await rejectMaintenance(id, reason);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể từ chối phê duyệt');
        }
    }
);

const initialState = {
    maintenance: [],
    currentMaintenance: null,
    loading: false,
    error: null,
    success: false
};

export const maintenanceSlice = createSlice({
    name: 'maintenance',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = false;
        },
        setCurrentMaintenance: (state, action) => {
            state.currentMaintenance = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMaintenance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenance.fulfilled, (state, action) => {
                state.maintenance = action.payload;
                state.loading = false;
            })
            .addCase(fetchMaintenance.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(fetchMaintenanceById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
                state.currentMaintenance = action.payload;
                state.loading = false;
            })
            .addCase(fetchMaintenanceById.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(fetchMaintenanceByAsset.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenanceByAsset.fulfilled, (state, action) => {
                state.maintenance = action.payload;
                state.loading = false;
            })
            .addCase(fetchMaintenanceByAsset.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(fetchMaintenanceByStatus.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMaintenanceByStatus.fulfilled, (state, action) => {
                state.maintenance = action.payload;
                state.loading = false;
            })
            .addCase(fetchMaintenanceByStatus.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(createMaintenanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createMaintenanceRecord.fulfilled, (state, action) => {
                // Extract data from response: {success, message, data}
                const newMaintenance = action.payload.data || action.payload;
                state.maintenance = [newMaintenance, ...state.maintenance];
                state.loading = false;
                state.success = true;
            })
            .addCase(createMaintenanceRecord.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(updateMaintenanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateMaintenanceRecord.fulfilled, (state, action) => {
                // Extract data from response: {success, message, data}
                const updatedMaintenance = action.payload.data || action.payload;
                const index = state.maintenance.findIndex(item => item.id === updatedMaintenance.id);
                if (index !== -1) {
                    state.maintenance[index] = updatedMaintenance;
                }
                state.loading = false;
                state.error = null;
                state.success = true;
            })
            .addCase(updateMaintenanceRecord.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(deleteMaintenanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteMaintenanceRecord.fulfilled, (state, action) => {
                state.maintenance = state.maintenance.filter(item => item.id !== action.meta.arg);
                state.loading = false;
                state.success = true;
            })
            .addCase(deleteMaintenanceRecord.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(approveMaintenanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveMaintenanceRecord.fulfilled, (state, action) => {
                // Extract data from response if needed
                const updatedMaintenance = action.payload;
                // Cập nhật maintenance trong danh sách
                const index = state.maintenance.findIndex(item => item.id === updatedMaintenance.id);
                if (index !== -1) {
                    state.maintenance[index] = updatedMaintenance;
                }
                // Cập nhật currentMaintenance nếu đang xem chi tiết
                if (state.currentMaintenance?.id === updatedMaintenance.id) {
                    state.currentMaintenance = updatedMaintenance;
                }
                state.loading = false;
                state.success = true;
            })
            .addCase(approveMaintenanceRecord.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            })
            .addCase(rejectMaintenanceRecord.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(rejectMaintenanceRecord.fulfilled, (state, action) => {
                // Cập nhật maintenance trong danh sách
                const index = state.maintenance.findIndex(item => item.id === action.payload.id);
                if (index !== -1) {
                    state.maintenance[index] = action.payload;
                }
                // Cập nhật currentMaintenance nếu đang xem chi tiết
                if (state.currentMaintenance?.id === action.payload.id) {
                    state.currentMaintenance = action.payload;
                }
                state.loading = false;
                state.success = true;
            })
            .addCase(rejectMaintenanceRecord.rejected, (state, action) => {
                state.error = action.error.message;
                state.loading = false;
            });
    }
});

export const { clearError, clearSuccess, setCurrentMaintenance } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;