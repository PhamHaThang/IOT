const pool = require("../config/db");
const { v4: uuidv4 } = require("uuid");

class ActivityLogModel {
    static async create(deviceId, action, status) {
        const id = uuidv4();
        const query =
            "INSERT INTO ActivityLog (id, device_id, action, status) VALUES ($1, $2, $3, $4) RETURNING *";
        const values = [id, deviceId, action, status];
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error("Lỗi khi tạo log hoạt động:", err);
            throw err;
        }
    }
    static async findAll({
        page = 1,
        limit = 10,
        keyword = "",
        searchBy = "device_name",
        filterBy = "all",
        sortBy = "time",
        sortOrder = "DESC",
    }) {
        const offset = (page - 1) * limit;
        let query = `
        SELECT al.id,d.name as device_name, d.type as device_type, al.action,al.status,TO_CHAR(al.created_at AT TIME ZONE 'Asia/Ho_Chi_Minh', 'YYYY-MM-DD HH24:MI:SS') AS created_at
        FROM ActivityLog al
        JOIN Device d ON al.device_id = d.id
        WHERE 1=1
        `;
        let countQuery = `
            SELECT COUNT(*) 
            FROM ActivityLog al 
            JOIN Device d ON al.device_id = d.id 
            WHERE 1=1 
        `;
        const params = [];
        let paramIndex = 1;

        // Xử lý Tìm kiếm
        if (keyword) {
            if (searchBy === "device_name") {
                // Sử dụng unaccent và lower để tìm kiếm không phân biệt dấu và chữ hoa/thường
                query += ` AND unaccent(lower(s.name)) LIKE unaccent(lower($${paramIndex}))`;
                countQuery += ` AND unaccent(lower(s.name)) LIKE unaccent(lower($${paramIndex}))`;
            } else if (searchBy === "action") {
                query += ` AND al.action ILIKE $${paramIndex}`;
                countQuery += ` AND al.action ILIKE $${paramIndex}`;
            } else if (searchBy === "status") {
                query += ` AND al.status ILIKE $${paramIndex}`;
                countQuery += ` AND al.status ILIKE $${paramIndex}`;
            } else if (searchBy === "time") {
                query += ` AND TO_CHAR(al.created_at, 'YYYY-MM-DD HH24:MI:SS') ILIKE $${paramIndex} `;
                countQuery += ` AND TO_CHAR(al.created_at, 'YYYY-MM-DD HH24:MI:SS') ILIKE $${paramIndex} `;
            }
            params.push(`%${keyword}%`);
            paramIndex++;
        }
        // Xử lý Lọc
        if (filterBy && filterBy !== "all") {
            query += ` AND d.type = $${paramIndex}`;
            countQuery += ` AND d.type = $${paramIndex}`;
            params.push(filterBy);
            paramIndex++;
        }
        // Xử lý Sắp xếp
        const validSortColumns = {
            id: "al.id",
            device_name: "d.name",
            name: "d.name",
            time: "al.created_at",
            created_at: "al.created_at",
        };
        const sortColumn = validSortColumns[sortBy] || "al.created_at";
        const order = sortOrder.toUpperCase() === "ASC" ? "ASC" : "DESC";
        query += ` ORDER BY ${sortColumn} ${order} `;
        // Xử lý Phân trang
        query += `
            LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
        `;
        params.push(limit, offset);
        // Tách tham số cho câu lệnh đếm tổng
        const countParams = params.slice(0, paramIndex - 1); // Loại bỏ limit và offset
        try {
            console.log("Query tìm kiếm log hoạt động:", query);
            console.log("Tham số tìm kiếm log hoạt động:", params);

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
            console.error("Lỗi khi tìm kiếm log hoạt động:", err);
            throw err;
        }
    }
    static async updateStatus(id, status) {
        const query =
            "UPDATE ActivityLog SET status = $1 WHERE id = $2 RETURNING *";
        const values = [status, id];
        try {
            const res = await pool.query(query, values);
            return res.rows[0];
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái log hoạt động:", err);
            throw err;
        }
    }
}
module.exports = ActivityLogModel;
