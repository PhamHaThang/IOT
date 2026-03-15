# Smart Garden - Hệ thống Quản lý Thiết bị IoT cho Vườn Thông Minh

Dự án "Xây dựng hệ thống quản lý thiết bị IoT cho vườn thông minh" là một giải pháp toàn diện giúp giám sát và điều khiển tự động các yếu tố môi trường nông nghiệp. Hệ thống được xây dựng với kiến trúc **PERN Stack** kết hợp giao thức **MQTT**, đảm bảo tính thời gian thực (real-time), hiệu năng cao và giao diện người dùng trực quan.

**Môn học:** Phát triển ứng dụng IoT - Học viện Công nghệ Bưu chính Viễn thông (PTIT)
**Sinh viên thực hiện:** Phạm Hà Thắng (B22DCPT261)
**Giảng viên hướng dẫn:** TS. Nguyễn Quốc Uy

---

## Tính năng nổi bật

### 1. Dashboard (Bảng điều khiển)

- **Giám sát thời gian thực:** Cập nhật liên tục dữ liệu từ 4 loại cảm biến (Nhiệt độ, Độ ẩm không khí, Độ ẩm đất, Cường độ ánh sáng) mỗi 2 giây.
- **Biểu đồ trực quan:** Vẽ biểu đồ đường (Line Chart) theo dõi xu hướng biến đổi môi trường theo thời gian.
- **Điều khiển thiết bị:** Bật/tắt trực tiếp các thiết bị (Máy bơm, Quạt, Đèn, Phun sương) với cơ chế đồng bộ trạng thái và xử lý Timeout 10s (chống spam thao tác).

### 2. Sensor Data (Dữ liệu cảm biến)

- Lưu trữ toàn bộ lịch sử đo lường của các cảm biến.
- Hỗ trợ **Phân trang (Pagination)** tối ưu khi dữ liệu lớn.
- Tính năng **Lọc (Filter)** theo loại cảm biến.
- Tích hợp **Tìm kiếm thông minh (Debounce Search)** theo Tên, Giá trị, Thời gian mà không làm giật lag máy chủ.
- Sắp xếp (Sort) linh hoạt theo từng cột (Tăng/Giảm dần).

### 3. Action History (Lịch sử hoạt động)

- Ghi log (nhật ký) chi tiết mọi thao tác điều khiển thiết bị (BẬT/TẮT) và trạng thái (ĐANG CHỜ, THÀNH CÔNG, THẤT BẠI).
- Giao diện tra cứu mạnh mẽ tương tự trang Sensor Data.

### 4. Profile (Trang cá nhân)

- Hiển thị thông tin định danh sinh viên.
- Chứa các liên kết nhanh đến Báo cáo PDF, Figma Design, mã nguồn GitHub và tài liệu API.

---

## Công nghệ sử dụng

Hệ thống được thiết kế theo mô hình Client-Server hiện đại, phân tách rõ ràng Frontend và Backend.

**1. Frontend:**

- **Core:** ReactJS (khởi tạo bằng Vite cho tốc độ build siêu nhanh).
- **Styling:** TailwindCSS (thiết kế UI Pixel-Perfect).
- **Libraries:** React Router DOM (điều hướng), Axios (gọi RESTful API), Recharts (vẽ biểu đồ), Lucide React & React Icons (icon).
- **UX/UI:** Tích hợp Custom Hooks (`useDebounce`) để tối ưu hiệu năng.

**2. Backend:**

- **Core:** Node.js & Express.js (kiến trúc Router - Controller - Model).
- **Database:** PostgreSQL (tích hợp Indexing & Query Builder để xử lý hàng triệu bản ghi time-series).
- **IoT Communication:** Thư viện `mqtt` để giao tiếp 2 chiều với ESP32.

**3. Phần cứng (Hardware):**

- Vi điều khiển ESP32.
- Cảm biến: DHT11/DHT22, Cảm biến độ ẩm đất, Quang trở.
- Giao thức: MQTT (Message Queuing Telemetry Transport).

---

## Hướng dẫn cài đặt và khởi chạy

Để chạy dự án này trên máy tính cá nhân, bạn cần cài đặt sẵn **Node.js** và **PostgreSQL**.

### Bước 1: Khởi tạo Cơ sở dữ liệu (Database)

1. Mở PostgreSQL (pgAdmin/DBeaver) và tạo một database mới, ví dụ: `iot_db`.
2. Chạy đoạn script SQL để tạo các bảng (`Sensor`, `Device`, `SensorData`, `ActivityLog`) và thiết lập các `INDEX` tối ưu truy vấn.

```sql
-- 1. Bảng Sensor (Cảm biến)
CREATE TABLE Sensor (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Device (Thiết bị điều khiển)
CREATE TABLE Device (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng SensorData (Dữ liệu cảm biến)
CREATE TABLE SensorData (
    id VARCHAR(255) PRIMARY KEY,
    sensor_id VARCHAR(255) NOT NULL REFERENCES Sensor(id) ON DELETE CASCADE,
    value FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng ActivityLog (Lịch sử hoạt động của thiết bị)
CREATE TABLE ActivityLog (
    id VARCHAR(255) PRIMARY KEY,
    device_id VARCHAR(255) NOT NULL REFERENCES Device(id) ON DELETE CASCADE,
    action VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE EXTENSION IF NOT EXISTS unaccent;
-- ============================= INDEX ====================================
-- 1. INDEX CHO BẢNG SENSORDATA (Bảng dữ liệu phình to nhanh nhất)

-- Tối ưu cho việc JOIN và lọc theo cảm biến (VD: filterBy = 'temp')
CREATE INDEX idx_sensordata_sensor_id ON SensorData(sensor_id);

-- Tối ưu cho việc sắp xếp theo thời gian mới nhất trên trang Lịch sử
CREATE INDEX idx_sensordata_created_at ON SensorData(created_at DESC);

-- Composite Index (Index kép) -> "Vũ khí tối thượng" cho query Dashboard
-- (Giúp tìm ra ngay bản ghi mới nhất của từng cảm biến mà không cần quét nhiều)
CREATE INDEX idx_sensordata_sensor_time ON SensorData(sensor_id, created_at DESC);


-- 2. INDEX CHO BẢNG ACTIVITYLOG (Bảng lịch sử thiết bị)

-- Tối ưu cho việc lọc theo thiết bị trên trang Action History
CREATE INDEX idx_activitylog_device_id ON ActivityLog(device_id);

-- Tối ưu cho việc sắp xếp thời gian (Sort by Time)
CREATE INDEX idx_activitylog_created_at ON ActivityLog(created_at DESC);

-- 3. INDEX CHO TÌM KIẾM (Optional nhưng rất khuyên dùng)
CREATE EXTENSION IF NOT EXISTS pg_trgm; -- Bật extension hỗ trợ tìm kiếm text nhanh của Postgres

CREATE INDEX idx_sensor_name_trgm ON Sensor USING gin (name gin_trgm_ops);
CREATE INDEX idx_device_name_trgm ON Device USING gin (name gin_trgm_ops);
```

### Bước 2: Thiết lập Backend

```bash
# Di chuyển vào thư mục backend
cd iot

# Cài đặt thư viện
npm install

# Tạo file .env và cấu hình (Xem mẫu bên dưới)
cp .env.example .env

# Khởi chạy server Backend (Mặc định chạy ở cổng 5000)
npm run dev
```

**Cấu hình file .env cho Backend:**

```
PORT=5000
DB_USER=postgres
DB_PASSWORD=your_db_password
DB_HOST=localhost
DB_PORT=5432
DB_NAME=smart_garden_db
MQTT_BROKER_URL=mqtt://broker.emqx.io:1883
```

### Bước 3: Thiết lập Frontend

Mở một cửa sổ Terminal mới:

```bash
# Di chuyển vào thư mục frontend
cd smart-garden-frontend

# Cài đặt thư viện
npm install

# Khởi chạy ứng dụng React (Mặc định chạy ở cổng 5173)
npm run dev
```

Truy cập ứng dụng tại: http://localhost:5173
