import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
const Pagination = ({
    currentPage = 1,
    totalPages = 1,
    onPageChange,
    itemsPerPage = 10,
    onItemsPerPageChange,
    totalItems = 0,
    pageSizeOptions = [10, 20, 50, 100],
}) => {
    const pages = Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
        if (totalPages <= 5) return i + 1;
        if (currentPage < 3) return i + 1;
        if (currentPage > totalPages - 2) return totalPages - 4 + i;
        return currentPage - 2 + i;
    });
    const startItem =
        totalItems === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between mt-4 px-6 py-4 border border-gray-200 bg-white rounded-xl shadow-sm gap-4">
            <div className="flex items-center gap-2 flex-wrap justify-center sm:justify-start">
                <span className="text-sm text-gray-500">
                    Hiển thị{" "}
                    <span className="font-semibold text-gray-900">
                        {startItem}-{endItem}
                    </span>{" "}
                    trong số{" "}
                    <span className="font-semibold text-gray-900">
                        {totalItems}
                    </span>{" "}
                    kết quả
                </span>
                <span className="text-sm text-gray-500 hidden sm:inline">
                    {" "}
                    -{" "}
                </span>
                {onItemsPerPageChange && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">Hiển thị:</span>
                        <select
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block p-1.5 outline-none cursor-pointer"
                            value={itemsPerPage}
                            onChange={(e) => {
                                onItemsPerPageChange(Number(e.target.value));
                                if (onPageChange) onPageChange(1);
                            }}>
                            {pageSizeOptions.map((size) => (
                                <option key={size} value={size}>
                                    {size}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
            <nav className="flex items-center gap-1">
                <button
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer disabled:cursor-not-allowed"
                    onClick={() =>
                        onPageChange && onPageChange(currentPage - 1)
                    }
                    disabled={currentPage === 1 || totalPages === 0}>
                    <ChevronLeft size={18} />
                </button>
                {pages.map((page) => (
                    <button
                        key={page}
                        className={clsx(
                            "px-3 py-1.5 min-w-[32px] rounded-lg text-sm font-medium transition-colors border cursor-pointer disabled:cursor-not-allowed",
                            currentPage === page
                                ? "bg-primary text-white border-primary shadow-sm"
                                : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50",
                        )}
                        onClick={() => onPageChange && onPageChange(page)}
                        disabled={page === currentPage}>
                        {page}
                    </button>
                ))}
                <button
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer disabled:cursor-not-allowed"
                    onClick={() =>
                        onPageChange && onPageChange(currentPage + 1)
                    }
                    disabled={currentPage === totalPages || totalPages === 0}>
                    <ChevronRight size={18} />
                </button>
            </nav>
        </div>
    );
};

export default Pagination;
