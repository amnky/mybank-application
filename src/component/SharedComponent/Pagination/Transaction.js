import React from 'react'
import Pagination from './Pagination'

const Transaction = ({  paginate,filteredTransactions,format,currentPage,setCurrentPage,
  totalPages,filterAccountNo,filterStartDate,filterEndDate,setFilterAccountNo,
  setFilterStartDate,setFilterEndDate
}) => {
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Transaction Details</h1>
    
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row mb-4">
        <div className="mb-2 md:mr-2">
          <label htmlFor="filterAccountNo" className="block mb-1">Account No:</label>
          <input 
            type="text" 
            id="filterAccountNo" 
            value={filterAccountNo} 
            onChange={(e) => setFilterAccountNo(e.target.value)} 
            className="border border-gray-300 rounded px-2 py-1" 
          />
        </div>
        <div className="mb-2 md:mr-2">
          <label htmlFor="filterStartDate" className="block mb-1">Start Date:</label>
          <input 
            type="date" 
            id="filterStartDate" 
            value={filterStartDate} 
            onChange={(e) => setFilterStartDate(e.target.value)} 
            className="border border-gray-300 rounded px-2 py-1" 
          />
        </div>
        <div className="mb-2">
          <label htmlFor="filterEndDate" className="block mb-1">End Date:</label>
          <input 
            type="date" 
            id="filterEndDate" 
            value={filterEndDate} 
            onChange={(e) => setFilterEndDate(e.target.value)} 
            className="border border-gray-300 rounded px-2 py-1" 
          />
        </div>
      </div>

      {/* Transaction Table */}
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
          <th className="border px-4 py-2">Transaction Id</th>
            <th className="border px-4 py-2">Sender Account No</th>
            <th className="border px-4 py-2">Receiver Account No</th>
            <th className="border px-4 py-2">Amount</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredTransactions.map((transaction, index) => (
            <tr key={index}>
              <td className="border px-4 py-2">{transaction.transactionId}</td>
              <td className="border px-4 py-2">{transaction.senderAccountNo}</td>
              <td className="border px-4 py-2">{transaction.receiverAccountNo}</td>
              <td className="border px-4 py-2">{transaction.amount}</td>
              <td className="border px-4 py-2">{format(new Date(transaction.transactionDate), 'yyyy-MM-dd')}</td>
              <td className="border px-4 py-2">{transaction.status ? "Success" : "Failed"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>

  )
}

export default Transaction
