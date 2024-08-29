import React, { useState } from 'react';
import { toast } from 'react-toastify'; 
import ApiService from '../SharedComponent/Services/ApiServices';

const PerformTransaction = () => {
  const [fromAccount, setFromAccount] = useState('');
  const [toAccount, setToAccount] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTransaction = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('cookie');
      const customerId=localStorage.getItem('customerId')
      const body={
        senderCustomerId:customerId,
        receiverAccountNumber:toAccount,
        transactionAmount: amount
      }

      const response=await ApiService.PerformTransaction(body)
      if(response.data.status===false){
         setError("Transaction failed")
         toast.error('Transaction failed.', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnFocusLoss: false,
          draggable: true,
          progress: undefined,
        });
       }
       else{
        setSuccess(`Transaction successful! with transaction id ${response.data.transactionId}`);
        setError('');
       }
      
    } catch (error) {
      if (error.response && error.response.data) {
        setError(error.response.data.message || 'An error occurred');
      } else {
        setError('An error occurred');
      }
      setSuccess('');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Perform Transaction</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          {success}
        </div>
      )}

      <form onSubmit={handleTransaction}>
        

        <div className="mb-4">
          <label className="block text-gray-700">Enter Account Number</label>
          <input
            type="number"
            value={toAccount}
            onChange={(e) => setToAccount(e.target.value)}
            className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter to account"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Enter Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter amount"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default PerformTransaction;
