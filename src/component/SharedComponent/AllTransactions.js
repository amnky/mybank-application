import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import axios from 'axios';
import Transaction from './Pagination/Transaction';

function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); // Backend page index starts from 0
  const [totalPages, setTotalPages] = useState(1); // Total pages from the backend
  const [itemsPerPage] = useState(10); // Number of transactions per page
  const [filterAccountNo, setFilterAccountNo] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('cookie');
        const params = {
            page: currentPage,
            size: itemsPerPage,
          };
          let userRole=localStorage.getItem('role').toLowerCase();
          const id=localStorage.getItem('customerId')
          let apiurl=`http://localhost:8080/api/${userRole}/transactions`
          if(userRole==="customer"){
            apiurl+=`/${id}`
          }
          console.log("api is ",apiurl)
          console.log('inside cusomter transacxtions')
        const response = await axios.get(apiurl, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
          params: params
        });

        // Set transactions and pagination data
        setTransactions(response.data.pagedData);
        setTotalPages(response.data.totalPages);
        // console.log("response data is: ", response.data);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
        // Handle the error gracefully, perhaps display an error message to the user
      }
    };

    fetchData(); // Call the function to fetch data when the component mounts or page changes
  }, [currentPage, itemsPerPage]);  

  // Filter transactions based on filter criteria
  const filteredTransactions = transactions.filter(transaction => {
    const accountNoMatch = filterAccountNo === '' || 
      transaction.senderAccountNo.toString().includes(filterAccountNo) || 
      transaction.receiverAccountNo.toString().includes(filterAccountNo);
    const dateMatch =
      (!filterStartDate || new Date(transaction.transactionDate) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(transaction.transactionDate) <= new Date(filterEndDate));
    return accountNoMatch && dateMatch;
  });

  const paginate = (pageNumber) => setCurrentPage(pageNumber - 1); // Adjust for 0-based index

  return (
    <div>
      <Transaction
      paginate={paginate}
      transactions={transactions}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      totalPages={totalPages}
      itemsPerPage={itemsPerPage}
      filterAccountNo={filterAccountNo}
      filterStartDate={filterStartDate}
      filterEndDate={filterEndDate}
      setFilterAccountNo={setFilterAccountNo}
      setFilterStartDate={setFilterStartDate}
      setFilterEndDate={setFilterEndDate}
      filteredTransactions={filteredTransactions}
      format={format}
       />
    </div>
      );
}

export default AllTransactions;
