export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const SEARCH_CRITERIA_SENSOR_DATA_OPTIONS = [
    // { value: "name", label: "Theo Tên" },
    { value: "value", label: "Theo Giá trị" },
    { value: "time", label: "Theo Thời gian" },
];
export const SEARCH_CRITERIA_ACTION_HISTORY_OPTIONS = [
    // { label: "Theo Tên thiết bị", value: "device_name" },
    // { label: "Theo Trạng thái", value: "status" },
    // { label: "Theo Hành động", value: "action" },
    { label: "Theo Thời gian", value: "time" },
];
export const ACTION_HISTORY_STATUS_FILTER_OPTIONS = [
    { label: "Tất cả trạng thái", value: "all" },
    { label: "SUCCESS", value: "SUCCESS" },
    { label: "FAILED", value: "FAILED" },
    { label: "WAITING", value: "WAITING" },
    { label: "WARNING", value: "WARNING" },
];
export const ACTION_HISTORY_ACTION_FILTER_OPTIONS = [
    { label: "Tất cả hành động", value: "all" },
    { label: "TURN_ON", value: "ON" },
    { label: "TURN_OFF", value: "OFF" },
    { label: "WARNING", value: "WARNING" },
];
export const CHART_COLOR_PALETTE = [
    "#FFC107",
    "#4CAF50",
    "#2196F3",
    "#FF5252",
    "#AB47BC",
    "#00ACC1",
    "#FF7043",
    "#5C6BC0",
];
