const mqtt = require("mqtt");
const EventEmitter = require("events");
const pool = require("../config/db");
const SensorDataModel = require("../models/SensorDataModel");
require("dotenv").config();
const {
    TOPIC_SENSOR_DATA,
    TOPIC_DEVICE_STATUS,
    TOPIC_DEVICE_SYNC,
    TOPIC_DEVICE_CONTROL,
} = require("../utils/constant");
class MQTTService extends EventEmitter {
    constructor() {
        super();
        this.mqttClient = mqtt.connect(process.env.MQTT_BROKER_URL, {
            username: process.env.MQTT_USER,
            password: process.env.MQTT_PASSWORD,
            port: process.env.MQTT_PORT,
        });
        this.mqttClient.on("connect", () => {
            console.log("Đã kết nối thành công với MQTT Broker");

            // Đăng ký nhận tin nhắn từ các topic
            this.mqttClient.subscribe(TOPIC_SENSOR_DATA, (err) => {
                if (!err)
                    console.log(`Đã subscribe topic: ${TOPIC_SENSOR_DATA}`);
            });
            this.mqttClient.subscribe(TOPIC_DEVICE_STATUS, (err) => {
                if (!err)
                    console.log(`Đã subscribe topic: ${TOPIC_DEVICE_STATUS}`);
            });
            this.mqttClient.subscribe(TOPIC_DEVICE_SYNC, (err) => {
                if (!err)
                    console.log(`Đã subscribe topic: ${TOPIC_DEVICE_SYNC}`);
            });
        });
        this.mqttClient.on("message", async (topic, message) => {
            console.log(
                `Nhận tin nhắn từ chủ đề ${topic}: ${message.toString()}`,
            );
            // Xử lý tin nhắn
            try {
                const payload = message.toString();
                const data = JSON.parse(payload);
                if (topic === TOPIC_SENSOR_DATA) {
                    // { "temp": 28, "humid": 65, "light": 540, "soil": 27.5 }
                    for (const [sensorType, value] of Object.entries(data)) {
                        const sensorRes = await pool.query(
                            "SELECT id FROM Sensor WHERE type = $1",
                            [sensorType],
                        );
                        if (sensorRes.rows.length > 0) {
                            const sensorId = sensorRes.rows[0].id;
                            await SensorDataModel.create(
                                sensorId,
                                value.toFixed(1),
                            );
                        } else {
                            console.warn(
                                `>>> Không tìm thấy sensor type: ${sensorType} trong database`,
                            );
                        }
                    }
                    console.log(
                        ">>> Dữ liệu cảm biến đã được lưu vào database",
                    );
                } else if (topic === TOPIC_DEVICE_STATUS) {
                    // { "device_type": "...", "action": "UPDATE", "status": "SUCCESS" }
                    // Phát ra sự kiện 'device_status' cho DeviceController lắng nghe
                    this.emit("device_status", data);
                } else if (topic === TOPIC_DEVICE_SYNC) {
                    console.log(
                        ">>> ESP32 vừa kết nối. Đang đồng bộ trạng thái thiết bị...",
                    );
                    const deviceRes = await pool.query(
                        "SELECT id, type, status FROM Device",
                    );
                    for (let row of deviceRes.rows) {
                        const syncPayload = JSON.stringify({
                            device_id: row.id,
                            device_type: row.type,
                            action: row.status, // 'ON' hoặc 'OFF'
                        });
                        this.mqttClient.publish(
                            TOPIC_DEVICE_CONTROL,
                            syncPayload,
                        );
                    }
                    console.log(">>> Đã gửi xong dữ liệu đồng bộ cho ESP32!");
                }
            } catch (error) {
                console.error(">>> Lỗi khi xử lý tin nhắn MQTT:", error);
            }
        });
        // Xử lý lỗi kết nối MQTT
        this.mqttClient.on("error", (err) => {
            console.error(">>> Lỗi kết nối MQTT:", err);
        });
        // Xử lý khi mất kết nối MQTT
        this.mqttClient.on("close", () => {
            console.warn(">>> Kết nối MQTT đã bị đóng");
        });
        // Xử lý khi kết nối MQTT bị mất
        this.mqttClient.on("offline", () => {
            console.warn(">>> MQTT client đang offline");
        });
        // Xử lý khi MQTT client tái kết nối
        this.mqttClient.on("reconnect", () => {
            console.log(">>> Đang cố gắng tái kết nối MQTT...");
        });
    }
    publish(topic, message) {
        if (this.mqttClient.connected) {
            this.mqttClient.publish(topic, message, (err) => {
                if (err) {
                    console.error(
                        `>>> Lỗi khi publish tin nhắn đến ${topic}:`,
                        err,
                    );
                }
            });
        } else {
            console.warn(
                `>>> Không thể publish tin nhắn, MQTT client không kết nối: ${topic} - ${message}`,
            );
        }
    }
}

module.exports = new MQTTService();
