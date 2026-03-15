import { useMemo, useState } from "react";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

const SERIES_CONFIG = {
    temp: {
        name: "Nhiệt độ (°C)",
        stroke: "#FF5252",
        fill: "url(#colorTemp)",
    },
    humid: {
        name: "Độ ẩm không khí (%)",
        stroke: "#2196F3",
        fill: "url(#colorHum)",
    },
    light: {
        name: "Ánh sáng (Lux)",
        stroke: "#FFC107",
        fill: "url(#colorLight)",
    },
    soil: {
        name: "Độ ẩm đất (%)",
        stroke: "#4CAF50",
        fill: "url(#colorSoil)",
    },
};

const normalizeSensorType = (type) => {
    if (type === "hum") {
        return "humid";
    }
    return type;
};

const SensorDataChart = ({ chartData, sensors }) => {
    const [filter, setFilter] = useState("all");

    const sensorOptions = useMemo(() => {
        const unique = new Map();
        sensors.forEach((sensor) => {
            const type = normalizeSensorType(sensor.type);
            if (SERIES_CONFIG[type] && !unique.has(type)) {
                unique.set(type, {
                    type,
                    label: `${sensor.name} (${sensor.unit})`,
                });
            }
        });
        return Array.from(unique.values());
    }, [sensors]);

    const normalizedChartData = useMemo(() => {
        const groupedByTime = new Map();

        chartData.forEach((item) => {
            const type = normalizeSensorType(item?.type);
            if (!SERIES_CONFIG[type]) {
                return;
            }

            const createdAt = new Date(item.created_at);
            if (Number.isNaN(createdAt.getTime())) {
                return;
            }

            const time = createdAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
            });

            if (!groupedByTime.has(time)) {
                groupedByTime.set(time, { time });
            }

            const value = Number(item.value);
            groupedByTime.get(time)[type] = Number.isFinite(value)
                ? value
                : null;
        });

        return Array.from(groupedByTime.values());
    }, [chartData]);

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-800">
                    Biểu đồ cảm biến theo thời gian
                </h3>
                <select
                    className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-2 outline-none"
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Tất cả</option>
                    {sensorOptions.map((sensor) => (
                        <option key={sensor.type} value={sensor.type}>
                            {sensor.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                        data={normalizedChartData}
                        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                            <linearGradient
                                id="colorTemp"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#FF5252"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#FF5252"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorHum"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#2196F3"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#2196F3"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorLight"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#FFC107"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#FFC107"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="colorSoil"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1">
                                <stop
                                    offset="5%"
                                    stopColor="#4CAF50"
                                    stopOpacity={0.1}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#4CAF50"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>
                        <CartesianGrid
                            strokeDasharray="3 3"
                            vertical={false}
                            stroke="#E0E0E0"
                        />
                        <XAxis
                            dataKey="time"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9E9E9E", fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: "#9E9E9E", fontSize: 12 }}
                        />
                        <Tooltip
                            contentStyle={{
                                borderRadius: "12px",
                                border: "none",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />

                        {Object.entries(SERIES_CONFIG).map(([key, config]) =>
                            filter === "all" || filter === key ? (
                                <Area
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    name={config.name}
                                    stroke={config.stroke}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill={config.fill}
                                    connectNulls
                                />
                            ) : null,
                        )}
                        <Legend
                            verticalAlign="top"
                            height={36}
                            iconType="circle"
                            wrapperStyle={{
                                top: 0,
                                left: 24,
                                fontSize: "14px",
                            }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default SensorDataChart;
