import React, { useState ,useEffect } from 'react'
import { toast } from 'react-toastify';
import ApiService from '../SharedComponent/Services/ApiServices';
import Table from '../SharedComponent/Tables/Table';
import ViewCustomersFilter from './ViewCustomersFilter';
import { useSearchParams } from 'react-router-dom';
import ViewRegisteredUsersFilter from './ViewRegisteredUsersFilter';
import { useNavigate } from 'react-router-dom';
const ViewAllRegisteredCustomers = () => {
  const navigate=useNavigate()
  const [registeredCustomers,setRegisteredCustomers]=useState([])
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage] = useState(10);
  const [filterEmail,setFilterEmail]=useState('')
  const [searchParams, setSearchParams] = useSearchParams();
  const filterfirstName = searchParams.get("firstName") || "";
  const filterlastName = searchParams.get("lastName") || "";

  const handleRegisteredUsersProfile=(id)=>{
    navigate(`/admin/registered-customer/${id}`)
  }



  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cookie');
        const params = {
            pageNo: currentPage,
            size: itemsPerPage,
          };
        const response=await ApiService.getAllPendingAccounts(params)
        toast.success("registered fetch successfully!")
        setRegisteredCustomers(response.data.pagedData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchData(); 
  }, [currentPage, itemsPerPage]);  

// Filtering customers based on the search parameters
const filteredCustomers = registeredCustomers.filter((customer) => {

  const firstNameMatch =
    !filterfirstName ||
    customer.firstName.toLowerCase().includes(filterfirstName.toLowerCase());
  const lastNameMatch =
    !filterlastName ||
    customer.lastName.toLowerCase().includes(filterlastName.toLowerCase());

  return firstNameMatch && lastNameMatch;
});

  const paginate = (pageNumber) => setCurrentPage(pageNumber - 1);
  return (
    <div className="view-customers-container">
      <ViewRegisteredUsersFilter
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
        handleClicked={handleRegisteredUsersProfile}
      />
    </div>
    // <div className="p-4">
    //   <RegisteredCustomers 
    //   paginate={paginate}
    //   registeredCustomers={registeredCustomers}
    //   currentPage={currentPage}
    //   setCurrentPage={setCurrentPage}
    //   totalPages={totalPages}
    //   itemsPerPage={itemsPerPage}
    //   filterfirstName={filterfirstName}
    //   filterlastName={filterlastName}
    //   filterEmail={filterEmail}
    //   setFilterEmail={setFilterEmail}
    //   setFilterfirstName={setFilterfirstName}
    //   setFilterlastName={setFilterlastName}
    //   filteredCustomers={filteredCustomers}/>
    // </div>
  )
}

export default ViewAllRegisteredCustomers

      