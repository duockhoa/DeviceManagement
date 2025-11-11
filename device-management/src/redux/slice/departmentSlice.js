import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { 
    getAllDepartments,
    getDepartmentByName,
    getUsersByDepartment,
    getAssetsByDepartment,
    getDepartmentStatistics,
    getDepartmentsWithCounts
} from '../../services/departmentService';

// Fetch tất cả departments
export const fetchDepartments = createAsyncThunk(
    'departments/fetchDepartments', 
    async () => {
        const response = await getAllDepartments();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách phòng ban');
        }
    }
);

// Fetch department theo name
export const fetchDepartmentByName = createAsyncThunk(
    'departments/fetchDepartmentByName',
    async (name) => {
        const response = await getDepartmentByName(name);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thông tin phòng ban');
        }
    }
);

// Fetch users thuộc department
export const fetchUsersByDepartment = createAsyncThunk(
    'departments/fetchUsersByDepartment',
    async (departmentName) => {
        const response = await getUsersByDepartment(departmentName);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách nhân viên');
        }
    }
);

// Fetch assets thuộc department
export const fetchAssetsByDepartment = createAsyncThunk(
    'departments/fetchAssetsByDepartment',
    async (departmentName) => {
        const response = await getAssetsByDepartment(departmentName);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách thiết bị');
        }
    }
);

// Fetch department statistics
export const fetchDepartmentStatistics = createAsyncThunk(
    'departments/fetchDepartmentStatistics',
    async (departmentName) => {
        const response = await getDepartmentStatistics(departmentName);
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy thống kê phòng ban');
        }
    }
);

// Fetch departments với số lượng users và assets
export const fetchDepartmentsWithCounts = createAsyncThunk(
    'departments/fetchDepartmentsWithCounts',
    async () => {
        const response = await getDepartmentsWithCounts();
        if (response) {
            return response;
        } else {
            throw new Error('Không thể lấy danh sách phòng ban với thống kê');
        }
    }
);

const departmentSlice = createSlice({
    name: 'departments',
    initialState: {
        departments: [],
        currentDepartment: null,
        departmentUsers: [],
        departmentAssets: [],
        departmentStatistics: null,
        departmentsWithCounts: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearCurrentDepartment: (state) => {
            state.currentDepartment = null;
            state.departmentUsers = [];
            state.departmentAssets = [];
            state.departmentStatistics = null;
        },
        clearError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch all departments
            .addCase(fetchDepartments.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartments.fulfilled, (state, action) => {
                state.departments = action.payload;
                state.loading = false;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch department by name
            .addCase(fetchDepartmentByName.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentByName.fulfilled, (state, action) => {
                state.currentDepartment = action.payload;
                state.loading = false;
            })
            .addCase(fetchDepartmentByName.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch users by department
            .addCase(fetchUsersByDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsersByDepartment.fulfilled, (state, action) => {
                state.departmentUsers = action.payload.users || [];
                state.loading = false;
            })
            .addCase(fetchUsersByDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch assets by department
            .addCase(fetchAssetsByDepartment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAssetsByDepartment.fulfilled, (state, action) => {
                state.departmentAssets = action.payload.assets || [];
                state.loading = false;
            })
            .addCase(fetchAssetsByDepartment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch department statistics
            .addCase(fetchDepartmentStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentStatistics.fulfilled, (state, action) => {
                state.departmentStatistics = action.payload;
                state.loading = false;
            })
            .addCase(fetchDepartmentStatistics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })
            
            // Fetch departments with counts
            .addCase(fetchDepartmentsWithCounts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDepartmentsWithCounts.fulfilled, (state, action) => {
                state.departmentsWithCounts = action.payload;
                state.loading = false;
            })
            .addCase(fetchDepartmentsWithCounts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export const { clearCurrentDepartment, clearError } = departmentSlice.actions;
export default departmentSlice.reducer;
