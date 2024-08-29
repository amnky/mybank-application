import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { toast } from 'react-toastify'; 
import Transaction from './Pagination/Transaction';
import ApiService from './Services/ApiServices';

function AllTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(0); 
  const [totalPages, setTotalPages] = useState(1); 
  const [itemsPerPage] = useState(10);
  const [filterAccountNo, setFilterAccountNo] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('asc');
  const [sortBy, setSortBy] = useState('amount');
  const [sortedTransactions, setSortedTransactions] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
      try {
        const params = {
          pageNo: currentPage,
          size: itemsPerPage,
        };
        let userRole = localStorage.getItem('role').toLowerCase();
        const id = localStorage.getItem('customerId');
        let apiurl = `http://localhost:8080/api/${userRole}/transactions`;
        if (userRole === 'customer') {
          apiurl += `/${id}`;
        }
        console.log('api is ', apiurl);
        const response = await ApiService.getAllTransactions(apiurl, params);
        toast.success('Transaction fetched successfully!');

        setTransactions(response.data.pagedData);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error('Error fetching transaction data:', error);
      }
    };

    fetchData(); 
  }, [currentPage, itemsPerPage]);

  
  const filteredTransactions = transactions.filter((transaction) => {
    const accountNoMatch =
      filterAccountNo === '' ||
      transaction.senderAccountNo.toString().includes(filterAccountNo) ||
      transaction.receiverAccountNo.toString().includes(filterAccountNo);
    const dateMatch =
      (!filterStartDate || new Date(transaction.transactionDate) >= new Date(filterStartDate)) &&
      (!filterEndDate || new Date(transaction.transactionDate) <= new Date(filterEndDate));
    return accountNoMatch && dateMatch;
  });

  useEffect(() => {
    const sortTransactions = () => {
      const sorted = [...filteredTransactions].sort((a, b) => {
        if (sortBy === 'amount') {
          return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
        } else if (sortBy === 'time') {
          return sortOrder === 'asc'
            ? new Date(a.transactionDate) - new Date(b.transactionDate)
            : new Date(b.transactionDate) - new Date(a.transactionDate);
        }
        return 0;
      });
      setSortedTransactions(sorted);
    };
    sortTransactions();
  }, [filteredTransactions, sortOrder, sortBy]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber - 1);

  return (
    <div>
      <Transaction
        paginate={paginate}
        transactions={sortedTransactions}
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
        format={format}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </div>
  );
}

export default AllTransactions;


