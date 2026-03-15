import { useMemo, useState } from "react";
import SensorDataChartCanvas from "./SensorDataChartCanvas";
import {
    buildSensorsByType,
    buildSeriesConfig,
    buildSensorOptions,
    buildNormalizedChartData,
} from "../../utils/utils";

const SensorDataChart = ({ chartData, sensors }) => {
    const [filter, setFilter] = useState("all");

    const sensorsByType = useMemo(() => {
        return buildSensorsByType(sensors);
    }, [sensors]);

    const seriesConfig = useMemo(() => {
        return buildSeriesConfig(sensorsByType, chartData);
    }, [chartData, sensorsByType]);

    const sensorOptions = useMemo(
        () => buildSensorOptions(seriesConfig),
        [seriesConfig],
    );

    const normalizedChartData = useMemo(() => {
        return buildNormalizedChartData(chartData);
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

            <div className="flex-1 w-full min-h-75">
                <SensorDataChartCanvas
                    data={normalizedChartData}
                    seriesConfig={seriesConfig}
                    filter={filter}
                />
            </div>
        </div>
    );
};

export default SensorDataChart;
