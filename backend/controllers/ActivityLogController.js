const ActivityLogModel = require("../models/ActivityLogModel");

class ActivityLogController {
    static async getActivityLogs(req, res) {
        try {
            const options = {
                page: parseInt(req.query.page) || 1,
                limit: parseInt(req.query.limit) || 10,
                keyword: req.query.keyword || "",
                searchBy: req.query.searchBy || "device_name", // 'device_name', 'status', 'action', 'time'
                filterNameBy: req.query.filterNameBy || "all", // 'all' hoặc type thiết bị
                sortBy: req.query.sortBy || "time", // 'id', 'device_name', 'time'
                sortOrder: req.query.sortOrder || "DESC", // 'ASC', 'DESC'
                filterStatusBy: req.query.filterStatusBy || "all", // 'all', 'WAITING', 'SUCCESS', 'FAILED'
                filterActionBy: req.query.filterActionBy || "all", // 'all', 'OFF', 'ON'
            };
            const activityLogs = await ActivityLogModel.findAll(options);
            res.json(activityLogs);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}
module.exports = ActivityLogController;
