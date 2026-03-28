-- 0. Tạo các bộ đếm (Sequence) tự động tăng
CREATE SEQUENCE IF NOT EXISTS seq_sensor START 1;
CREATE SEQUENCE IF NOT EXISTS seq_device START 1;
CREATE SEQUENCE IF NOT EXISTS seq_sensordata START 1;
CREATE SEQUENCE IF NOT EXISTS seq_activitylog START 1;
-- 1. Bảng Sensor (Cảm biến)
CREATE TABLE IF NOT EXISTS Sensor (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'S' || to_char(nextval('seq_sensor'), 'FM000'),
    name VARCHAR(255) NOT NULL,
    unit VARCHAR(255) NOT NULL, 
    type VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Bảng Device (Thiết bị điều khiển)
CREATE TABLE IF NOT EXISTS Device (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'D' || to_char(nextval('seq_device'), 'FM000'),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Bảng SensorData (Dữ liệu cảm biến)
CREATE TABLE IF NOT EXISTS SensorData (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'SD' || to_char(nextval('seq_sensordata'), 'FM000000'),
    sensor_id VARCHAR(255) NOT NULL REFERENCES Sensor(id) ON DELETE CASCADE,
    value FLOAT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bảng ActivityLog (Lịch sử hoạt động của thiết bị)
CREATE TABLE IF NOT EXISTS ActivityLog (
    id VARCHAR(255) PRIMARY KEY DEFAULT 'AH' || to_char(nextval('seq_activitylog'), 'FM000000'),
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
-- =================================================================

INSERT INTO SENSOR (name, unit, type, slug) VALUES
('Ánh sáng','%','light','anh-sang'),
('Độ ẩm đất','%','soil','do-am-dat'),
('Độ ẩm không khí','%','humid','do-am-khong-khi'),
('Nhiệt độ','°C','temp','nhiet-do');

INSERT INTO DEVICE (name, type, slug,status) VALUES
('Đèn chiếu sáng','light','den-chieu-sang','OFF'),
('Máy bơm nước','pump','may-bom-nuoc','OFF'),
('Máy phun sương','sprayer','may-phun-suong','OFF'),
('Quạt thông gió','fan','quat-thong-gio','OFF');

INSERT INTO SensorData (sensor_id, value, created_at)
SELECT
    s.sensor_id,
    random() * 100 AS value,
    NOW() - INTERVAL '10 minutes' + (g * INTERVAL '2 seconds') AS created_at
FROM generate_series(0, 20) g
CROSS JOIN (
    VALUES ('S001'), ('S002'), ('S003'), ('S004')
) AS s(sensor_id);

INSERT INTO ActivityLog (device_id, action, status, created_at)
SELECT 
    (ARRAY['D001','D002','D003','D004'])[floor(random()*4)+1],
    (ARRAY['ON','OFF'])[floor(random()*2)+1],
    (ARRAY['SUCCESS','FAILED','WAITING'])[floor(random()*3)+1],
    NOW() - (random() * interval '10 days')
FROM generate_series(1,80);

SELECT * FROM SENSOR;
