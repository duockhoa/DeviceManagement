import { configureStore } from '@reduxjs/toolkit';
import maintenanceReducer, {
    setSelectedItem,
    clearSelectedItem,
    setFilters,
    clearFilters,
    sortByDate,
    sortByPriority,
    filterByDevice,
    toggleComplete,
    updateMaintenanceDetails,
    selectFilteredMaintenances,
    selectMaintenanceStats,
    selectUpcomingMaintenancesByDevice
} from '../maintenanceSlice';

describe('maintenanceSlice reducer', () => {
    let store;

    beforeEach(() => {
        store = configureStore({
            reducer: {
                maintenance: maintenanceReducer
            }
        });
    });

    // Test các reducers cơ bản
    describe('basic reducers', () => {
        test('setSelectedItem và clearSelectedItem', () => {
            const testItem = { id: 1, name: 'Test Device' };
            store.dispatch(setSelectedItem(testItem));
            expect(store.getState().maintenance.selectedItem).toEqual(testItem);

            store.dispatch(clearSelectedItem());
            expect(store.getState().maintenance.selectedItem).toBeNull();
        });

        test('setFilters và clearFilters', () => {
            const testFilters = {
                status: 'completed',
                priority: 'high'
            };
            store.dispatch(setFilters(testFilters));
            expect(store.getState().maintenance.filters).toEqual({
                ...store.getState().maintenance.filters,
                ...testFilters
            });

            store.dispatch(clearFilters());
            expect(store.getState().maintenance.filters).toEqual({
                status: 'all',
                priority: 'all',
                dateRange: null,
                searchTerm: ''
            });
        });
    });

    // Test các chức năng sắp xếp
    describe('sorting functionality', () => {
        test('sortByDate', () => {
            const items = [
                { id: 1, maintenanceDate: '2025-01-01' },
                { id: 2, maintenanceDate: '2025-02-01' }
            ];
            store = configureStore({
                reducer: {
                    maintenance: maintenanceReducer
                },
                preloadedState: {
                    maintenance: {
                        ...store.getState().maintenance,
                        items
                    }
                }
            });

            store.dispatch(sortByDate('asc'));
            const sortedItems = store.getState().maintenance.items;
            expect(sortedItems[0].id).toBe(1);
            expect(sortedItems[1].id).toBe(2);

            store.dispatch(sortByDate('desc'));
            const reverseSortedItems = store.getState().maintenance.items;
            expect(reverseSortedItems[0].id).toBe(2);
            expect(reverseSortedItems[1].id).toBe(1);
        });

        test('sortByPriority', () => {
            const items = [
                { id: 1, priority: 'low' },
                { id: 2, priority: 'high' }
            ];
            store = configureStore({
                reducer: {
                    maintenance: maintenanceReducer
                },
                preloadedState: {
                    maintenance: {
                        ...store.getState().maintenance,
                        items
                    }
                }
            });

            store.dispatch(sortByPriority('desc'));
            const sortedItems = store.getState().maintenance.items;
            expect(sortedItems[0].id).toBe(2);
            expect(sortedItems[1].id).toBe(1);
        });
    });

    // Test các selectors
    describe('selectors', () => {
        test('selectFilteredMaintenances với filter theo status', () => {
            const items = [
                { id: 1, status: 'completed' },
                { id: 2, status: 'pending' }
            ];
            store = configureStore({
                reducer: {
                    maintenance: maintenanceReducer
                },
                preloadedState: {
                    maintenance: {
                        items,
                        filters: {
                            status: 'completed',
                            priority: 'all',
                            dateRange: null,
                            searchTerm: ''
                        }
                    }
                }
            });

            const filteredItems = selectFilteredMaintenances(store.getState());
            expect(filteredItems.length).toBe(1);
            expect(filteredItems[0].id).toBe(1);
        });

        test('selectMaintenanceStats tính toán đúng', () => {
            const items = [
                { id: 1, status: 'completed' },
                { id: 2, status: 'pending' },
                { id: 3, status: 'completed' }
            ];
            store = configureStore({
                reducer: {
                    maintenance: maintenanceReducer
                },
                preloadedState: {
                    maintenance: {
                        items
                    }
                }
            });

            const stats = selectMaintenanceStats(store.getState());
            expect(stats.total).toBe(3);
            expect(stats.completionRate).toBe(66.66666666666666);
        });
    });

    // Test các chức năng nghiệp vụ
    describe('business logic', () => {
        test('toggleComplete thay đổi trạng thái', () => {
            const items = [
                { id: 1, status: 'pending' }
            ];
            store = configureStore({
                reducer: {
                    maintenance: maintenanceReducer
                },
                preloadedState: {
                    maintenance: {
                        items
                    }
                }
            });

            store.dispatch(toggleComplete(1));
            const updatedItem = store.getState().maintenance.items[0];
            expect(updatedItem.status).toBe('completed');
            expect(updatedItem.completedAt).toBeTruthy();
        });

        test('updateMaintenanceDetails cập nhật thông tin', () => {
            const items = [
                { id: 1, description: 'Old desc' }
            ];
            store = configureStore({
                reducer: {
                    maintenance: maintenanceReducer
                },
                preloadedState: {
                    maintenance: {
                        items
                    }
                }
            });

            store.dispatch(updateMaintenanceDetails({
                id: 1,
                details: { description: 'New desc' }
            }));
            const updatedItem = store.getState().maintenance.items[0];
            expect(updatedItem.description).toBe('New desc');
        });
    });
});