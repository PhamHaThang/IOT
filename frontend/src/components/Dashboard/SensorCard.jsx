import clsx from "clsx";
const SensorCard = ({ title, value, unit, icon: Icon, gradientClass }) => {
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
                <span className="text-sm font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                    Real-time
                </span>
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
