const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class SensorDataModel {
    static async create(sensorId, value) {
        const id = uuidv4();
        const query =
            "INSERT INTO SensorData (id,sensor_id,value)VALUES ($1, $2, $3) RETURNING *";
        const values = [id, sensorId, value];
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error("Lỗi khi tạo dữ liệu cảm biến:", err);
            throw err;
        }
    }
    static async getLatestData() {
        const query = `
            SELECT DISTINCT ON (s.id) 
                s.name,
                s.unit,
                sd.value,
                sd.created_at
            FROM Sensor s
            LEFT JOIN SensorData sd 
                ON sd.sensor_id = s.id
            ORDER BY s.id, sd.created_at DESC;
        `;
        try {
            const res = await pool.query(query);
            return res.rows;
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu cảm biến mới nhất:", err);
            throw err;
        }
    }
    static async getChartData(limitPerSensor = 20) {
        const query = `
            WITH RankedData AS (
            SELECT s.slug,s.name,sd.value, sd.created_at,
                ROW_NUMBER() OVER (PARTITION BY s.id ORDER BY sd.created_at DESC) AS rn
            FROM Sensor s
            JOIN SensorData sd ON s.id = sd.sensor_id
            )
            SELECT slug, name, value, created_at
            FROM RankedData
            WHERE rn <= $1
            ORDER BY created_at ASC;
        `;
        try {
            const res = await pool.query(query, [limitPerSensor]);
            return res.rows;
        } catch (err) {
            console.error("Lỗi khi lấy dữ liệu biểu đồ:", err);
            throw err;
        }
    }
    static async findAll({
        page = 1,
        limit = 10,
        keyword = "",
        searchBy = "name",
        filterBy = "",
        sortBy = "time",
        sortOrder = "DESC",
    }) {
        const offset = (page - 1) * limit;
        let query = `
            SELECT sd.id, s.name as sensor_name, sd.value, s.unit, sd.created_at 
            FROM SensorData sd 
            JOIN Sensor s ON sd.sensor_id = s.id 
            WHERE 1=1
        `;
        let countQuery = `SELECT COUNT(*) FROM SensorData sd JOIN Sensor s ON sd.sensor_id = s.id WHERE 1=1`;
        const params = [];
        let paramIndex = 1;

        // Xử lý Tìm kiếm
        if (keyword) {
            if (searchBy === "name") {
                query += ` AND s.name ILIKE $${paramIndex}`;
                countQuery += ` AND s.name ILIKE $${paramIndex}`;
            } else if (searchBy === "value") {
                query += ` AND CAST(sd.value AS TEXT) ILIKE $${paramIndex} `;
                countQuery += ` AND CAST(sd.value AS TEXT) ILIKE $${paramIndex} `;
            } else if (searchBy === "time" || searchBy === "created_at") {
                query += ` AND TO_CHAR(sd.created_at, 'YYYY-MM-DD HH24:MI:SS') ILIKE $${paramIndex} `;
                countQuery += ` AND TO_CHAR(sd.created_at, 'YYYY-MM-DD HH24:MI:SS') ILIKE $${paramIndex} `;
            }
            params.push(`%${keyword}%`);
            paramIndex++;
        }
        // Xử lý Lọc
        if (filterBy && filterBy !== "all") {
            // filterBy -> type (temp, humid, light, soil)
            query += ` AND s.id = $${paramIndex}`;
            countQuery += ` AND s.id = $${paramIndex}`;
            params.push(filterBy);
            paramIndex++;
        }
        // Xử lý Sắp xếp
        const validSortColumns = {
            id: "sd.id",
            name: "s.name",
            sensor_name: "s.name",
            value: "sd.value",
            time: "sd.created_at",
            created_at: "sd.created_at",
        };
        const sortColumn = validSortColumns[sortBy] || "sd.created_at";
        const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
        query += ` ORDER BY ${sortColumn} ${order} `;

        // Xử lý Phân trang
        query += `
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);

        // Tách tham số cho câu lệnh đếm tổng
        const countParams = params.slice(0, paramIndex - 2); // Loại bỏ limit và offset
        try {
            const res = await pool.query(query, params);
            const totalResult = await pool.query(countQuery, countParams);
            const totalRecords = parseInt(totalResult.rows[0].count);
            return {
                data: res.rows,
                total: totalRecords,
                currentPage: page,
                totalPages: Math.ceil(totalRecords / limit),
            };
        } catch (err) {
            console.error("Lỗi khi tìm kiếm dữ liệu cảm biến:", err);
            throw err;
        }
    }
}
module.exports = SensorDataModel;
