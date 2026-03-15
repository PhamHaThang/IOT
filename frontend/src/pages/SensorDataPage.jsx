import axios from "axios";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useState } from "react";
import FilterBar from "../components/Shared/FilterBar";
import toast from "react-hot-toast";
import DataTable from "../components/Shared/DataTable";
import { Thermometer, Sun, Sprout, Droplets, Circle } from "lucide-react";
import Pagination from "../components/Shared/Pagination";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const SensorDataPage = () => {
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
    const [searchBy, setSearchBy] = useState("name");
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
        const fetchSensorOptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/sensors`);
                const sensorOptions = response.data.map((sensor) => ({
                    value: sensor.type,
                    label: sensor.name,
                }));
                setFilterOptions([
                    { value: "all", label: "Tất cả loại" },
                    ...sensorOptions,
                ]);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách cảm biến:", error);
                toast.error("Lỗi khi lấy danh sách cảm biến");
            }
        };
        fetchSensorOptions();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/sensor-datas`,
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
                console.error("Lỗi khi lấy dữ liệu cảm biến:", error);
                toast.error("Lỗi khi lấy dữ liệu cảm biến");
            }
        };
        fetchData();
    }, [page, limit, keyword, searchBy, filterBy, sortBy, sortOrder]);
    const handleSearch = () => {
        setKeyword(searchInput);
        setPage(1);
    };
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder((prev) => (prev === "ASC" ? "DESC" : "ASC"));
        } else {
            setSortBy(column);
            setSortOrder("DESC");
        }
        setPage(1);
    };
    // Tùy chọn Filter Bar & Search Bar
    const searchCriteriaOptions = [
        { value: "name", label: "Theo Tên" },
        { value: "value", label: "Theo Giá trị" },
        { value: "time", label: "Theo Thời gian" },
    ];

    const getSensorIcon = (type) => {
        switch (type) {
            case "temp":
                return (
                    <Thermometer size={16} className="text-alert shadow-sm" />
                );
            case "humid":
                return (
                    <Droplets size={16} className="text-sky-500 shadow-sm" />
                );
            case "soil":
                return (
                    <Sprout size={16} className="text-green-500 shadow-sm" />
                );
            case "light":
                return <Sun size={16} className="text-warning shadow-sm" />;
            default:
                return <Circle size={16} className="text-gray-400 shadow-sm" />;
        }
    };
    // Cấu hình cột cho DataTable
    const columns = [
        {
            header: "ID",
            accessor: "id",
            sortable: true,
            render: (row) => <span>{row.id}</span>,
        },
        {
            header: "Sensor Name",
            accessor: "sensor_name",
            sortable: true,
            render: (row) => {
                const type = row.type?.toLowerCase() || "";
                return (
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-full bg-gray-50 text-gray-500">
                            {getSensorIcon(type)}
                        </div>
                        <span className="font-medium text-gray-900">
                            {row.sensor_name || "Unknown Sensor"}
                        </span>
                    </div>
                );
            },
        },
        {
            header: "Value",
            accessor: "value",
            sortable: true,
            render: (row) => (
                <span className="font-bold text-gray-800 text-base">
                    {row.value?.toFixed(1) || "N/A"}
                </span>
            ),
        },
        {
            header: "Unit",
            accessor: "unit",
            sortable: false,
            render: (row) => <span>{row.unit || "unit"}</span>,
        },
        {
            header: "Time",
            accessor: "time",
            sortable: true,
            render: (row) => <span>{row.created_at || "N/A"}</span>,
        },
    ];
    return (
        <div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                    Dữ liệu cảm biến
                </h2>
                <p className="text-gray-500">
                    Theo dõi chi tiết các thông số môi trường
                </p>
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

export default SensorDataPage;
