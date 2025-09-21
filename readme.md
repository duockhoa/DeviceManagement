# DK Request

Một ứng dụng web được phát triển bởi phòng ĐBCL Công ty CP Dược Khoa để quản lý các yêu cầu nội bộ.

## 📋 Mô tả

DK Request là một hệ thống quản lý yêu cầu nội bộ cho phép nhân viên gửi các loại đề nghị khác nhau như:
- Đề nghị thanh toán
- Đề nghị tạm ứng  
- Đề nghị xin nghỉ
- Đề nghị cung cấp văn phòng phẩm
- Và nhiều loại yêu cầu khác

## 🚀 Công nghệ sử dụng

- **Frontend**: React.js
- **UI Framework**: Material-UI (MUI)
- **State Management**: Redux Toolkit
- **Routing**: React Router
- **HTTP Client**: Axios (dự đoán)
- **Styling**: Emotion/styled-components

## 📁 Cấu trúc dự án

```
dkrequest/
├── public/                 # Static files
│   ├── index.html         # HTML template chính
│   ├── logo-2024.png      # Logo ứng dụng
│   └── manifest.json      # PWA manifest
├── src/
│   ├── App.js             # Component chính
│   ├── index.js           # Entry point
│   ├── theme.js           # Theme configuration
│   ├── components/        # Các component tái sử dụng
│   │   ├── Form/          # Các form component
│   │   ├── SharedComponent/ # Component dùng chung
│   │   └── ProfileComponent/ # Profile components
│   ├── hooks/             # Custom hooks
│   ├── Layouts/           # Layout components
│   ├── pages/             # Page components
│   ├── redux/             # Redux store và slices
│   ├── routes/            # Route configuration
│   ├── services/          # API services
│   └── utils/             # Utility functions
└── package.json
```

## 🛠️ Cài đặt và chạy dự án

### Yêu cầu hệ thống
- Node.js >= 14.0.0
- npm hoặc yarn

### Cài đặt dependencies
```bash
npm install
# hoặc
yarn install
```

### Chạy ở môi trường development
```bash
npm start
# hoặc  
yarn start
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

### Build cho production  
```bash
npm run build
# hoặc
yarn build
```

### Chạy tests
```bash
npm test
# hoặc
yarn test
```

## ✨ Tính năng chính

### 🔐 Xác thực và phân quyền
- Đăng nhập/đăng xuất
- Quản lý hồ sơ người dùng
- Đổi mật khẩu với validation mạnh

### 📋 Quản lý yêu cầu
- Tạo các loại yêu cầu khác nhau theo phòng ban
- Theo dõi trạng thái yêu cầu
- Lịch sử yêu cầu

### 🔔 Hệ thống thông báo
- Thông báo real-time
- Đánh dấu đã đọc/chưa đọc
- Điều hướng từ thông báo

### 📱 Responsive Design
- Tương thích với mobile và desktop
- Sidebar có thể thu gọn
- Adaptive UI components

## 🎨 Theme và Styling

Dự án sử dụng Material-UI với custom theme được định nghĩa trong [`src/theme.js`](src/theme.js). Các component được styled với sx prop và emotion.

## 🔧 Cấu hình

### Biến môi trường
Tạo file `.env` trong thư mục root:
```env
REACT_APP_API_URL=your_api_url
REACT_APP_VERSION=1.0.0
```

### VS Code Settings
Dự án đã được cấu hình với VS Code workspace settings trong [`.vscode/settings.json`](.vscode/settings.json).

## 📝 Scripts có sẵn

Trong thư mục dự án, bạn có thể chạy:

- `npm start` - Chạy ứng dụng ở chế độ development
- `npm test` - Chạy test suite
- `npm run build` - Build ứng dụng cho production
- `npm run eject` - Eject khỏi Create React App (không thể hoàn tác)

## 🐛 Debugging

### Development Tools
- React Developer Tools
- Redux DevTools Extension

### Logging
Sử dụng [`src/reportWebVitals.js`](src/reportWebVitals.js) để theo dõi performance metrics.

## 🤝 Đóng góp

Mọi góp ý và đề xuất xin gửi về:
- **Zalo**: 0965155761 (Bình ĐBCL)
- **Email**: [Thêm email nếu có]

## 📄 License

[Thêm thông tin license nếu có]

## 🏢 Về chúng tôi

Được phát triển bởi phòng Đảm bảo Chất lượng (ĐBCL)  
Công ty Cổ phần Dược Khoa

---

**Phiên bản hiện tại**: 1.0.0  
**Cập nhật lần cuối**: [Thêm ngày]