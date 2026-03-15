import { ChevronUp, ChevronDown, ArrowUpDown } from "lucide-react";
import clsx from "clsx";
const DataTable = ({ columns, data, sortConfig, onSort }) => {
    return (
        <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm bg-white">
            <table className="w-full text-sm text-left text-gray-500">
                <thead className="text-xs to-gray-500 uppercase bg-gray-50 border-b border-gray-200">
                    <tr>
                        {columns.map((col, index) => (
                            <th
                                key={index}
                                scope="col"
                                className={clsx(
                                    "px-6 py-4 font-semibold transition-colors",
                                    col.sortable &&
                                        "cursor-pointer hover:bg-gray-100 select-none",
                                )}
                                onClick={() =>
                                    col.sortable &&
                                    onSort &&
                                    onSort(col.accessor)
                                }>
                                <div className="flex items-center gap-2">
                                    {col.header}
                                    {col.sortable && (
                                        <span className="text-gray-400">
                                            {sortConfig?.key ===
                                            col.accessor ? (
                                                sortConfig.direction ===
                                                "ASC" ? (
                                                    <ChevronUp
                                                        size={14}
                                                        className="text-primary"
                                                    />
                                                ) : (
                                                    <ChevronDown
                                                        size={14}
                                                        className="text-primary"
                                                    />
                                                )
                                            ) : (
                                                <ArrowUpDown
                                                    size={14}
                                                    className="opacity-50"
                                                />
                                            )}
                                        </span>
                                    )}
                                </div>
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {data.map((row, index) => (
                        <tr
                            key={row.id || index}
                            className="bg-white
                            hover:bg-gray-50 transition-colors">
                            {columns.map((col, colIndex) => (
                                <td key={colIndex} className="px-6 py-4">
                                    {col.render
                                        ? col.render(row)
                                        : row[col.accessor]}
                                </td>
                            ))}
                        </tr>
                    ))}
                    {data.length === 0 && (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-6 py-8 text-center text-gray-400">
                                Chưa có dữ liệu nào phù hợp.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DataTable;
