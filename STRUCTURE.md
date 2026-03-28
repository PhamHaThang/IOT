# Cấu trúc dự án IOT

Dự án được chia làm 2 hệ thống độc lập: **Backend** (NodeJS cung cấp Data API và kết nối thiết bị IoT qua giao thức MQTT) và **Frontend** (Sử dụng React/Vite xây dựng Giao diện Web).

---

## 1. Cấu trúc Backend

```text
backend/
├── .env                         # Khai báo các biến môi trường bảo mật (Database URI, MQTT broker...)
├── .env.example                 # Mẫu chứa các tham số yêu cầu (không chứa key mật)
├── config/                      # Thư mục thiết lập hệ thống/môi trường ngoài
│   ├── db.js                    # Kết nối thao tác với cơ sở dữ liệu (Database) 
│   └── swagger.js               # Khởi tạo giao diện Swagger để đọc API Docs
├── controllers/                 # Bộ điều khiển (xử lý logic cho từng nghiệp vụ Request/Response)
│   ├── ActivityLogController.js # Logic lịch sử thao tác bật/tắt thiết bị
│   ├── DashboardController.js   # Cung cấp tổng hợp số liệu cho trang Dashboard UI
│   ├── DeviceController.js      # Điều khiển các cụm chức năng (Bóng đèn, quạt...)
│   ├── SensorController.js      # Cung cấp/Cập nhật danh sách cảm biến  
│   └── SensorDataController.js  # Truất xuất/Lọc dữ liệu lịch sử giá trị từ cảm biến
├── models/                      # Định nghĩa Models/Schemas cấu trúc Cơ Sở Dữ Liệu
│   ├── ActivityLogModel.js      
│   ├── DeviceModel.js          
│   ├── SensorDataModel.js      
│   └── SensorModel.js          
├── postman/                     # Thư mục tiện ích chứa file API export
│   └── IOT API.postman_collection.json # Có thể import trực tiếp vào Postman test
├── routes/                      # Định tuyến (Routing các URL endpoint API trỏ về đúng Controllers)
│   └── index.js
├── server.js                    # **Tệp Entry Point**: File gốc khởi chạy Backend Web server (Express)
├── services/                    # Nơi chứa các tác vụ chạy ngầm/mở rộng logic chuyên biệt
│   └── mqttService.js           # Xử lý kết nối lắng nghe và nhận Data từ thiết bị thực qua giao thức MQTT
└── utils/                       # Hàm dùng chung cho các bộ controller
    └── constant.js
```

---

## 2. Cấu trúc Frontend

```text
frontend/
├── .env                         # Biến cấu hình (VD: Link public của API backend)
├── eslint.config.js             # Cấu hình công cụ kiểm lỗi và làm sạch code ESLint
├── index.html                   # Giao diện gốc chứa Root div của ứng dụng React
├── public/                      # Resource file dạng tĩnh (Ảnh, Icon web,... không biên dịch lại)
├── src/                         # Không gian làm việc, chứa toàn bộ thư mục Mã Nguồn 
│   ├── App.jsx                  # Điểm xuất phát của React Component chứa các Routes lớn
│   ├── assets/                  # Ảnh/icon tĩnh có thể import thẳng vào Javascript
│   ├── components/              # Các Component dùng chung hoặc chuyên biệt cắt nhỏ để dễ gỡ lỗi
│   │   ├── Dashboard/           # Chỉ dùng ở trang Dashboard chủ chứa nhiều logic phức tạp
│   │   │   ├── DeviceCard.jsx   # Khối thẻ hiện trạng thái thiết bị 
│   │   │   ├── SensorCard.jsx   # Khối thẻ các số đỏ cảm biến nhỏ (có màu progress chạy)
│   │   │   └── SensorDataChart... # Biểu đồ vẽ đường biến thiên số liệu 
│   │   ├── Layout/              # Thư mục dựng bộ khung Web ngoài cùng 
│   │   │   ├── MainLayout.jsx   
│   │   │   ├── Sidebar.jsx      # Thiết kế thanh menu cố định bên trái
│   │   │   └── Topbar.jsx       # Thanh Header ở trên cùng
│   │   └── Shared/              # Các UI Component cơ bản (Bộ Filter, Data Table, Loadings..)
│   ├── hooks/                   # Custom Hooks tái sử dụng 
│   │   └── useDebounce.js       # Hook trì hoãn request (Thường áp dụng trong tính năng tìm kiếm gõ phím)
│   ├── index.css                # Tệp CSS nhúng gốc (đã được cấu hình nhúng TailwindCSS)
│   ├── main.jsx                 # **Tệp Entry point React** mount toàn bộ App UI lên file HTML vĩnh viễn
│   ├── pages/                   # Thư mục tổng hợp của các màn hình tương ứng URL
│   │   ├── ActionHistoryPage.jsx# Màn hình cho trang hiển thị bảng Lịch sử Nhấn Bật/Tắt thiết bị 
│   │   ├── DashboardPage.jsx    # Màn hình trang chủ 
│   │   ├── ProfilePage.jsx      # Màn hình người dùng (CV)
│   │   └── SensorDataPage.jsx   # Màn hình tra cứu bảng lịch sử số liệu cảm biến (Nhiệt/Độ ẩm...)
│   ├── services/                # Các thư viện Axios call API gọi điện đến Backend
│   └── utils/                   # Các thư viện/hàm nhỏ gọn (Ví dụ utils.js vẽ biểu đồ, render cột)
└── vite.config.js               # File cấu hình Server chạy Node nội bộ từ Vite (cho hot-reload, port)
```
