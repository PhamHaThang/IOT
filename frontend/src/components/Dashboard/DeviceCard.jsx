import clsx from "clsx";
import { Loader2 } from "lucide-react";
const DeviceCard = ({
    icon: Icon,
    device,
    onToggle,
    loading,
    activeIconClass,
}) => {
    const isWaiting = Boolean(loading);
    const status = device.status;

    return (
        <div className={clsx(
            "p-5 rounded-[20px] border flex flex-col items-center justify-between gap-4 transition-all duration-300 hover:-translate-y-1",
            status === "ON" && !isWaiting
                ? "bg-gradient-to-b from-green-50/50 to-white border-green-100 shadow-[0_8px_24px_-4px_rgba(34,197,94,0.15)] hover:shadow-[0_12px_28px_-4px_rgba(34,197,94,0.25)]"
                : "bg-white border-gray-50 shadow-[0_8px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_12px_28px_-4px_rgba(0,0,0,0.1)]"
        )}>
            <div
                className={clsx(
                    "w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-300",
                    status === "ON" && !isWaiting
                        ? "bg-primary/10 text-primary"
                        : "bg-gray-100 text-gray-400",
                )}>
                <Icon
                    size={32}
                    className={clsx(
                        status === "ON" && !isWaiting && activeIconClass,
                    )}
                />
            </div>

            <div className="text-center">
                <h4 className="font-bold text-gray-800">{device.name}</h4>
                <p
                    className={clsx(
                        "text-sm font-medium mt-1",
                        isWaiting
                            ? "text-warning"
                            : status === "ON"
                              ? "text-primary"
                              : "text-gray-400",
                    )}>
                    {isWaiting
                        ? "Đang xử lý..."
                        : status === "ON"
                          ? "Đang Bật"
                          : "Đang Tắt"}
                </p>
            </div>

            <button
                onClick={() => onToggle(device)}
                disabled={isWaiting}
                className={clsx(
                    "relative w-14 h-8 rounded-full transition-colors duration-300 focus:outline-none",
                    status === "ON" ? "bg-primary" : "bg-gray-300",
                )}>
                {isWaiting ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2
                            size={16}
                            className="text-white animate-spin"
                        />
                    </div>
                ) : (
                    <span
                        className={clsx(
                            "absolute top-1 left-1 bg-white w-6 h-6 rounded-full shadow-sm transition-transform duration-300",
                            status === "ON" ? "translate-x-6" : "translate-x-0",
                        )}
                    />
                )}
            </button>
        </div>
    );
};

export default DeviceCard;
