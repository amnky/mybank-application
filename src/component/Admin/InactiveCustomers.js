import React, { useState, useEffect } from "react";
import ApiService from "../SharedComponent/Services/ApiServices";
import ViewCustomersFilter from "./ViewCustomersFilter";
import { useSearchParams } from "react-router-dom";
import Table from "../SharedComponent/Tables/Table";
import { useNavigate } from "react-router-dom";

const ViewAllCustomers = () => {
  const navigate=useNavigate()
  const [customers, setCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchParams, setSearchParams] = useSearchParams();

  // Retrieve filters from searchParams
  const filterAccountNo = searchParams.get("accountNo") || "";
  const filterFirstName = searchParams.get("firstName") || "";
  const filterLastName = searchParams.get("lastName") || "";

  const handleProfileButton=(customerId)=>{
    navigate(`/admin/inactive-customer/${customerId}`)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          pageNo: currentPage,
          size: itemsPerPage,
        };
        const response = await ApiService.getAllInactiveCustomers(params);

        setCustomers(response.data.pagedData);
        setTotalPages(response.data.totalPages);
        console.log("response data is: ", response.data);
      } catch (error) {
        console.error("Error fetching transaction data:", error);
      }
    };

    fetchData();
  }, [currentPage, itemsPerPage, searchParams]);

  // Filtering customers based on the search parameters
  const filteredCustomers = customers.filter((customer) => {
    const accountNoMatch =
      !filterAccountNo ||
      customer.accountNumber.toString().includes(filterAccountNo);
    const firstNameMatch =
      !filterFirstName ||
      customer.firstName.toLowerCase().includes(filterFirstName.toLowerCase());
    const lastNameMatch =
      !filterLastName ||
      customer.lastName.toLowerCase().includes(filterLastName.toLowerCase());

    return accountNoMatch && firstNameMatch && lastNameMatch;
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber - 1);

  return (
    <div className="view-customers-container">
      <ViewCustomersFilter
        data={filteredCustomers}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
      />
      <Table
        data={filteredCustomers}
        searchParams={searchParams}
        setSearchParams={setSearchParams}
        paginate={paginate}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        handleClicked={handleProfileButton}

      />
    </div>
  );
};

export default ViewAllCustomers;