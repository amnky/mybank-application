import React, { useState ,useEffect } from 'react'
import axios from 'axios';
import RegisteredCustomers from '../SharedComponent/Pagination/RegisteredCustomers';
const ViewAllRegisteredCustomers = () => {
  const [registeredCustomers,setRegisteredCustomers]=useState([])
  const [filterfirstName, setFilterfirstName] = useState('');
  const [filterlastName, setFilterlastName] = useState('');
  const [currentPage, setCurrentPage] = useState(0); // Backend page index starts from 0
  const [totalPages, setTotalPages] = useState(1); // Total pages from the backend
  const [itemsPerPage] = useState(10); // Number of transactions per page
  const [filterEmail,setFilterEmail]=useState('')


  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cookie');
        const params = {
            pageNo: currentPage,
            size: itemsPerPage,
          };
        const response = await axios.get('http://localhost:8080/api/admin/pending-accounts', {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
          params: params
        });

        // Set transactions and pagination data
        setRegisteredCustomers(response.data.pagedData);
        setTotalPages(response.data.totalPages);
        // console.log("response data is: ", response.data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        // Handle the error gracefully, perhaps display an error message to the user
      }
    };

    fetchData(); // Call the function to fetch data when the component mounts or page changes
  }, [currentPage, itemsPerPage]);  


  const filteredCustomers = registeredCustomers.filter(registeredcustomers => {

    const firstNameMatch = 
    filterfirstName === '' || 
    registeredcustomers.firstName
        .toString()
        .toLowerCase()
        .includes(filterfirstName.toLowerCase());
    const lastNameMatch = 
    filterlastName === '' || 
    registeredcustomers.lastName
        .toString()
        .toLowerCase()
        .includes(filterlastName.toLowerCase());

    
    const email = 
    filterEmail === '' || 
    registeredcustomers.email
        .toString()
        .toLowerCase()
        .includes(filterEmail.toLowerCase());
    
    return email && firstNameMatch && lastNameMatch;
  });
  const paginate = (pageNumber) => setCurrentPage(pageNumber - 1);
  return (
    <div className="p-4">
      <RegisteredCustomers 
      paginate={paginate}
      registeredCustomers={registeredCustomers}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      filterfirstName={filterfirstName}
      filterlastName={filterlastName}
      filterEmail={filterEmail}
      setFilterEmail={setFilterEmail}
      setFilterfirstName={setFilterfirstName}
      setFilterlastName={setFilterlastName}
      filteredCustomers={filteredCustomers}/>
    </div>
  )
}

export default ViewAllRegisteredCustomers

      