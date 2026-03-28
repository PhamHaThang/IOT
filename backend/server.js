const express = require("express");
const cors = require("cors");
const router = require("./routes");
const swaggerUi = require("swagger-ui-express");
const swaggerDefinition = require("./config/swagger");
require("dotenv").config();
require("./services/mqttService");
require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

// Swagger UI
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerDefinition, {
        swaggerOptions: {
            url: "/api-docs.json",
        },
    }),
);

// API documentation JSON endpoint
app.get("/api-docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDefinition);
});

app.use("/api", router);

app.get("/", (req, res) => {
    res.send(
        "API is running... Visit http://localhost:5000/api-docs for API documentation",
    );
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
});
