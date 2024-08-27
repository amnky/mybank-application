import React from 'react'
import { Link, Outlet } from 'react-router-dom';


const CustomerDashboard = () => {
  const id=localStorage.getItem('customerId')
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-green-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 text-center">Customer Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to={`/customer/profile/${id}`} className="block p-4 bg-gray-700 rounded hover:bg-gray-600 text-center">
            Profile
          </Link>
          <Link to="/customer/view-transactions" className="block p-4 bg-gray-700 rounded hover:bg-gray-600 text-center" >
            My Transactions
          </Link>
          <Link to="/customer/perform-transactions" className="block p-4 bg-gray-700 rounded hover:bg-gray-600 text-center">
            Perform Transaction
          </Link>
        </div>
      </div>
      <div className="w-full max-w-4xl p-4">
        <Outlet />
      </div>
    </div>
  )
}

export default CustomerDashboard
