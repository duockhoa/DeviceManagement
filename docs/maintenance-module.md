# Module Quản lý Bảo trì Thiết bị

## Tổng quan
Module này cung cấp các chức năng quản lý bảo trì thiết bị, bao gồm lập kế hoạch, theo dõi, và báo cáo bảo trì.

## Cấu trúc thư mục
```
src/
└── component/
    └── MaintenanceComponent/
        ├── MaintenanceList/         # Danh sách bảo trì
        ├── MaintenanceForm/         # Form thêm/sửa
        ├── MaintenanceDashboard/    # Thống kê và biểu đồ
        ├── MaintenanceReport/       # Báo cáo
        └── MaintenanceNotifications/ # Hệ thống thông báo
```

## API Documentation

### 1. Lấy danh sách bảo trì
```typescript
GET /api/maintenance

Query Parameters:
- page: number          // Trang hiện tại
- pageSize: number      // Số lượng item mỗi trang
- status: string        // Trạng thái bảo trì
- priority: string      // Độ ưu tiên
- startDate: string     // Ngày bắt đầu (YYYY-MM-DD)
- endDate: string       // Ngày kết thúc (YYYY-MM-DD)
- searchTerm: string    // Từ khóa tìm kiếm

Response:
{
  items: Array<Maintenance>,
  total: number,
  page: number,
  pageSize: number
}
```

### 2. Tạo mới bảo trì
```typescript
POST /api/maintenance

Request Body:
{
  deviceId: string,      // ID thiết bị
  maintenanceType: string, // 'periodic' | 'immediate'
  maintenanceDate: string, // YYYY-MM-DD
  priority: string,      // 'high' | 'medium' | 'low'
  description: string,
  assignedTo: string    // ID người thực hiện
}

Response:
{
  id: string,
  ...requestBody,
  status: string,
  createdAt: string,
  updatedAt: string
}
```

### 3. Cập nhật bảo trì
```typescript
PUT /api/maintenance/:id

Request Body: Partial<MaintenanceData>

Response:
{
  id: string,
  ...updatedData
}
```

## Redux State Management

### State Interface
```typescript
interface MaintenanceState {
  items: Maintenance[];
  loading: boolean;
  error: string | null;
  selectedItem: Maintenance | null;
  maintenanceHistory: MaintenanceHistory[];
  upcomingMaintenance: Maintenance[];
  maintenanceStats: MaintenanceStats;
  filters: MaintenanceFilters;
}
```

### Available Actions
```typescript
// Async Actions
fetchMaintenances(): Promise<Maintenance[]>
createNewMaintenance(data: MaintenanceData): Promise<Maintenance>
updateExistingMaintenance(id: string, data: Partial<MaintenanceData>): Promise<Maintenance>
deleteExistingMaintenance(id: string): Promise<void>

// Sync Actions
setSelectedItem(item: Maintenance): void
clearSelectedItem(): void
setFilters(filters: Partial<MaintenanceFilters>): void
clearFilters(): void
```

## Components

### MaintenanceTable
```typescript
interface Props {
  data?: Maintenance[];
  loading?: boolean;
  onEdit?: (item: Maintenance) => void;
  onDelete?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}
```

### MaintenanceForm
```typescript
interface Props {
  initialData?: Maintenance;
  onSubmit: (data: MaintenanceData) => Promise<void>;
  onCancel?: () => void;
  loading?: boolean;
}
```

### MaintenanceDashboard
```typescript
interface Props {
  stats: MaintenanceStats;
  dateRange?: [Date, Date];
  onDateRangeChange?: (range: [Date, Date]) => void;
}
```

## Custom Hooks

### useMaintenanceFilters
```typescript
const useMaintenanceFilters = () => {
  // Returns
  return {
    filters: MaintenanceFilters;
    setFilter: (key: string, value: any) => void;
    clearFilters: () => void;
    applyFilters: () => void;
  }
}
```

### useMaintenanceStats
```typescript
const useMaintenanceStats = (dateRange?: [Date, Date]) => {
  // Returns
  return {
    stats: MaintenanceStats;
    loading: boolean;
    error: string | null;
    refetch: () => void;
  }
}
```

## Error Handling

### Error Codes
- `MAINTENANCE_001`: Lỗi khi tạo mới
- `MAINTENANCE_002`: Lỗi khi cập nhật
- `MAINTENANCE_003`: Lỗi khi xóa
- `MAINTENANCE_004`: Lỗi khi tải dữ liệu

### Error Messages
Tất cả thông báo lỗi được hiển thị bằng tiếng Việt và có hướng dẫn khắc phục.

## Performance Optimization

### Memoization
- Sử dụng `useMemo` cho các tính toán phức tạp
- Sử dụng `useCallback` cho các hàm callback
- Sử dụng `React.memo` cho các component thuần

### Code Splitting
```javascript
const MaintenanceDashboard = React.lazy(() => import('./MaintenanceDashboard'));
const MaintenanceReport = React.lazy(() => import('./MaintenanceReport'));
```

### Caching
- Caching API responses với RTK Query
- Local storage cho filters và preferences
- Memory cache cho các tính toán phức tạp

## Deployment

### Environment Variables
```env
REACT_APP_API_URL=https://api.example.com
REACT_APP_MAINTENANCE_REFRESH_INTERVAL=3600000
REACT_APP_MAINTENANCE_MAX_ITEMS=1000
```

### Build
```bash
npm run build
```

### Optimization
```bash
# Analyze bundle size
npm run analyze

# Optimize images
npm run optimize-images

# Generate sourcemaps
GENERATE_SOURCEMAP=true npm run build
```