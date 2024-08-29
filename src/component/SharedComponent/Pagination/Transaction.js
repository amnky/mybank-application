
import React from 'react';
import { useSearchParams } from 'react-router-dom';
import Table from '../Tables/Table';

const Transaction = ({
  paginate,
  transactions,
  currentPage,
  setCurrentPage,
  totalPages,
  filterAccountNo,
  filterStartDate,
  filterEndDate,
  setFilterAccountNo,
  setFilterStartDate,
  setFilterEndDate,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
}) => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>

      {/* Filter Section */}
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
          <label htmlFor="filterStartDate" className="block mb-1">
            Start Date:
          </label>
          <input
            type="date"
            id="filterStartDate"
            value={filterStartDate}
            onChange={(e) => setFilterStartDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        <div className="mb-2">
          <label htmlFor="filterEndDate" className="block mb-1">
            End Date:
          </label>
          <input
            type="date"
            id="filterEndDate"
            value={filterEndDate}
            onChange={(e) => setFilterEndDate(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          />
        </div>
        {/* Sort By Dropdown */}
        <div className="mb-2 md:ml-4">
          <label htmlFor="sortBy" className="block mb-1">
            Sort By:
          </label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="amount">Amount</option>
            <option value="time">Transaction Time</option>
          </select>
        </div>
        {/* Sort Order Dropdown */}
        <div className="mb-2 md:ml-4">
          <label htmlFor="sortOrder" className="block mb-1">
            Sort Direction:
          </label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Transaction Table */}
     <Table
            data={transactions}
            searchParams={searchParams}
            setSearchParams={setSearchParams}
          />

      {/* Pagination */}
      <div className="flex justify-center mt-4">
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            className={`px-4 py-2 mx-1 ${index === currentPage ? 'bg-blue-700' : 'bg-blue-500'} text-white rounded`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
        <button
          className="px-4 py-2 mx-1 bg-blue-500 text-white rounded"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Transaction;
