import React, { useState, useEffect } from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterSearchProps {
  onSearch: (query: string) => void;
  onFilter: (filterValue: string) => void;
  filterOptions: FilterOption[];
  placeholder?: string;
  initialFilter?: string;
  initialQuery?: string;
}

const FilterSearch: React.FC<FilterSearchProps> = ({
  onSearch,
  onFilter,
  filterOptions,
  placeholder = 'Search by name or ID...',
  initialFilter = '',
  initialQuery = ''
}) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedFilter, setSelectedFilter] = useState(initialFilter);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle filter change
  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
    onFilter(value);
    setIsFilterOpen(false);
  };

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle search submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  // Get current filter label
  const getCurrentFilterLabel = () => {
    const option = filterOptions.find(opt => opt.value === selectedFilter);
    return option ? option.label : 'All';
  };

  // Close filter dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsFilterOpen(false);
    };

    if (isFilterOpen) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [isFilterOpen]);

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-2">
        {/* Filter Dropdown */}
        <div className="relative">
          <button
            type="button"
            className="form-input flex items-center justify-between min-w-[150px]"
            onClick={(e) => {
              e.stopPropagation();
              setIsFilterOpen(!isFilterOpen);
            }}
          >
            <span>{getCurrentFilterLabel()}</span>
            <svg
              className={`w-4 h-4 transition-transform ${isFilterOpen ? 'transform rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>

          {/* Dropdown Menu */}
          {isFilterOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
              <ul className="py-1 max-h-60 overflow-auto">
                {filterOptions.map((option) => (
                  <li
                    key={option.value}
                    className={`px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      selectedFilter === option.value ? 'bg-gray-50 font-medium' : ''
                    }`}
                    onClick={() => handleFilterChange(option.value)}
                  >
                    {option.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Search Input */}
        <div className="flex-1 relative">
          <input
            type="text"
            className="form-input pl-10 w-full"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        {/* Search Button */}
        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>
    </div>
  );
};

export default FilterSearch;
