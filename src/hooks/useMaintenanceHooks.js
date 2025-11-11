import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from '@reduxjs/toolkit';

// Tạo các selector được memoized
const selectMaintenanceState = state => state.maintenance;
const selectItems = state => state.maintenance.items;
const selectFilters = state => state.maintenance.filters;

// Selector cho việc lọc dữ liệu
const createFilteredMaintenancesSelector = () => {
    return createSelector(
        [selectItems, selectFilters],
        (items, filters) => {
            return items.filter(item => {
                // Lọc theo trạng thái
                if (filters.status !== 'all' && item.status !== filters.status) {
                    return false;
                }
                
                // Lọc theo độ ưu tiên
                if (filters.priority !== 'all' && item.priority !== filters.priority) {
                    return false;
                }
                
                // Lọc theo khoảng thời gian
                if (filters.dateRange) {
                    const itemDate = new Date(item.maintenanceDate);
                    if (itemDate < filters.dateRange.start || itemDate > filters.dateRange.end) {
                        return false;
                    }
                }
                
                // Tìm kiếm theo từ khóa
                if (filters.searchTerm) {
                    const searchLower = filters.searchTerm.toLowerCase();
                    return (
                        item.deviceName?.toLowerCase().includes(searchLower) ||
                        item.description?.toLowerCase().includes(searchLower) ||
                        item.maintenanceType?.toLowerCase().includes(searchLower)
                    );
                }
                
                return true;
            });
        }
    );
};

// Hook cho việc lấy danh sách bảo trì đã được lọc
export const useFilteredMaintenances = () => {
    const filteredMaintenancesSelector = useMemo(
        createFilteredMaintenancesSelector,
        []
    );
    return useSelector(filteredMaintenancesSelector);
};

// Hook cho việc lấy thống kê
export const useMaintenanceStats = () => {
    const items = useSelector(selectItems);
    
    return useMemo(() => {
        const completedItems = items.filter(item => item.status === 'completed');
        const pendingItems = items.filter(item => item.status === 'pending');
        const overdueItems = items.filter(item => {
            const dueDate = new Date(item.maintenanceDate);
            return dueDate < new Date() && item.status !== 'completed';
        });

        return {
            total: items.length,
            completed: completedItems.length,
            pending: pendingItems.length,
            overdue: overdueItems.length,
            completionRate: items.length ? 
                (completedItems.length / items.length) * 100 : 0,
            byPriority: items.reduce((acc, item) => {
                acc[item.priority] = (acc[item.priority] || 0) + 1;
                return acc;
            }, {}),
            byMonth: items.reduce((acc, item) => {
                const month = new Date(item.maintenanceDate).getMonth();
                acc[month] = (acc[month] || 0) + 1;
                return acc;
            }, {})
        };
    }, [items]);
};

// Hook cho việc lấy lịch bảo trì sắp tới theo thiết bị
export const useUpcomingMaintenancesByDevice = () => {
    const upcoming = useSelector(state => state.maintenance.upcomingMaintenance);
    
    return useMemo(() => {
        return upcoming.reduce((acc, item) => {
            if (!acc[item.deviceId]) {
                acc[item.deviceId] = [];
            }
            acc[item.deviceId].push(item);
            return acc;
        }, {});
    }, [upcoming]);
};

// Hook cho việc lấy lịch sử bảo trì theo khoảng thời gian
export const useMaintenanceHistory = (startDate, endDate) => {
    const history = useSelector(state => state.maintenance.maintenanceHistory);
    
    return useMemo(() => {
        if (!startDate || !endDate) return history;
        
        return history.filter(item => {
            const itemDate = new Date(item.maintenanceDate);
            return itemDate >= startDate && itemDate <= endDate;
        });
    }, [history, startDate, endDate]);
};

// Hook cho việc kiểm tra quyền truy cập
export const useMaintenancePermissions = () => {
    const user = useSelector(state => state.auth.user);
    
    return useMemo(() => ({
        canCreate: user?.permissions?.includes('maintenance.create'),
        canUpdate: user?.permissions?.includes('maintenance.update'),
        canDelete: user?.permissions?.includes('maintenance.delete'),
        canExport: user?.permissions?.includes('maintenance.export')
    }), [user?.permissions]);
};