import clsx from "clsx";
const SensorCard = ({
    title,
    value,
    unit,
    icon: Icon,
    gradientClass,
    threshold,
}) => {
    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
                <div
                    className={clsx(
                        "p-3 rounded-xl text-white shadow-sm",
                        gradientClass,
                    )}>
                    <Icon size={24} />
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
                <h3 className="text-3xl font-bold text-gray-800">
                    {value} {unit}
                </h3>
                <p className="text-gray-500 text-sm mt-1">{title}</p>
            </div>
        </div>
    );
};

export default SensorCard;
