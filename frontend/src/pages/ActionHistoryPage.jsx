import { useEffect, useState } from "react";
import useDebounce from "../hooks/useDebounce";
import toast from "react-hot-toast";
import axios from "axios";
import DataTable from "../components/Shared/DataTable";
import Pagination from "../components/Shared/Pagination";
import FilterBar from "../components/Shared/FilterBar";
import PageLoading from "../components/Shared/PageLoading";
import {
    ACTION_HISTORY_ACTION_FILTER_OPTIONS,
    ACTION_HISTORY_STATUS_FILTER_OPTIONS,
    API_BASE_URL,
    SEARCH_CRITERIA_ACTION_HISTORY_OPTIONS,
} from "../utils/constants";
import { COLUMNS_ACTION_HISTORY } from "../utils/columns";

const ActionHistoryPage = () => {
    // State quản lý dữ liệu và phân trang
    const [data, setData] = useState([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [filterOptions, setFilterOptions] = useState([
        { value: "all", label: "Tất cả thiết bị" },
    ]);
    // Tham số phân trang, tìm kiếm, lọc và sắp xếp
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [keyword, setKeyword] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [searchBy, setSearchBy] = useState("time");
    const [filterNameBy, setFilterNameBy] = useState("all");
    const [filterStatusBy, setFilterStatusBy] = useState("all");
    const [filterActionBy, setFilterActionBy] = useState("all");
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
                            filterNameBy,
                            filterStatusBy,
                            filterActionBy,
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
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchData();
    }, [
        page,
        limit,
        keyword,
        searchBy,
        filterNameBy,
        filterStatusBy,
        filterActionBy,
        sortBy,
        sortOrder,
    ]);

    useEffect(() => {
        const fetchDeviceOptions = async () => {
            try {
                const response = await axios.get(`${API_BASE_URL}/devices`);
                const deviceOptions = response.data.map((device) => ({
                    value: device.type,
                    label: device.name,
                }));
                setFilterOptions([
                    { value: "all", label: "Tất cả thiết bị" },
                    ...deviceOptions,
                ]);
            } catch (error) {
                console.error("Lỗi khi lấy danh sách thiết bị:", error);
                toast.error("Lỗi khi lấy danh sách thiết bị");
            } finally {
                setIsLoadingFilterOptions(false);
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

    return (
        <div>
            {isPageLoading || isLoadingFilterOptions ? (
                <PageLoading message="Đang tải lịch sử hoạt động..." />
            ) : (
                <>
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Lịch sử hoạt động
                        </h2>
                        <p className="text-gray-500">
                            Nhật ký điều khiển thiết bị
                        </p>
                    </div>

                    <FilterBar
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        onSearch={handleSearch}
                        searchCriteriaOptions={
                            SEARCH_CRITERIA_ACTION_HISTORY_OPTIONS
                        }
                        currentSearchCriteria={searchBy}
                        onSearchCriteriaChange={(value) => {
                            setSearchBy(value);
                        }}
                        filterOptions={filterOptions}
                        currentFilter={filterNameBy}
                        onFilterChange={(value) => {
                            setFilterNameBy(value);
                            setPage(1);
                        }}
                        extraFilters={[
                            {
                                key: "action-filter",
                                options: ACTION_HISTORY_ACTION_FILTER_OPTIONS,
                                currentValue: filterActionBy,
                                onChange: (value) => {
                                    setFilterActionBy(value);
                                    setPage(1);
                                },
                            },
                            {
                                key: "status-filter",
                                options: ACTION_HISTORY_STATUS_FILTER_OPTIONS,
                                currentValue: filterStatusBy,
                                onChange: (value) => {
                                    setFilterStatusBy(value);
                                    setPage(1);
                                },
                            },
                        ]}
                    />
                    <DataTable
                        data={data}
                        sortConfig={{ key: sortBy, direction: sortOrder }}
                        onSort={handleSort}
                        columns={COLUMNS_ACTION_HISTORY}
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

export default ActionHistoryPage;
