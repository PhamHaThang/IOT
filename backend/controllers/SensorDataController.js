const SensorDataModel = require("../models/SensorDataModel");
class SensorDataController {
    static async getAllSensorData(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                keyword: req.query.keyword || "",
                searchBy: req.query.searchBy || "name", // 'name', 'value', 'time'
                filterNameBy: req.query.filterNameBy || "all", // 'all' hoặc type cảm biến
                sortBy: req.query.sortBy || "time", // 'id', 'name', 'value', 'time', ''created_at'
                sortOrder: req.query.sortOrder || "DESC", // 'ASC', 'DESC'
            };
            const result = await SensorDataModel.findAll(options);
            res.json(result);
        } catch (error) {
            console.error(">>> Lỗi khi lấy dữ liệu cảm biến:", error);
            res.status(500).json({ message: "Lỗi khi lấy dữ liệu cảm biến" });
        }
    }
}
module.exports = SensorDataController;
