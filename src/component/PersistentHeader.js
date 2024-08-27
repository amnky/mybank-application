import React,{ useEffect, useState } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import axios from 'axios';

function PersistentHeader() {
  const role=localStorage.getItem('role')
  const token=localStorage.getItem('cookie')
  const customerId=localStorage.getItem('customerId')
  const [balance,setBalance]=useState('')
  const [currentBalance,setCurrentBalance]=useState('')
  useEffect(() => {
  const handleBalance=async()=>{
    try{
      const response = await axios.get(`http://localhost:8080/api/customer/accounts-balances`,{
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
        
      });
      setBalance(response.data)
    }
    catch(err){
      console.log(err.message)
    }
  }
  handleBalance()
  const handleCurrentBalance=async()=>{
  try{
    const response = await axios.get(`http://localhost:8080/api/customer/accounts-balance/${customerId}`,{
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      }
    });
    setCurrentBalance(response.data)
  }
  catch(err){
    console.log(err.message)
  }
}
handleCurrentBalance()
}
)
    const navigate=useNavigate()
    const handleLogout=()=>{
        localStorage.removeItem('cookie') 
        navigate('/')
    }
    const handleProfile=()=>{
      navigate(`/customer/profile/${customerId}`)
    }
   
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* User Profile Section */}
      <div className="flex items-center" onClick={handleProfile}>
        <img 
          src="/user-avatar.png" // Replace with your actual avatar path
          alt="User Avatar" 
          className="h-10 w-10 rounded-full mr-2" 
        />
        <span className="font-semibold">Profile</span> {/* Replace with actual user name */}
      </div>

      {/* Navigation */}
     {localStorage.getItem('role')==="ADMIN" ? 
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/admin/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/admin/view-customers" className="hover:text-gray-300">All Customers</Link></li>
          <li><Link to="/admin/view-transactions" className="hover:text-gray-300">All Transacations</Link></li>
          <li><Link to="/admin/all-registered-customers" className="hover:text-gray-300">Registered Users</Link></li>
        </ul>
      </nav>
      :
      <nav>
        <ul className="flex space-x-4">
          <li><Link to="/customer/dashboard" className="hover:text-gray-300">Dashboard</Link></li>
          <li><Link to="/customer/perform-transactions" className="hover:text-gray-300">Perform Transacations</Link></li>
          <li><Link to="/customer/view-transactions" className="hover:text-gray-300">My Transacations</Link></li>
        </ul>
        <div class="flex justify-between">
  <p class="text-blue-500">My Balance {balance}</p>
  <p class="text-green-500">Current Account Balance {currentBalance}</p>
</div>
        
      </nav>
      
      }
      
      <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={handleLogout}>
        Logout
        
      </button>
    </header>
  );
}

export default PersistentHeader;