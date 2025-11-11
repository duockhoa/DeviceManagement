# DK Device Management

Một ứng dụng web quản lý thiết bị được phát triển bởi phòng ĐBCL Công ty CP Dược Khoa để theo dõi và quản lý toàn bộ tài sản thiết bị của công ty.

## 📋 Mô tả

DK Device Management là một hệ thống quản lý thiết bị toàn diện cho phép:

-   Quản lý thông tin chi tiết các thiết bị y tế, máy móc sản xuất
-   Theo dõi tình trạng hoạt động và bảo trì thiết bị
-   Lập kế hoạch bảo dưỡng định kỳ
-   Quản lý lịch sử sửa chữa và thay thế
-   Báo cáo hiệu suất và chi phí thiết bị
-   Quản lý vị trí và người chịu trách nhiệm thiết bị

## 🚀 Công nghệ sử dụng

-   **Frontend**: React.js 18
-   **UI Framework**: Material-UI (MUI) v5
-   **State Management**: Redux Toolkit
-   **Routing**: React Router DOM v7
-   **HTTP Client**: Axios
-   **Form Management**: React Hook Form + Yup validation
-   **Date Handling**: Day.js, Date-fns
-   **Charts**: MUI X-Charts
-   **Data Grid**: MUI X-Data Grid
-   **Styling**: Emotion, SASS, Bootstrap

## 📁 Cấu trúc dự án

```
device-management/
├── public/                 # Static files
│   ├── index.html         # HTML template chính
│   ├── logo-2024.png      # Logo DK Pharma
│   └── manifest.json      # PWA manifest
├── src/
│   ├── App.js             # Component chính
│   ├── index.js           # Entry point
│   ├── theme.js           # Theme configuration
│   ├── components/        # Các component tái sử dụng
│   │   ├── DeviceForm/    # Form quản lý thiết bị
│   │   ├── MaintenanceSchedule/ # Lịch bảo trì
│   │   ├── SharedComponent/ # Component dùng chung
│   │   └── ReportComponent/ # Component báo cáo
│   ├── hooks/             # Custom hooks
│   ├── Layouts/           # Layout components
│   ├── pages/             # Page components
│   │   ├── DeviceList/    # Danh sách thiết bị
│   │   ├── DeviceDetail/  # Chi tiết thiết bị
│   │   ├── Maintenance/   # Quản lý bảo trì
│   │   └── Reports/       # Báo cáo và thống kê
│   ├── redux/             # Redux store và slices
│   ├── routes/            # Route configuration
│   ├── services/          # API services
│   └── utils/             # Utility functions
└── package.json
```

## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống

-   Node.js >= 16.0.0
-   npm >= 8.0.0

### Cài đặt dependencies

```bash
npm install
```

### Chạy ở môi trường development

```bash
npm start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production

```bash
npm run build
```

### Chạy tests

```bash
npm test
```

## ✨ Tính năng chính

### 🔧 Quản lý thiết bị

-   Thêm/sửa/xóa thông tin thiết bị
-   Phân loại theo nhóm thiết bị (y tế, sản xuất, văn phòng)
-   Upload và quản lý hình ảnh thiết bị
-   Quản lý thông số kỹ thuật và tài liệu hướng dẫn

### 📅 Quản lý bảo trì

-   Lập kế hoạch bảo dưỡng định kỳ
-   Theo dõi lịch sử bảo trì
-   Cảnh báo thiết bị cần bảo dưỡng
-   Quản lý chi phí bảo trì

### 📊 Báo cáo và thống kê

-   Báo cáo tình trạng thiết bị theo phòng ban
-   Thống kê chi phí bảo trì
-   Biểu đồ hiệu suất thiết bị
-   Export báo cáo Excel/PDF

### 🔍 Tìm kiếm và lọc

-   Tìm kiếm thiết bị theo mã, tên, loại
-   Lọc theo trạng thái, phòng ban, ngày mua
-   Sắp xếp và nhóm dữ liệu linh hoạt

### 🔐 Phân quyền người dùng

-   Quản trị viên: Toàn quyền quản lý
-   Quản lý phòng ban: Quản lý thiết bị của phòng
-   Nhân viên: Xem thông tin và báo cáo sự cố

### 📱 Responsive Design

-   Tương thích với máy tính bảng và điện thoại
-   Giao diện thân thiện với người dùng
-   Dark/Light mode support

## 🎨 Theme và Styling

Dự án sử dụng Material-UI với custom theme cho DK Pharma brand. Theme được cấu hình để phù hợp với identity của công ty dược phẩm.

## 🔧 Cấu hình

### Biến môi trường

Tạo file `.env` trong thư mục root:

```env
REACT_APP_API_URL=http://api.dkpharma.com
REACT_APP_VERSION=1.0.0
REACT_APP_COMPANY_NAME=DK Pharma
```

## 📝 Scripts có sẵn

-   `npm start` - Chạy ứng dụng ở chế độ development (port 3000)
-   `npm test` - Chạy test suite
-   `npm run build` - Build ứng dụng cho production
-   `npm run eject` - Eject khỏi Create React App

## 🔒 Bảo mật

-   Xác thực JWT tokens
-   Validation dữ liệu đầu vào
-   Bảo vệ routes theo phân quyền
-   Mã hóa thông tin nhạy cảm

## 🐛 Troubleshooting

### Lỗi thường gặp

-   **Port đã được sử dụng**: Thay đổi port trong file `.env`
-   **Module not found**: Chạy `npm install` để cài đặt dependencies
-   **Build failed**: Kiểm tra syntax errors trong console

## 🤝 Đóng góp

Mọi góp ý và đề xuất về tính năng xin liên hệ:

-   **Zalo**: 0965155761 (Bình ĐBCL)
-   **Email**: dbcl@dkpharma.com
-   **Phòng**: Đảm bảo Chất lượng - Tầng 2

## 📄 License

© 2025 DK Pharma. All rights reserved.

## 🏢 Về chúng tôi

**Được phát triển bởi**: Phòng Đảm bảo Chất lượng (ĐBCL)  
**Công ty**: Công ty Cổ phần Dược Khoa  
**Địa chỉ**: [Địa chỉ công ty]  
**Website**: www.dkpharma.com

---

**Phiên bản hiện tại**: v1.0.0  
**Cập nhật lần cuối**: Tháng 9, 2025  
**Hỗ trợ**: React 18.x, Material-UI 5.x
