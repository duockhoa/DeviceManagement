# Hướng Dẫn Sử Dụng DeviceManagement

## 🚀 Chạy Ứng Dụng

### 1. Cài đặt Dependencies
```bash
npm install --legacy-peer-deps
```

### 2. Khởi động Dev Server
```bash
npm start
```

Ứng dụng sẽ mở tại: http://localhost:3000

## 📋 Các Tính Năng Chính

### 1. Quản Lý Thiết Bị
- **Danh sách thiết bị**: Xem tất cả thiết bị với thông tin chi tiết
- **Thêm thiết bị**: Tạo thiết bị mới với hình ảnh và thông số kỹ thuật
- **Sửa thiết bị**: Cập nhật thông tin thiết bị
- **Xóa thiết bị**: Xóa thiết bị không còn sử dụng
- **Tìm kiếm & Lọc**: Lọc theo danh mục, khu vực, trạng thái

### 2. Quản Lý Bảo Trì
- **Lập kế hoạch bảo trì**: Tạo lịch bảo trì định kỳ
- **Theo dõi trạng thái**: Cập nhật trạng thái (Chờ xử lý, Đang thực hiện, Hoàn thành)
- **Batch Operations**: 
  - Cập nhật trạng thái hàng loạt
  - Lên lịch lại hàng loạt
  - Xóa hàng loạt
- **Lịch sử bảo trì**: Xem lịch sử bảo trì của từng thiết bị
- **Báo cáo bảo trì**: 
  - Thống kê tổng quan
  - Biểu đồ phân bố trạng thái
  - Thống kê theo tháng
  - Xuất báo cáo Excel

### 3. Quản Lý Vật Tư Tiêu Hao
- Quản lý các loại vật tư và linh kiện
- Phân loại theo loại (Tiêu hao, Linh kiện)
- Theo dõi trạng thái (Hoạt động, Không hoạt động)
- Tìm kiếm và lọc vật tư

### 4. Quản Lý Tổ Chức
- **Nhà máy (Plants)**: Quản lý các nhà máy
- **Khu vực (Areas)**: Quản lý các khu vực trong nhà máy
- **Phòng ban (Departments)**: Quản lý cấu trúc phòng ban
- **Người dùng (Users)**: Quản lý tài khoản người dùng

### 5. Dashboard
- Thống kê tổng quan về thiết bị
- Biểu đồ trạng thái thiết bị
- Lịch bảo trì 6 tháng qua
- Thông báo bảo trì sắp tới

## 📁 Cấu Trúc Thư Mục

```
src/
├── component/              # Components UI
│   ├── MaintenanceComponent/
│   │   ├── MaintenanceForm/        # Form tạo/sửa bảo trì
│   │   ├── MaintenanceList/        # Danh sách bảo trì
│   │   ├── MaintenanceReport/      # Báo cáo bảo trì
│   │   ├── BatchOperations/        # Thao tác hàng loạt
│   │   └── DeleteConfirmDialog/    # Xác nhận xóa
│   ├── LayoutComponent/            # Header, Sidebar, etc.
│   ├── InputComponent/             # Input fields
│   └── AssetComponent/             # Quản lý thiết bị
├── pages/                  # Page components
│   ├── Maintenance/        # Trang quản lý bảo trì
│   ├── Devices/            # Trang quản lý thiết bị
│   ├── DashBoard/          # Trang dashboard
│   └── ...
├── redux/                  # Redux store
│   ├── store.js            # Store configuration
│   └── slice/              # Redux slices
│       ├── maintenanceSlice.js
│       ├── assetsSlice.js
│       ├── plantSlice.js
│       └── ...
├── services/               # API services
│   ├── maintenanceService.js
│   ├── assetsService.js
│   ├── auth-axios.js       # Axios interceptors
│   └── ...
├── utils/                  # Utility functions
│   └── exportUtils.js      # Export to Excel
└── hooks/                  # Custom hooks
```

## 🔧 Cấu Hình API

Chỉnh sửa file `.env`:

```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_BACKEND_URL=http://localhost:8080
REACT_APP_TOKEN_KEY=device_management_token
REACT_APP_REFRESH_TOKEN_KEY=device_management_refresh_token
```

## 📦 Dependencies Chính

- **React**: UI framework
- **Redux Toolkit**: State management
- **Material-UI**: UI components
- **Ant Design**: UI components
- **Recharts**: Chart library
- **React Router**: Navigation
- **Axios**: HTTP client
- **React Hook Form**: Form handling
- **Yup**: Form validation

## 🎨 Theme

Theme được cấu hình trong `src/theme.js`:
- Màu chủ đạo: Blue
- Font: Roboto
- Hỗ trợ Dark/Light mode

## 🔐 Xác Thực

- Token được lưu trong localStorage
- Auto-refresh token khi hết hạn
- Logout và clear token khi đăng xuất

## 🚨 Xử Lý Lỗi Thường Gặp

### Lỗi CORS
```
Kiểm tra backend CORS configuration
Đảm bảo backend cho phép requests từ localhost:3000
```

### Lỗi 401 Unauthorized
```
Token hết hạn, cần đăng nhập lại
Xóa localStorage và reload trang
```

### Lỗi 404 Not Found
```
Kiểm tra endpoint API trong service
Xác nhận backend đang chạy
```

## 📝 Ghi Chú Quan Trọng

1. **Batch Operations**: Chọn nhiều item bằng checkbox để thực hiện thao tác hàng loạt
2. **Export Excel**: Báo cáo được xuất với định dạng `.xlsx`, có thể mở bằng Excel
3. **Hot Reload**: Thay đổi code sẽ tự động reload trang (nếu không thay đổi state)
4. **Redux DevTools**: Có thể debug Redux state bằng Redux DevTools extension

## 🔗 Tài Liệu Liên Quan

- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [Ant Design Documentation](https://ant.design/)

## 📞 Hỗ Trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra console browser (F12)
2. Kiểm tra Network tab để xem API calls
3. Kiểm tra Redux state bằng Redux DevTools
4. Xem logs trong terminal npm start
