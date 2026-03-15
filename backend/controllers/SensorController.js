const SensorModel = require("../models/SensorModel");
class SensorController {
    static async getAllSensors(req, res) {
        try {
            const sensors = await SensorModel.getAll();
            res.json(sensors);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }
}
module.exports = SensorController;
