import { createElement, useEffect, useState } from "react";
import clsx from "clsx";
const SensorCard = ({
    title,
    value,
    unit,
    icon,
    gradientClass,
    sensorType,
    threshold,
}) => {
    const numericValue = Number.parseFloat(value);
    const normalizedValue = Number.isFinite(numericValue) ? numericValue : 0;
    const progressValue = Math.min(Math.max(normalizedValue, 0), 100);
    const numericThreshold = Number.parseFloat(threshold);
    const hasThreshold = Number.isFinite(numericThreshold);
    const isWarning = hasThreshold && normalizedValue > numericThreshold;
    const [animatedProgress, setAnimatedProgress] = useState(0);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setAnimatedProgress(progressValue);
        }, 50);

        return () => clearTimeout(timeoutId);
    }, [progressValue]);

    const getProgressColorClass = (type, progress) => {
        const tier = progress <= 30 ? "low" : progress <= 60 ? "mid" : "high";

        const colorByType = {
            temp: {
                low: "bg-gradient-to-r from-red-300 to-red-500",
                mid: "bg-gradient-to-r from-red-400 to-red-600",
                high: "bg-gradient-to-r from-red-500 to-red-700",
            },
            humid: {
                low: "bg-gradient-to-r from-sky-300 to-blue-400",
                mid: "bg-gradient-to-r from-sky-400 to-blue-500",
                high: "bg-gradient-to-r from-sky-500 to-blue-600",
            },
            light: {
                low: "bg-gradient-to-r from-yellow-200 to-yellow-400",
                mid: "bg-gradient-to-r from-yellow-300 to-amber-400",
                high: "bg-gradient-to-r from-yellow-400 to-amber-500",
            },
            soil: {
                low: "bg-gradient-to-r from-emerald-300 to-green-400",
                mid: "bg-gradient-to-r from-emerald-400 to-green-500",
                high: "bg-gradient-to-r from-emerald-500 to-green-600",
            },
            ["wind-speed"]: {
                low: "bg-gradient-to-r from-sky-300 to-sky-500",
                mid: "bg-gradient-to-r from-sky-400 to-sky-600",
                high: "bg-gradient-to-r from-sky-500 to-sky-700",
            },
            default: {
                low: "bg-gray-300",
                mid: "bg-gray-500",
                high: "bg-gray-700",
            },
        };

        return (colorByType[type] || colorByType.default)[tier];
    };

    const getCardContainerClass = (type) => {
        const classes = {
            temp: "bg-gradient-to-b from-red-50/80 to-white border-red-50 shadow-[0_8px_24px_-4px_rgba(239,68,68,0.15)] hover:shadow-[0_12px_28px_-4px_rgba(239,68,68,0.25)]",
            humid: "bg-gradient-to-b from-blue-50/80 to-white border-blue-50 shadow-[0_8px_24px_-4px_rgba(59,130,246,0.15)] hover:shadow-[0_12px_28px_-4px_rgba(59,130,246,0.25)]",
            light: "bg-gradient-to-b from-amber-50/80 to-white border-amber-50 shadow-[0_8px_24px_-4px_rgba(245,158,11,0.15)] hover:shadow-[0_12px_28px_-4px_rgba(245,158,11,0.25)]",
            soil: "bg-gradient-to-b from-green-50/80 to-white border-green-50 shadow-[0_8px_24px_-4px_rgba(34,197,94,0.15)] hover:shadow-[0_12px_28px_-4px_rgba(34,197,94,0.25)]",
            ["wind-speed"]:
                "bg-gradient-to-b from-sky-50/80 to-white border-sky-50 shadow-[0_8px_24px_-4px_rgba(14,165,233,0.15)] hover:shadow-[0_12px_28px_-4px_rgba(14,165,233,0.25)]",
            default:
                "bg-white border-gray-50 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.1)]",
        };
        return classes[type] || classes.default;
    };

    const getProgressTrackClass = (type) => {
        const classes = {
            temp: "bg-red-100/60",
            humid: "bg-blue-100/60",
            light: "bg-amber-100/60",
            soil: "bg-green-100/60",
            ["wind-speed"]: "bg-sky-100/60",
            default: "bg-gray-100/60",
        };
        return classes[type] || classes.default;
    };

    const progressColorClass = getProgressColorClass(sensorType, progressValue);
    const cardThemeClass = getCardContainerClass(sensorType);
    const progressTrackClass = getProgressTrackClass(sensorType);

    return (
        <div
            className={clsx(
                "rounded-[20px] p-6 border transition-all duration-300",
                cardThemeClass,
            )}>
            <div className="flex justify-between items-start">
                <div
                    className={clsx(
                        "p-3 rounded-xl text-white shadow-sm",
                        gradientClass,
                    )}>
                    {icon ? createElement(icon, { size: 24 }) : null}
                </div>
                <div className="flex gap-2 items-end">
                    <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100">
                        Real-time
                    </span>
                    {hasThreshold && (
                        <span
                            className={clsx(
                                "text-sm font-medium px-2 py-1 rounded-lg",
                                isWarning
                                    ? "bg-red-100 text-red-600 border border-red-200 warning-blink"
                                    : "bg-green-100 text-green-600 border border-green-200",
                            )}>
                            {isWarning ? "Warning" : "Normal"}
                        </span>
                    )}
                </div>
            </div>
            <div className="mt-4">
                <h3 className={`text-3xl font-bold text-gray-800`}>
                    {value} {unit}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{title}</p>
            </div>
            <div className="mt-4">
                <div
                    className={clsx(
                        "h-2.5 w-full rounded-full overflow-hidden",
                        progressTrackClass,
                    )}>
                    <div
                        className={clsx(
                            "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
                            progressColorClass,
                        )}
                        style={{ width: `${animatedProgress}%` }}>
                        <span className="absolute inset-0 progress-bar-striped" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SensorCard;
