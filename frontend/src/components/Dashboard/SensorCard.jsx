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
                low: "bg-red-300",
                mid: "bg-red-500",
                high: "bg-red-700",
            },
            humid: {
                low: "bg-blue-300",
                mid: "bg-blue-500",
                high: "bg-blue-700",
            },
            light: {
                low: "bg-yellow-300",
                mid: "bg-yellow-500",
                high: "bg-yellow-600",
            },
            soil: {
                low: "bg-green-300",
                mid: "bg-green-500",
                high: "bg-green-700",
            },
            default: {
                low: "bg-gray-300",
                mid: "bg-gray-500",
                high: "bg-gray-700",
            },
        };

        return (colorByType[type] || colorByType.default)[tier];
    };

    const progressColorClass = getProgressColorClass(sensorType, progressValue);

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div
                    className={clsx(
                        "p-3 rounded-xl text-white shadow-sm",
                        gradientClass,
                    )}>
                    {icon ? createElement(icon, { size: 24 }) : null}
                </div>
                <div className="flex flex-col gap-2 items-end">
                    <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                        Real-time
                    </span>
                    {threshold !== undefined && (
                        <span
                            className={clsx(
                                "text-sm font-medium px-2 py-1 rounded-lg",
                                value > threshold
                                    ? "bg-red-100 text-red-600"
                                    : "bg-green-100 text-green-600",
                            )}>
                            {value > threshold ? "Warning" : "Normal"}
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
                <div className="h-2.5 w-full rounded-full bg-gray-100 overflow-hidden">
                    <div
                        className={clsx(
                            "h-full rounded-full transition-all duration-700 ease-out relative overflow-hidden",
                            progressColorClass,
                        )}
                        style={{ width: `${animatedProgress}%` }}>
                        <span className="absolute inset-0 bg-white/25 animate-pulse" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SensorCard;
