import React, { useState ,useEffect } from 'react'
import axios from 'axios';
import Customer from '../SharedComponent/Pagination/Customer';

const ViewAllCustomers = () => {
  const [customers,setCustomers]=useState([])
  // const [firstName,setFirstName]=useState("")
  // const [lastName,setLastName]=useState("")
  // const [accountNumber,setAccountNumber]=useState()
  // const [balance,setBalance]=useState()
  // const [customerId,setCustomerId]=useState()
  const [filterAccountNo, setFilterAccountNo] = useState('');
  const [filterfirstName, setFilterfirstName] = useState('');
  const [filterlastName, setFilterlastName] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Backend page index starts from 0
  const [totalPages, setTotalPages] = useState(1); // Total pages from the backend
  const [itemsPerPage] = useState(10); // Number of transactions per page


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cookie');
        const params = {
            pageNo: currentPage,
            size: itemsPerPage,
          };
        const response = await axios.get('http://localhost:8080/api/admin/customers', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
          params: params
        });

        // Set transactions and pagination data
        setCustomers(response.data.pagedData);
        setTotalPages(response.data.totalPages);
        console.log("response data is: ", response.data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        // Handle the error gracefully, perhaps display an error message to the user
      }
    };

    fetchData(); // Call the function to fetch data when the component mounts or page changes
  }, [currentPage, itemsPerPage]);  


  const filteredCustomers = customers.filter(customer => {
    const accountNoMatch = filterAccountNo === '' || 
    customer.accountNumber.toString().includes(filterAccountNo) || 
    customer.accountNumber.toString().includes(filterAccountNo);
    const firstNameMatch = 
    filterfirstName === '' || 
    customer.firstName
        .toString()
        .toLowerCase()
        .includes(filterfirstName.toLowerCase());
    
    const lastNameMatch = 
    filterlastName === '' || 
    customer.lastName
        .toString()
        .toLowerCase()
        .includes(filterlastName.toLowerCase());
    
    return accountNoMatch && firstNameMatch && lastNameMatch;
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber - 1); // Adjust for 0-based index

  return (
    <div className="p-4">
      <Customer
      paginate={paginate}
      customers={customers}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      filterfirstName={filterfirstName}
      filterlastName={filterlastName}
      filterAccountNo={filterAccountNo}
      setFilterAccountNo={setFilterAccountNo}
      setFilterfirstName={setFilterfirstName}
      setFilterlastName={setFilterlastName}
      filteredCustomers={filteredCustomers}
       />
    </div>
  )
}

export default ViewAllCustomers
