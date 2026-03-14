const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
});
pool.connect((err, client, release) => {
    if (err) {
        return console.error(
            "Lỗi kết nối cơ sở dữ liệu PostgreSQL:",
            err.stack,
        );
    }
    console.log("Đã kết nối thành công với PostgreSQL");
    release();
});

module.exports = pool;
