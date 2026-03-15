import { Loader2 } from "lucide-react";

const PageLoading = ({ message = "Đang tải dữ liệu..." }) => {
    return (
        <div className="w-full py-20 flex flex-col items-center justify-center gap-3 text-gray-500">
            <Loader2 size={28} className="animate-spin text-primary" />
            <p className="text-sm font-medium">{message}</p>
        </div>
    );
};

export default PageLoading;
