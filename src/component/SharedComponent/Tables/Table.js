import React from "react";
import "./Table.css";
import CustomPagination from "../Pagination/CustomPagination";
import CustomDropodown from "../Dropdown/CustomDropdown";

const Table = (props) => {
  const { data, setSearchParams, searchParams,handleClicked,
    currentPage,setCurrentPage,totalPages,paginate } = props;
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  if (!data || !data.length) {
    return <div>No data to display.</div>;
  }
  // Extract header keys (consider using a separate `headerKeys` prop if available)
  const headerKeys = Object.keys(data[0]);

  // Filter headers to only include non-null titles (consider custom logic based on header content)
  const filteredHeaderKeys = headerKeys.filter((key) => data[0][key] !== null); // Assuming key is not null

  const tableHeaders = (
    <tr>
      {filteredHeaderKeys.map((key) => (
        <th key={key}>{key}</th>
      ))}
    </tr>
  );

    const tableData = data.map((customer) => (
        <tr key={customer.id || Math.random()}>
          {filteredHeaderKeys.map((k) => (
            <td key={k}>
              {k === 'customerId' || k==="id" ? (
                <a href="#" onClick={() => handleClicked(customer[k])}>
                  {customer[k]}
                </a>
              ) : (
                customer[k] || '-'
              )}
            </td>
          ))}
        </tr>
      ));
    return (
      <div className="table-container">
        <table className="table">
          <thead className="thead">{tableHeaders}</thead>
          <tbody>{tableData}</tbody>
        </table>
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

export default Table;