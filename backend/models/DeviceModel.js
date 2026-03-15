const pool = require("../config/db");

class DeviceModel {
    static async getAll() {
        const query = "SELECT name, type, status FROM Device";
        try {
            const res = await pool.query(query);
            return res.rows;
        } catch (err) {
            console.error("Lỗi khi lấy danh sách thiết bị:", err);
            throw err;
        }
    }
    static async updateStatus(id, status) {
        const query = "UPDATE Device SET status = $1 WHERE id = $2 RETURNING *";
        const values = [status, id];
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái thiết bị:", err);
            throw err;
        }
    }
}
module.exports = DeviceModel;
