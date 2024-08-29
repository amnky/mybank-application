import React, { useState, useEffect } from "react";
import "./ViewCustomersFilter.css";

const ViewCustomersFilter = (props) => {
  const { data, setSearchParams, searchParams } = props;
  
  // New states for filters
  const [filterAccountNo, setFilterAccountNo] = useState(searchParams.get("accountNo") || "");
  const [filterFirstName, setFilterFirstName] = useState(searchParams.get("firstName") || "");
  const [filterLastName, setFilterLastName] = useState(searchParams.get("lastName") || "");

  // Update state when search parameters change
  useEffect(() => {
    setFilterAccountNo(searchParams.get("accountNo") || "");
    setFilterFirstName(searchParams.get("firstName") || "");
    setFilterLastName(searchParams.get("lastName") || "");
  }, [searchParams]);

  const search = () => {
    const currentParams = Object.fromEntries(searchParams);
    if (filterAccountNo) {
      currentParams.accountNo = filterAccountNo;
    }
    if (filterFirstName) {
      currentParams.firstName = filterFirstName;
    }
    if (filterLastName) {
      currentParams.lastName = filterLastName;
    }
    setSearchParams(currentParams);
  };

  const reset = () => {
    setFilterAccountNo("");
    setFilterFirstName("");
    setFilterLastName("");
    setSearchParams([]);
  };

  return (
    <div className="filter-wrapper">
      <div className="flex flex-col md:flex-row mb-4">
        <div className="mb-2 md:mr-2">
          <label htmlFor="filterAccountNo" className="block mb-1">
            Account No:
          </label>
          <input
            type="text"
            id="filterAccountNo"
            value={filterAccountNo}
            onChange={(e) => setFilterAccountNo(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="mb-2 md:mr-2">
          <label htmlFor="filterFirstName" className="block mb-1">
            First Name:
          </label>
          <input
            type="text"
            id="filterFirstName"
            value={filterFirstName}
            onChange={(e) => setFilterFirstName(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>

        <div className="mb-2">
          <label htmlFor="filterLastName" className="block mb-1">
            Last Name:
          </label>
          <input
            type="text"
            id="filterLastName"
            value={filterLastName}
            onChange={(e) => setFilterLastName(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
      </div>

      <div className="filter-actions">
        <button type="button" className="search-btn" onClick={search}>
          Search
        </button>
        <button type="button" className="reset-btn" onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
};

export default ViewCustomersFilter;
