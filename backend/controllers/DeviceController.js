const DeviceModel = require("../models/DeviceModel");
const ActivityLogModel = require("../models/ActivityLogModel");
const mqttService = require("../services/mqttService");
const pool = require("../config/db");
const { TOPIC_DEVICE_CONTROL } = require("../utils/constant");
class DeviceController {
    static async getAllDevices(req, res) {
        try {
            const devices = await DeviceModel.getAll();
            res.json(devices);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
    static async controlDevice(req, res) {
        const { device_id, action } = req.body;
        let log;
        try {
            // Tạo Activity Log với trạng thái WAITING
            log = await ActivityLogModel.create(device_id, action, "WAITING");
            // Lấy thông tin device để xác định loại thiết bị
            const device = await pool.query(
                "SELECT name, type FROM Device WHERE id = $1",
                [device_id],
            );
            const device_type = device.rows[0].type;

            // Gửi lệnh điều khiển qua MQTT
            mqttService.publish(
                TOPIC_DEVICE_CONTROL,
                JSON.stringify({ device_type, action }),
            );

            //  Xử lý logic Timeout
            const waitForMQTTResponse = new Promise((resolve, reject) => {
                const timeout = setTimeout(
                    () => reject(new Error("MQTT_TIMEOUT")),
                    10000,
                );
                mqttService.once("device_status", (data) => {
                    if (
                        data.device_type === device_type &&
                        data.action === action
                    ) {
                        clearTimeout(timeout);
                        resolve();
                    }
                });
            });

            await waitForMQTTResponse;

            // Cập nhật Activity Log thành SUCCESS
            await ActivityLogModel.updateStatus(log.id, "SUCCESS");
            await DeviceModel.updateStatus(device_id, action);

            // Trả về phản hồi thành công
            res.json({
                message: `Đã ${action === "ON" ? "bật" : "tắt"} ${device.rows[0].name} thành công`,
                device_id,
                action,
                success: "SUCCESS",
            });
        } catch (error) {
            // Cập nhật Activity Log thành FAILED do timeout
            await ActivityLogModel.updateStatus(log.id, "FAILED");
            if (error.message === "MQTT_TIMEOUT") {
                res.status(504).json({
                    message:
                        "Không nhận được phản hồi từ thiết bị (MQTT Timeout)",
                    device_id,
                    action,
                    success: "FAILED",
                });
            } else {
                console.error("Lỗi khi điều khiển thiết bị:", error);
                res.status(500).json({ message: error.message });
            }
        }
    }
}
module.exports = DeviceController;
