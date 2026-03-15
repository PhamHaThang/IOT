export const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
export const SEARCH_CRITERIA_SENSOR_DATA_OPTIONS = [
    { value: "name", label: "Theo Tên" },
    { value: "value", label: "Theo Giá trị" },
    { value: "time", label: "Theo Thời gian" },
];
export const SEARCH_CRITERIA_ACTION_HISTORY_OPTIONS = [
    { label: "Theo Tên thiết bị", value: "device_name" },
    { label: "Theo Trạng thái", value: "status" },
    { label: "Theo Hành động", value: "action" },
    { label: "Theo Thời gian", value: "time" },
];
export const CHART_COLOR_PALETTE = [
    "#FF5252",
    "#2196F3",
    "#FFC107",
    "#4CAF50",
    "#AB47BC",
    "#00ACC1",
    "#FF7043",
    "#5C6BC0",
];
