const express = require("express");
const cors = require("cors");
const router = require("./routes");
require("dotenv").config();
require("./services/mqttService");
require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api", router);

app.get("/", (req, res) => {
    res.send("API is running...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
});
