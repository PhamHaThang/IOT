import { ChevronDown, Filter, Search } from "lucide-react";

const FilterBar = ({
    searchInput,
    setSearchInput,
    searchCriteriaOptions,
    currentSearchCriteria,
    onSearchCriteriaChange,
    filterOptions,
    currentFilter,
    onFilterChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
            <div className="relative w-full sm:w-80 flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search size={18} className="text-gray-400" />
                </div>
                <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full pl-10 p-2.5 outline-none transition-all"
                    placeholder="Tìm kiếm..."
                    value={searchInput}
                    onChange={(e) =>
                        setSearchInput && setSearchInput(e.target.value)
                    }
                />
            </div>
            <div className="flex gap-3 w-full sm:w-auto flex-wrap sm:flex-nowrap">
                {/* Search By */}
                {searchCriteriaOptions && (
                    <div className="relative">
                        <select
                            className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 outline-none cursor-pointer text-center appearance-none"
                            value={currentSearchCriteria}
                            onChange={(e) =>
                                onSearchCriteriaChange &&
                                onSearchCriteriaChange(e.target.value)
                            }>
                            {searchCriteriaOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {/* Filter By */}
                {filterOptions && (
                    <div className="relative flex-1 sm:flex-none">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Filter size={16} className="text-gray-500" />
                        </div>
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <ChevronDown size={16} className="text-gray-500" />
                        </div>
                        <select
                            className={`bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full px-10 py-2.5 outline-none cursor-pointer appearance-none text-center`}
                            value={currentFilter}
                            onChange={(e) =>
                                onFilterChange && onFilterChange(e.target.value)
                            }>
                            {filterOptions.map((opt) => (
                                <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="text-center">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FilterBar;
