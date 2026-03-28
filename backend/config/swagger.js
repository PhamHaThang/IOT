/**
 * Swagger Configuration for IoT Backend API
 * Based on Postman Collection: IOT API
 */

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "IoT Management API",
        version: "1.0.0",
        description:
            "API documentation for IoT Garden Management System\n\nHệ thống quản lý vườn thông minh với khả năng điều khiển thiết bị và theo dõi dữ liệu cảm biến\n\n**Ghi chú:**\n+ Sensor IDs có tiền tố S-...\n+ Device IDs có tiền tố D-...\n+ SensorData IDs có tiền tố SD-... \n+ ActivityLog IDs có tiền tố AH-...\n+ Điều khiển thiết bị có thể trả về lỗi 504 khi thời gian phản hồi MQTT hết hạn",
        contact: {
            name: "API Support",
            url: "http://localhost:5000",
        },
    },
    servers: [
        {
            url: "http://localhost:5000/api",
            description: "Development Server",
        },
    ],
    tags: [
        {
            name: "Dashboard",
            description: "Dashboard data aggregation endpoints",
        },
        {
            name: "Devices",
            description: "Device management and control endpoints",
        },
        {
            name: "Sensors",
            description: "Sensor information endpoints",
        },
        {
            name: "Sensor Data",
            description: "Sensor data retrieval and filtering",
        },
        {
            name: "Activity Logs",
            description: "Activity log management and retrieval",
        },
    ],
    paths: {
        "/dashboard/data": {
            get: {
                tags: ["Dashboard"],
                summary: "Get Dashboard Data",
                description:
                    "Lấy toàn bộ dữ liệu cần thiết để vẽ màn hình Dashboard (thẻ thông số, dữ liệu biểu đồ, trạng thái thiết bị)",
                operationId: "getDashboardData",
                responses: {
                    200: {
                        description: "Successfully retrieved dashboard data",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DashboardResponse",
                                },
                                example: {
                                    sensorData: [
                                        {
                                            name: "Nhiệt độ",
                                            unit: "°C",
                                            type: "temp",
                                            value: 29.2,
                                            created_at:
                                                "2026-03-18T02:00:00.000Z",
                                        },
                                    ],
                                    devices: [
                                        {
                                            id: "D001",
                                            name: "Đèn",
                                            type: "light",
                                            status: "ON",
                                        },
                                    ],
                                    chartData: [
                                        {
                                            type: "temp",
                                            value: 29.2,
                                            created_at:
                                                "2026-03-18T01:59:55.000Z",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/devices": {
            get: {
                tags: ["Devices"],
                summary: "Get All Devices",
                description:
                    "Lấy danh sách thiết bị động, phục vụ cho việc render bộ lọc bên trang Lịch sử hoạt động",
                operationId: "getAllDevices",
                responses: {
                    200: {
                        description: "Successfully retrieved all devices",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Device",
                                    },
                                    example: [
                                        {
                                            id: "D001",
                                            name: "Đèn chiếu sáng",
                                            type: "light",
                                            status: "ON",
                                        },
                                        {
                                            id: "D002",
                                            name: "Máy bơm nước",
                                            type: "pump",
                                            status: "ON",
                                        },
                                        {
                                            id: "D003",
                                            name: "Máy phun sương",
                                            type: "sprayer",
                                            status: "ON",
                                        },
                                        {
                                            id: "D004",
                                            name: "Quạt thông gió",
                                            type: "fan",
                                            status: "ON",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/devices/control": {
            post: {
                tags: ["Devices"],
                summary: "Control Device",
                description:
                    "Nhận lệnh bật/tắt thiết bị từ Frontend, giao tiếp với ESP32 qua MQTT và đợi phản hồi với cơ chế Timeout 10 giây\n\nBody:\n- device_id: Device ID\n- action: ON | OFF",
                operationId: "controlDevice",
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/DeviceControlRequest",
                            },
                            example: {
                                device_id: "DVC-001",
                                action: "ON",
                            },
                        },
                    },
                },
                responses: {
                    200: {
                        description:
                            "Device control command executed successfully",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DeviceControlSuccessResponse",
                                },
                                example: {
                                    message: "Đã bật Đèn thành công",
                                    device_id: "D-001",
                                    action: "ON",
                                    success: "SUCCESS",
                                },
                            },
                        },
                    },
                    504: {
                        description: "MQTT Timeout - No response from device",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/DeviceControlFailureResponse",
                                },
                                example: {
                                    message:
                                        "Không nhận được phản hồi từ thiết bị (MQTT Timeout)",
                                    device_id: "D-001",
                                    action: "ON",
                                    success: "FAILED",
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/sensors": {
            get: {
                tags: ["Sensors"],
                summary: "Get All Sensors",
                description:
                    "Lấy danh sách cảm biến động, phục vụ cho việc render bộ lọc bên trang Sensor Data",
                operationId: "getAllSensors",
                responses: {
                    200: {
                        description: "Successfully retrieved all sensors",
                        content: {
                            "application/json": {
                                schema: {
                                    type: "array",
                                    items: {
                                        $ref: "#/components/schemas/Sensor",
                                    },
                                    example: [
                                        {
                                            id: "S001",
                                            name: "Ánh sáng",
                                            unit: "%",
                                            type: "light",
                                            slug: "anh-sang",
                                            created_at:
                                                "2026-03-15T08:50:12.702Z",
                                        },
                                        {
                                            id: "S002",
                                            name: "Độ ẩm đất",
                                            unit: "%",
                                            type: "soil",
                                            slug: "do-am-dat",
                                            created_at:
                                                "2026-03-15T08:50:12.702Z",
                                        },
                                        {
                                            id: "S003",
                                            name: "Độ ẩm không khí",
                                            unit: "%",
                                            type: "humid",
                                            slug: "do-am-khong-khi",
                                            created_at:
                                                "2026-03-15T08:50:12.702Z",
                                        },
                                        {
                                            id: "S004",
                                            name: "Nhiệt độ",
                                            unit: "°C",
                                            type: "temp",
                                            slug: "nhiet-do",
                                            created_at:
                                                "2026-03-15T08:50:12.702Z",
                                        },
                                    ],
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/sensor-datas": {
            get: {
                tags: ["Sensor Data"],
                summary: "Get Sensor Data",
                description:
                    "Lấy danh sách dữ liệu cảm biến có hỗ trợ phân trang, tìm kiếm, lọc và sắp xếp",
                operationId: "getAllSensorData",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Số trang hiện tại",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 1,
                            minimum: 1,
                        },
                    },
                    {
                        name: "limit",
                        in: "query",
                        description: "Số bản ghi trên 1 trang",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 10,
                            minimum: 1,
                            maximum: 100,
                        },
                    },
                    {
                        name: "keyword",
                        in: "query",
                        description: "Từ khóa tìm kiếm",
                        required: false,
                        schema: {
                            type: "string",
                        },
                    },
                    {
                        name: "searchBy",
                        in: "query",
                        description:
                            "Tiêu chí tìm kiếm (name, value, time, created_at)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["name", "value", "time", "created_at"],
                            default: "name",
                        },
                    },
                    {
                        name: "filterBy",
                        in: "query",
                        description:
                            "Lọc theo loại cảm biến (all, temp, humid, light, soil)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["all", "temp", "humid", "light", "soil"],
                            default: "all",
                        },
                    },
                    {
                        name: "sortBy",
                        in: "query",
                        description: "Cột cần sắp xếp (id, name, value, time)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["id", "name", "value", "time"],
                            default: "time",
                        },
                    },
                    {
                        name: "sortOrder",
                        in: "query",
                        description: "Chiều sắp xếp (ASC, DESC)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["ASC", "DESC"],
                            default: "DESC",
                        },
                    },
                ],
                responses: {
                    200: {
                        description:
                            "Successfully retrieved sensor data with pagination info",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/SensorDataPaginatedResponse",
                                },
                                example: {
                                    data: [
                                        {
                                            id: "SD-5ab309e2-48f2-47cb-97fd-b8f61fe1fb2a",
                                            sensor_name: "Nhiệt độ",
                                            type: "temp",
                                            value: 29.2,
                                            unit: "°C",
                                            created_at: "2026-03-18 09:56:44",
                                        },
                                    ],
                                    total: 450,
                                    currentPage: 1,
                                    totalPages: 45,
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
        "/activity-logs": {
            get: {
                tags: ["Activity Logs"],
                summary: "Get Activity Logs",
                description:
                    "Lấy danh sách lịch sử bật/tắt thiết bị có hỗ trợ phân trang, tìm kiếm, lọc và sắp xếp",
                operationId: "getActivityLogs",
                parameters: [
                    {
                        name: "page",
                        in: "query",
                        description: "Số trang hiện tại",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 1,
                            minimum: 1,
                        },
                    },
                    {
                        name: "limit",
                        in: "query",
                        description: "Số bản ghi trên 1 trang",
                        required: false,
                        schema: {
                            type: "integer",
                            default: 10,
                            minimum: 1,
                            maximum: 100,
                        },
                    },
                    {
                        name: "keyword",
                        in: "query",
                        description: "Từ khóa tìm kiếm",
                        required: false,
                        schema: {
                            type: "string",
                        },
                    },
                    {
                        name: "searchBy",
                        in: "query",
                        description:
                            "Tiêu chí tìm kiếm (device_name, status, action, time)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["device_name", "status", "action", "time"],
                            default: "device_name",
                        },
                    },
                    {
                        name: "filterBy",
                        in: "query",
                        description:
                            "Lọc theo loại thiết bị (all, fan, sprayer, light, pump)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["all", "fan", "sprayer", "light", "pump"],
                            default: "all",
                        },
                    },
                    {
                        name: "sortBy",
                        in: "query",
                        description: "Cột cần sắp xếp (id, device_name, time)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["id", "device_name", "time"],
                            default: "time",
                        },
                    },
                    {
                        name: "sortOrder",
                        in: "query",
                        description: "Chiều sắp xếp (ASC, DESC)",
                        required: false,
                        schema: {
                            type: "string",
                            enum: ["ASC", "DESC"],
                            default: "DESC",
                        },
                    },
                ],
                responses: {
                    200: {
                        description:
                            "Successfully retrieved activity logs with pagination info",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/ActivityLogPaginatedResponse",
                                },
                                example: {
                                    data: [
                                        {
                                            id: "AH-efaf5e31-5c57-4de8-94ce-4f39e6ec70f6",
                                            device_name: "Đèn",
                                            device_type: "light",
                                            action: "ON",
                                            status: "SUCCESS",
                                            created_at: "2026-03-18 09:55:03",
                                        },
                                    ],
                                    total: 120,
                                    currentPage: 1,
                                    totalPages: 12,
                                },
                            },
                        },
                    },
                    500: {
                        description: "Server error",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/components/schemas/Error",
                                },
                            },
                        },
                    },
                },
            },
        },
    },
    components: {
        schemas: {
            Device: {
                type: "object",
                description: "Thiết bị trong hệ thống IoT",
                properties: {
                    id: {
                        type: "string",
                        description: "ID của thiết bị (VD: D001, D002)",
                    },
                    name: {
                        type: "string",
                        description: "Tên thiết bị",
                    },
                    type: {
                        type: "string",
                        enum: ["light", "pump", "sprayer", "fan"],
                        description: "Loại thiết bị",
                    },
                    status: {
                        type: "string",
                        enum: ["ON", "OFF"],
                        description: "Trạng thái hiện tại của thiết bị",
                    },
                },
                required: ["id", "name", "type", "status"],
            },
            Sensor: {
                type: "object",
                description: "Cảm biến trong hệ thống IoT",
                properties: {
                    id: {
                        type: "string",
                        description: "ID của cảm biến (VD: S001, S002)",
                    },
                    name: {
                        type: "string",
                        description: "Tên cảm biến",
                    },
                    type: {
                        type: "string",
                        enum: ["temp", "humid", "light", "soil"],
                        description: "Loại cảm biến",
                    },
                    unit: {
                        type: "string",
                        description: "Đơn vị đo lường (VD: °C, %)",
                    },
                    slug: {
                        type: "string",
                        description: "URL-friendly tên cảm biến",
                    },
                    created_at: {
                        type: "string",
                        format: "date-time",
                        description: "Thời gian tạo",
                    },
                },
                required: ["id", "name", "type", "unit"],
            },
            SensorDataItem: {
                type: "object",
                description: "Dữ liệu từ một cảm biến",
                properties: {
                    id: {
                        type: "string",
                        description: "ID của dữ liệu cảm biến",
                    },
                    sensor_name: {
                        type: "string",
                        description: "Tên cảm biến",
                    },
                    type: {
                        type: "string",
                        enum: ["temp", "humid", "light", "soil"],
                        description: "Loại cảm biến",
                    },
                    value: {
                        type: "number",
                        description: "Giá trị đo được",
                    },
                    unit: {
                        type: "string",
                        description: "Đơn vị đo lường",
                    },
                    created_at: {
                        type: "string",
                        description: "Thời gian ghi nhận dữ liệu",
                    },
                },
                required: [
                    "id",
                    "sensor_name",
                    "type",
                    "value",
                    "unit",
                    "created_at",
                ],
            },
            SensorDataPaginatedResponse: {
                type: "object",
                description: "Danh sách dữ liệu cảm biến có phân trang",
                properties: {
                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/SensorDataItem",
                        },
                    },
                    total: {
                        type: "integer",
                        description: "Tổng số bản ghi",
                    },
                    currentPage: {
                        type: "integer",
                        description: "Trang hiện tại",
                    },
                    totalPages: {
                        type: "integer",
                        description: "Tổng số trang",
                    },
                },
                required: ["data", "total", "currentPage", "totalPages"],
            },
            ActivityLogItem: {
                type: "object",
                description: "Mục lịch sử hoạt động",
                properties: {
                    id: {
                        type: "string",
                        description: "ID của lịch sử hoạt động",
                    },
                    device_name: {
                        type: "string",
                        description: "Tên thiết bị",
                    },
                    device_type: {
                        type: "string",
                        enum: ["light", "pump", "sprayer", "fan"],
                        description: "Loại thiết bị",
                    },
                    action: {
                        type: "string",
                        enum: ["ON", "OFF"],
                        description: "Hành động được thực hiện",
                    },
                    status: {
                        type: "string",
                        enum: ["WAITING", "SUCCESS", "FAILED"],
                        description: "Trạng thái thực hiện",
                    },
                    created_at: {
                        type: "string",
                        description: "Thời gian thực hiện hành động",
                    },
                },
                required: [
                    "id",
                    "device_name",
                    "device_type",
                    "action",
                    "status",
                    "created_at",
                ],
            },
            ActivityLogPaginatedResponse: {
                type: "object",
                description: "Danh sách lịch sử hoạt động có phân trang",
                properties: {
                    data: {
                        type: "array",
                        items: {
                            $ref: "#/components/schemas/ActivityLogItem",
                        },
                    },
                    total: {
                        type: "integer",
                        description: "Tổng số bản ghi",
                    },
                    currentPage: {
                        type: "integer",
                        description: "Trang hiện tại",
                    },
                    totalPages: {
                        type: "integer",
                        description: "Tổng số trang",
                    },
                },
                required: ["data", "total", "currentPage", "totalPages"],
            },
            DashboardResponse: {
                type: "object",
                description: "Dữ liệu Dashboard",
                properties: {
                    sensorData: {
                        type: "array",
                        description: "Dữ liệu cảm biến mới nhất",
                        items: {
                            type: "object",
                            properties: {
                                name: { type: "string" },
                                unit: { type: "string" },
                                type: { type: "string" },
                                value: { type: "number" },
                                created_at: { type: "string" },
                            },
                        },
                    },
                    devices: {
                        type: "array",
                        description: "Danh sách thiết bị",
                        items: {
                            $ref: "#/components/schemas/Device",
                        },
                    },
                    chartData: {
                        type: "array",
                        description: "Dữ liệu biểu đồ cảm biến",
                        items: {
                            type: "object",
                            properties: {
                                type: { type: "string" },
                                value: { type: "number" },
                                created_at: { type: "string" },
                            },
                        },
                    },
                },
            },
            DeviceControlRequest: {
                type: "object",
                description: "Yêu cầu điều khiển thiết bị",
                properties: {
                    device_id: {
                        type: "string",
                        description: "ID của thiết bị cần điều khiển",
                    },
                    action: {
                        type: "string",
                        enum: ["ON", "OFF"],
                        description: "Hành động điều khiển",
                    },
                },
                required: ["device_id", "action"],
            },
            DeviceControlSuccessResponse: {
                type: "object",
                description: "Phản hồi thành công khi điều khiển thiết bị",
                properties: {
                    message: {
                        type: "string",
                        description: "Thông báo thành công",
                    },
                    device_id: {
                        type: "string",
                        description: "ID của thiết bị đã điều khiển",
                    },
                    action: {
                        type: "string",
                        enum: ["ON", "OFF"],
                    },
                    success: {
                        type: "string",
                        enum: ["SUCCESS"],
                    },
                },
            },
            DeviceControlFailureResponse: {
                type: "object",
                description: "Phản hồi thất bại khi điều khiển thiết bị",
                properties: {
                    message: {
                        type: "string",
                        description: "Thông báo lỗi",
                    },
                    device_id: {
                        type: "string",
                    },
                    action: {
                        type: "string",
                        enum: ["ON", "OFF"],
                    },
                    success: {
                        type: "string",
                        enum: ["FAILED"],
                    },
                },
            },
            Error: {
                type: "object",
                description: "Lỗi chuẩn",
                properties: {
                    error: {
                        type: "string",
                        description: "Thông báo lỗi",
                    },
                    message: {
                        type: "string",
                        description: "Mô tả lỗi chi tiết",
                    },
                },
            },
        },
    },
};

module.exports = swaggerDefinition;
