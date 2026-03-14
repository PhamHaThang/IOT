const SensorDataModel = require("../models/SensorDataModel");
const DeviceModel = require("../models/DeviceModel");

class DashboardController {
    static async getDashboardData(req, res) {
        try {
            const sensorData = await SensorDataModel.getLatestData();
            const devices = await DeviceModel.getAll();
            const chartData = await SensorDataModel.getChartData(20); // Lấy 20 bản ghi mới nhất cho mỗi cảm biến
            res.json({ sensorData, devices, chartData });
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu dashboard:", error);
            res.status(500).json({ error: "Lỗi máy chủ" });
        }
    }
}

module.exports = DashboardController;
