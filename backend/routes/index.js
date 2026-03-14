const express = require("express");
const router = express.Router();

const DeviceController = require("../controllers/DeviceController");
const DashboardController = require("../controllers/DashboardController");
const SensorDataController = require("../controllers/SensorDataController");
const ActivityLogController = require("../controllers/ActivityLogController");
// Dashboard route
router.get("/dashboard/data", DashboardController.getDashboardData);

// Device control route
router.post("/devices/control", DeviceController.controlDevice);

// Activity log route
router.get("/activity-logs", ActivityLogController.getActivityLogs);
// Sensor data route
router.get("/sensor-datas", SensorDataController.getAllSensorData);

module.exports = router;
