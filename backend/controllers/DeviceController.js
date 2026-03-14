const DeviceModel = require("../models/DeviceModel");
const ActivityLogModel = require("../models/ActivityLogModel");
const mqttService = require("../services/mqttService");
const pool = require("../config/db");
class DeviceController {
    static async controlDevice(req, res) {
        const { device_id, action } = req.body;
        try {
            // Tạo Activity Log với trạng thái WAITING
            const log = await ActivityLogModel.create(
                device_id,
                action,
                "WAITING",
            );
            // Lấy thông tin device để xác định loại thiết bị
            const device = await pool.query(
                "SELECT type FROM Device WHERE id = $1",
                [device_id],
            );
            const device_type = device[0].type;

            // Gửi lệnh điều khiển qua MQTT
            mqttService.publish(
                `garden/device`,
                JSON.stringify({ device_id, action }),
            );

            //  Xử lý logic Timeout
            const waitForMQTTResponse = new Promise((resolve, reject) => {
                const timeout = setTimeout(
                    () => reject(new Error("MQTT_TIMEOUT")),
                    10000,
                );
                mqttService.once("device_status", (data) => {
                    if (
                        data.deviceType === device_type &&
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

            res.json({ message: "Lệnh đã được gửi và thực hiện thành công" });
        } catch (error) {
            if (error.message === "MQTT_TIMEOUT") {
                // Cập nhật Activity Log thành FAILED do timeout
                await ActivityLogModel.updateStatus(log.id, "FAILED");
                res.status(504).json({
                    error: "Không nhận được phản hồi từ thiết bị (timeout)",
                });
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }
}
module.exports = DeviceController;
