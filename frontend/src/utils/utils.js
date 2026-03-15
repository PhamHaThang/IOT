const CHART_COLOR_PALETTE = [
    "#FF5252",
    "#2196F3",
    "#FFC107",
    "#4CAF50",
    "#AB47BC",
    "#00ACC1",
    "#FF7043",
    "#5C6BC0",
];

const normalizeType = (type) =>
    String(type || "")
        .trim()
        .toLowerCase();

const buildSensorLabel = (sensor) => {
    if (!sensor) {
        return "Không xác định";
    }
    return sensor.unit ? `${sensor.name} (${sensor.unit})` : sensor.name;
};

const toGradientId = (type, index) =>
    `gradient-${String(type).replace(/[^a-z0-9_-]/gi, "-")}-${index}`;

const buildSensorsByType = (sensors = []) => {
    const map = new Map();
    sensors.forEach((sensor) => {
        const type = normalizeType(sensor.type);
        if (!type || map.has(type)) {
            return;
        }
        map.set(type, sensor);
    });
    return map;
};

const buildSeriesConfig = (sensorsByType, chartData = []) => {
    const types = new Set();

    sensorsByType.forEach((_, type) => {
        types.add(type);
    });

    chartData.forEach((item) => {
        const type = normalizeType(item?.type);
        if (type) {
            types.add(type);
        }
    });

    return Array.from(types).map((type, index) => {
        const color = CHART_COLOR_PALETTE[index % CHART_COLOR_PALETTE.length];
        return {
            key: type,
            label: buildSensorLabel(sensorsByType.get(type)),
            stroke: color,
            gradientId: toGradientId(type, index),
        };
    });
};

const buildSensorOptions = (seriesConfig = []) =>
    seriesConfig.map((series) => ({
        type: series.key,
        label: series.label,
    }));

const buildNormalizedChartData = (chartData = []) => {
    const groupedByTime = new Map();

    chartData.forEach((item) => {
        const type = normalizeType(item?.type);
        if (!type) {
            return;
        }

        const createdAt = new Date(item.created_at);
        if (Number.isNaN(createdAt.getTime())) {
            return;
        }

        const secondBucket = Math.floor(createdAt.getTime() / 1000) * 1000;
        const time = createdAt.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });

        if (!groupedByTime.has(secondBucket)) {
            groupedByTime.set(secondBucket, {
                time,
                timestamp: secondBucket,
            });
        }

        const value = Number(item.value);
        groupedByTime.get(secondBucket)[type] = Number.isFinite(value)
            ? value.toFixed(1)
            : null;
    });

    return Array.from(groupedByTime.values()).sort(
        (left, right) => left.timestamp - right.timestamp,
    );
};

export {
    normalizeType,
    buildSensorsByType,
    buildSeriesConfig,
    buildSensorOptions,
    buildNormalizedChartData,
};
