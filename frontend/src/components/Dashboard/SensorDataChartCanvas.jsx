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

const SensorDataChartCanvas = ({ data, seriesConfig, filter }) => {
    const formatXAxisDateTime = (value) => {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) {
            return "";
        }

        return new Date(parsed).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    };

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart
                data={data}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    {seriesConfig.map((series) => (
                        <linearGradient
                            key={series.gradientId}
                            id={series.gradientId}
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1">
                            <stop
                                offset="5%"
                                stopColor={series.stroke}
                                stopOpacity={0.1}
                            />
                            <stop
                                offset="95%"
                                stopColor={series.stroke}
                                stopOpacity={0}
                            />
                        </linearGradient>
                    ))}
                </defs>
                <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#E0E0E0"
                />
                <XAxis
                    dataKey="timestamp"
                    type="number"
                    domain={["dataMin", "dataMax"]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#9E9E9E", fontSize: 12 }}
                    dy={10}
                    tickFormatter={formatXAxisDateTime}
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
                    labelFormatter={(label, payload) => {
                        const fullDate = payload?.[0]?.payload?.fullDate;
                        return fullDate ? `${fullDate}` : label;
                    }}
                />

                {seriesConfig.map((series) =>
                    filter === "all" || filter === series.key ? (
                        <Area
                            key={series.key}
                            type="monotone"
                            dataKey={series.key}
                            name={series.label}
                            stroke={series.stroke}
                            strokeWidth={3}
                            fillOpacity={1}
                            fill={`url(#${series.gradientId})`}
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
    );
};

export default SensorDataChartCanvas;
