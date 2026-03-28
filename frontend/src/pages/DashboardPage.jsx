import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import SensorCard from "../components/Dashboard/SensorCard";
import SensorDataChart from "../components/Dashboard/SensorDataChart";
import { API_BASE_URL } from "../utils/constants";
import PageLoading from "../components/Shared/PageLoading";
import {
    Circle,
    Droplets,
    Fan,
    Settings,
    Sprout,
    Sun,
    Thermometer,
    Wind,
} from "lucide-react";
import DeviceCard from "../components/Dashboard/DeviceCard";

const DashboardPage = () => {
    const [sensors, setSensors] = useState([]);
    const [chartData, setChartData] = useState([]);
    const [devices, setDevices] = useState([]);
    const [isPageLoading, setIsPageLoading] = useState(true);

    const [loadingDevices, setLoadingDevices] = useState({});

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/dashboard/data`,
                );
                const { sensorData, chartData, devices } = response.data;

                setSensors(sensorData);
                setChartData(chartData);
                setDevices(devices);
                console.log("Dữ liệu Dashboard đã được cập nhật:", {
                    sensors: sensorData,
                    chartData,
                    devices,
                });
            } catch (error) {
                console.error("Lỗi khi lấy dữ liệu Dashboard:", error);
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchDashboardData();
        const intervalId = setInterval(fetchDashboardData, 2000);
        return () => clearInterval(intervalId);
    }, []);
    const toggleDevice = async (device) => {
        const newAction = device.status === "ON" ? "OFF" : "ON";

        setLoadingDevices((prev) => ({ ...prev, [device.id]: true }));
        try {
            console.log(
                `Gửi lệnh ${newAction} cho thiết bị ${device.name} (ID: ${device.id})`,
            );
            const response = await axios.post(
                `${API_BASE_URL}/devices/control`,
                {
                    device_id: device.id,
                    action: newAction,
                },
            );
            toast.success(response.data.message);
            // Cập nhật trạng thái thiết bị trong UI
            setDevices((prevDevices) =>
                prevDevices.map((d) =>
                    d.id === device.id ? { ...d, status: newAction } : d,
                ),
            );
        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                    `Lỗi khi điều khiển thiết bị ${device?.name || ""}`,
            );
            console.error(
                `Lỗi khi điều khiển thiết bị ${device?.name || ""}:`,
                error,
            );
        } finally {
            setLoadingDevices((prev) => ({ ...prev, [device.id]: false }));
        }
    };
    const getSensorCardInfo = (type) => {
        switch (type) {
            case "temp":
                return {
                    icon: Thermometer,
                    gradientClass:
                        "bg-gradient-to-br from-rose-500 via-red-500 to-orange-500",
                };
            case "humid":
                return {
                    icon: Droplets,
                    gradientClass:
                        "bg-gradient-to-br from-blue-600 via-sky-500 to-cyan-400",
                };
            case "light":
                return {
                    icon: Sun,
                    gradientClass:
                        "bg-gradient-to-br from-amber-500 via-orange-400 to-yellow-400",
                };
            case "soil":
                return {
                    icon: Sprout,
                    gradientClass:
                        "bg-gradient-to-br from-emerald-500 via-green-500 to-lime-400",
                };
            default:
                return {
                    icon: Circle,
                    gradientClass:
                        "bg-gradient-to-br from-gray-500 via-gray-600 to-gray-700",
                };
        }
    };
    const getDeviceCardInfo = (type) => {
        switch (type) {
            case "light":
                return { icon: Sun, activeIconClass: "sun-heatwave" };
            case "pump":
                return { icon: Droplets, activeIconClass: "animate-bounce" };
            case "fan":
                return { icon: Fan, activeIconClass: "animate-spin" };
            case "sprayer":
                return { icon: Wind, activeIconClass: "wind-flow" };
            default:
                return { icon: Settings, activeIconClass: "animate-bounce" };
        }
    };

    return (
        <div className="space-y-6">
            {isPageLoading ? (
                <PageLoading message="Đang tải dashboard..." />
            ) : (
                <>
                    {/* Area 1: Sensor Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {sensors.length === 0 ? (
                            <p className="text-gray-500 text-center">
                                Không có dữ liệu cảm biến
                            </p>
                        ) : (
                            sensors.map((sensor, index) => (
                                <SensorCard
                                    key={
                                        sensor.id ??
                                        `${sensor.type}-${sensor.name}-${index}`
                                    }
                                    title={sensor.name || "Cảm biến"}
                                    value={sensor.value?.toFixed(1) || "N/A"}
                                    unit={sensor.unit || ""}
                                    sensorType={sensor.type}
                                    icon={getSensorCardInfo(sensor.type).icon}
                                    gradientClass={
                                        getSensorCardInfo(sensor.type)
                                            .gradientClass
                                    }
                                />
                            ))
                        )}
                    </div>
                    {/* Area 2: Chart */}
                    <div className="h-100">
                        <SensorDataChart
                            chartData={chartData}
                            sensors={sensors}
                        />
                    </div>
                    {/* Area 3: Device Control */}
                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Điều khiển thiết bị
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {devices.length === 0 ? (
                                <p className="text-gray-500 text-center">
                                    Không có thiết bị nào
                                </p>
                            ) : (
                                devices.map((device, index) => (
                                    <DeviceCard
                                        key={
                                            device.id ??
                                            `${device.type}-${device.name}-${index}`
                                        }
                                        device={device}
                                        onToggle={toggleDevice}
                                        loading={loadingDevices[device.id]}
                                        activeIconClass={
                                            getDeviceCardInfo(device.type)
                                                .activeIconClass
                                        }
                                        icon={
                                            getDeviceCardInfo(device.type).icon
                                        }
                                    />
                                ))
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
