const express = require("express");
const router = express.Router();

const DeviceController = require("../controllers/DeviceController");
const DashboardController = require("../controllers/DashboardController");
const SensorDataController = require("../controllers/SensorDataController");
const ActivityLogController = require("../controllers/ActivityLogController");
const SensorController = require("../controllers/SensorController");
// Dashboard route
router.get("/dashboard/data", DashboardController.getDashboardData);

// Device control route
router.post("/devices/control", DeviceController.controlDevice);
router.get("/devices", DeviceController.getAllDevices);

// Activity log route
router.get("/activity-logs", ActivityLogController.getActivityLogs);
// Sensor data route
router.get("/sensor-datas", SensorDataController.getAllSensorData);

// Sensor route
router.get("/sensors", SensorController.getAllSensors);

module.exports = router;
