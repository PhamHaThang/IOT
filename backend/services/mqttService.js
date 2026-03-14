const mqtt = require("mqtt");
const EventEmitter = require("events");
const pool = require("../config/db");
const SensorDataModel = require("../models/SensorDataModel");
require("dotenv").config();

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
            this.mqttClient.subscribe("garden/sensordata", (err) => {
                if (!err) console.log("Đã subscribe topic: garden/sensordata");
            });

            this.mqttClient.subscribe("garden/status", (err) => {
                if (!err) console.log("Đã subscribe topic: garden/status");
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
                if (topic === "garden/sensordata") {
                    // { "temp": 28, "humid": 65, "light": 540, "soil": 27.5 }
                    for (const [sensorType, value] of Object.entries(data)) {
                        const sensorRes = await pool.query(
                            "SELECT id FROM sensors WHERE type = ?",
                            [sensorType],
                        );
                        if (sensorRes.length > 0) {
                            const sensorId = sensorRes[0].id;
                            await SensorDataModel.create(sensorId, value);
                        } else {
                            console.warn(
                                `>>> Không tìm thấy sensor type: ${sensorType} trong database`,
                            );
                        }
                    }
                    console.log(
                        ">>> Dữ liệu cảm biến đã được lưu vào database",
                    );
                } else if (topic === "garden/status") {
                    // { "deviceType": "...", "action": "UPDATE", "status": "SUCCESS" }
                    // Phát ra sự kiện 'device_status' cho DeviceController lắng nghe
                    this.emit("device_status", data);
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
