const pool = require("../config/db");
class SensorModel {
    static async getAll() {
        const query = "SELECT * FROM Sensor";
        try {
            const res = await pool.query(query);
            return res.rows;
        } catch (err) {
            console.error("Lỗi khi lấy danh sách cảm biến:", err);
            throw err;
        }
    }
}
module.exports = SensorModel;
