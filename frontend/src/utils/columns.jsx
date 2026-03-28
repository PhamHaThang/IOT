import {
    Circle,
    Droplets,
    Fan,
    Settings,
    Sprout,
    Sun,
    Thermometer,
    Wind,
    Copy,
    Check,
} from "lucide-react";
import { useState } from "react";
const getDeviceIcon = (deviceType) => {
    const type = deviceType?.toLowerCase() || "";
    if (type.includes("pump"))
        return <Droplets size={16} className="text-blue-500" />;
    if (type.includes("light"))
        return <Sun size={16} className="text-yellow-500" />;
    if (type.includes("fan"))
        return <Fan size={16} className="text-green-500" />;
    if (type.includes("sprayer"))
        return <Wind size={16} className="text-teal-500" />;
    return <Settings size={16} className="text-gray-500" />;
};

const CopyableTime = ({ time }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (!time || time === "N/A") return;
        navigator.clipboard.writeText(time);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex items-center gap-2">
            <span className="text-gray-500 whitespace-nowrap">{time}</span>
            {time !== "N/A" && (
                <button
                    onClick={handleCopy}
                    className="p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors focus:outline-none"
                    title="Copy thời gian">
                    {copied ? (
                        <Check size={14} className="text-green-500" />
                    ) : (
                        <Copy size={14} />
                    )}
                </button>
            )}
        </div>
    );
};
const renderBadge = (text) => {
    const isSuccessOrOn = text === "ON" || text === "SUCCESS";
    const isWaiting = text === "WAITING";

    let colorClass = "bg-red-100 text-red-700 border-red-200"; // OFF/FAILED/TẮT

    if (isSuccessOrOn)
        colorClass = "bg-green-100 text-green-700 border-green-200";
    else if (isWaiting)
        colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";

    return (
        <span
            className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colorClass}`}>
            {text}
        </span>
    );
};
const getSensorIcon = (type) => {
    switch (type) {
        case "temp":
            return <Thermometer size={16} className="text-alert" />;
        case "humid":
            return <Droplets size={16} className="text-sky-500" />;
        case "soil":
            return <Sprout size={16} className="text-green-500" />;
        case "light":
            return <Sun size={16} className="text-warning  " />;
        default:
            return <Circle size={16} className="text-gray-400" />;
    }
};
const COLUMNS_SENSOR_DATA = [
    {
        header: "ID",
        accessor: "id",
        sortable: true,
        render: (row) => <span>{row.id}</span>,
    },
    {
        header: "Sensor Name",
        accessor: "sensor_name",
        sortable: true,
        render: (row) => {
            const type = row.type?.toLowerCase() || "";
            return (
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-gray-100 text-gray-500">
                        {getSensorIcon(type)}
                    </div>
                    <span className="font-medium text-gray-900">
                        {row.sensor_name || "Unknown Sensor"}
                    </span>
                </div>
            );
        },
    },
    {
        header: "Value",
        accessor: "value",
        sortable: true,
        render: (row) => (
            <span className="font-bold text-gray-800 text-base">
                {row.value?.toFixed(1) || "N/A"}
            </span>
        ),
    },
    {
        header: "Unit",
        accessor: "unit",
        sortable: false,
        render: (row) => <span>{row.unit || "unit"}</span>,
    },
    {
        header: "Time",
        accessor: "time",
        sortable: true,
        render: (row) => <CopyableTime time={row.created_at || "N/A"} />,
    },
];
const COLUMNS_ACTION_HISTORY = [
    {
        header: "TIME",
        accessor: "time",
        sortable: true,
        render: (row) => <CopyableTime time={row.created_at || "N/A"} />,
    },
    {
        header: "ID",
        accessor: "id",
        sortable: true,
        render: (row) => <span>{row.id}</span>,
    },
    {
        header: "Device Name",
        accessor: "device_name",
        sortable: true,
        render: (row) => (
            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-full bg-gray-100 text-gray-500">
                    {getDeviceIcon(row.device_type)}
                </div>
                <span className="font-medium text-gray-900">
                    {row.device_name}
                </span>
            </div>
        ),
    },
    {
        header: "Action",
        accessor: "action",
        sortable: true,
        render: (row) => renderBadge(row.action),
    },
    {
        header: "Status",
        accessor: "status",
        sortable: true,
        render: (row) => renderBadge(row.status),
    },
];

export { COLUMNS_SENSOR_DATA, COLUMNS_ACTION_HISTORY };
