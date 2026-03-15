import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import axios from "axios";
import DataTable from "../components/Shared/DataTable";
import Pagination from "../components/Shared/Pagination";
import FilterBar from "../components/Shared/FilterBar";
import { Circle, Droplets, Fan, Sun, Wind } from "lucide-react";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const ActionHistoryPage = () => {
    // State quản lý dữ liệu và phân trang
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filterOptions, setFilterOptions] = useState([
        { value: "all", label: "Tất cả loại" },
    ]);
    // Tham số phân trang, tìm kiếm, lọc và sắp xếp
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchBy, setSearchBy] = useState("device_name");
    const [filterBy, setFilterBy] = useState("all");
    const [sortBy, setSortBy] = useState("time");
    const [sortOrder, setSortOrder] = useState("DESC");
    const debouncedSearchTerm = useDebounce(searchInput, 500);

    useEffect(() => {
        if (debouncedSearchTerm !== keyword) {
            setKeyword(debouncedSearchTerm);
            setPage(1);
        }
    }, [debouncedSearchTerm, keyword]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/activity-logs`,
                    {
                        params: {
                            page,
                            limit,
                            keyword,
                            searchBy,
                            filterBy,
                            sortBy,
                            sortOrder,
                        },
                    },
                );
                setData(response.data.data);
                setTotalRecords(response.data.total);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error("Lỗi khi lấy lịch sử hành động:", error);
                toast.error("Lỗi khi lấy lịch sử hành động");
            }
        };
        fetchData();
    }, [page, limit, keyword, searchBy, filterBy, sortBy, sortOrder]);

    useEffect(() => {
        const fetchDeviceOptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/devices`);
                const deviceOptions = response.data.map((device) => ({
                    value: device.type,
                    label: device.name,
                }));
                setFilterOptions([
                    { value: "all", label: "Tất cả loại" },
                    ...deviceOptions,
                ]);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thiết bị:", error);
                toast.error("Lỗi khi lấy danh sách thiết bị");
            }
        };
        fetchDeviceOptions();
    }, []);
    const handleSearch = () => {
        setKeyword(searchInput);
        setPage(1);
    };

    const handleSort = (columnAccessor) => {
        if (sortBy === columnAccessor) {
            setSortOrder(sortOrder === "ASC" ? "DESC" : "ASC");
        } else {
            setSortBy(columnAccessor);
            setSortOrder("DESC");
        }
        setPage(1);
    };

    const renderBadge = (text) => {
        const isSuccessOrOn = text === "ON" || text === "SUCCESS";
        const isWaiting = text === "WAITING";

        let colorClass = "bg-red-100 text-red-700 border-red-200"; // OFF/FAILED/TẮT

        if (isSuccessOrOn)
            colorClass = "bg-green-100 text-green-700 border-green-200";
        else if (isWaiting)
            colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";

        return (
            <span
                className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${colorClass}`}>
                {text}
            </span>
        );
    };
    const getDeviceIcon = (deviceType) => {
        const type = deviceType?.toLowerCase() || "";
        if (type.includes("pump"))
            return <Droplets size={16} className="text-blue-500" />;
        if (type.includes("light"))
            return <Sun size={16} className="text-yellow-500" />;
        if (type.includes("fan"))
            return <Fan size={16} className="text-green-500" />;
        if (type.includes("sprayer"))
            return <Wind size={16} className="text-cyan-500" />;
        return <Circle size={16} className="text-teal-500" />;
    };
    const columns = [
        {
            header: "TIME",
            accessor: "time",
            sortable: true,
            render: (row) => (
                <span className="text-gray-500">{row.created_at}</span>
            ),
        },
        {
            header: "ID",
            accessor: "id",
            sortable: true,
            render: (row) => <span>{row.id}</span>,
        },
        {
            header: "Device Name",
            accessor: "device_name",
            sortable: true,
            render: (row) => (
                <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded-full bg-gray-100 text-gray-500">
                        {getDeviceIcon(row.device_type)}
                    </div>
                    <span className="font-medium text-gray-900">
                        {row.device_name}
                    </span>
                </div>
            ),
        },
        {
            header: "Action",
            accessor: "action",
            sortable: true,
            render: (row) => renderBadge(row.action),
        },
        {
            header: "Status",
            accessor: "status",
            sortable: true,
            render: (row) => renderBadge(row.status),
        },
    ];

    const searchCriteriaOptions = [
        { label: "Theo Tên thiết bị", value: "device_name" },
        { label: "Theo Trạng thái", value: "status" },
        { label: "Theo Hành động", value: "action" },
        { label: "Theo Thời gian", value: "time" },
    ];

    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Lịch sử hoạt động
                </h2>
                <p className="text-gray-500">Nhật ký điều khiển thiết bị</p>
            </div>

            <FilterBar
                searchInput={searchInput}
                setSearchInput={setSearchInput}
                onSearch={handleSearch}
                searchCriteriaOptions={searchCriteriaOptions}
                currentSearchCriteria={searchBy}
                onSearchCriteriaChange={(value) => {
                    setSearchBy(value);
                }}
                filterOptions={filterOptions}
                currentFilter={filterBy}
                onFilterChange={(value) => {
                    setFilterBy(value);
                    setPage(1);
                }}
            />
            <DataTable
                data={data}
                sortConfig={{ key: sortBy, direction: sortOrder }}
                onSort={handleSort}
                columns={columns}
            />
            <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
                itemsPerPage={limit}
                onItemsPerPageChange={setLimit}
                totalItems={totalRecords}
            />
        </div>
    );
};

export default ActionHistoryPage;
