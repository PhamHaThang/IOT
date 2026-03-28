import axios from "axios";
import useDebounce from "../hooks/useDebounce";
import { useEffect, useState } from "react";
import FilterBar from "../components/Shared/FilterBar";
import toast from "react-hot-toast";
import DataTable from "../components/Shared/DataTable";
import Pagination from "../components/Shared/Pagination";
import PageLoading from "../components/Shared/PageLoading";
import {
    API_BASE_URL,
    SEARCH_CRITERIA_SENSOR_DATA_OPTIONS,
} from "../utils/constants";

import { COLUMNS_SENSOR_DATA } from "../utils/columns";

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
    const [searchBy, setSearchBy] = useState("value");
    const [filterBy, setFilterBy] = useState("all");
    const [sortBy, setSortBy] = useState("time");
    const [sortOrder, setSortOrder] = useState("DESC");
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isLoadingFilterOptions, setIsLoadingFilterOptions] = useState(true);

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
            } finally {
                setIsLoadingFilterOptions(false);
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
            } finally {
                setIsPageLoading(false);
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

    return (
        <div>
            {isPageLoading || isLoadingFilterOptions ? (
                <PageLoading message="Đang tải dữ liệu cảm biến..." />
            ) : (
                <>
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
                        searchCriteriaOptions={
                            SEARCH_CRITERIA_SENSOR_DATA_OPTIONS
                        }
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
                        columns={COLUMNS_SENSOR_DATA}
                    />
                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                        itemsPerPage={limit}
                        onItemsPerPageChange={setLimit}
                        totalItems={totalRecords}
                    />
                </>
            )}
        </div>
    );
};

export default SensorDataPage;
