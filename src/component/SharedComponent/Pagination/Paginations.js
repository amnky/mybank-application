import React from "react";
import PageSize from "./PageSize";

const Paginations = ({ pager }) => {
  if (!pager) return null; 

  const pageNumbers = [];

  for (let i = 1; i <= pager.totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="d-flex align-items-center">
      <PageSize sizer={{ pageSize: pager.pageSize, setPageSize: pager.setPageSize }} />
      <ul className="pagination mb-0 ms-3 col-4">
        <li className={`page-item ${pager.pageNumber === 0 ? "disabled" : ""}`} onClick={() => pager.pageNumber > 0 && pager.setPageNumber(pager.pageNumber - 1)}>
          <button className="page-link">Previous</button>
        </li>
        {pageNumbers.map((page) => (
          <li key={page} className={`page-item ${page === pager.pageNumber + 1 ? "active" : ""}`} onClick={() => pager.setPageNumber(page - 1)}>
            <button className="page-link">{page}</button>
          </li>
        ))}
        <li className={`page-item ${pager.pageNumber === pager.totalPages - 1 ? "disabled" : ""}`} onClick={() => pager.pageNumber < pager.totalPages - 1 && pager.setPageNumber(pager.pageNumber + 1)}>
          <button className="page-link">Next</button>
        </li>
      </ul>
    </div>
  );
};

export default Paginations;