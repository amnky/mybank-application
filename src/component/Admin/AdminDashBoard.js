import React from 'react';
import { Link, Outlet } from 'react-router-dom';

const AdminDashBoard = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center">
      <div className="w-full max-w-4xl bg-green-800 text-white p-4">
        <h2 className="text-xl font-bold mb-6 text-center">Admin Dashboard</h2>
        <div className="grid grid-cols-2 gap-4">
          <Link to="/admin/view-customers" className="block p-4 bg-gray-700 rounded hover:bg-gray-600 text-center">
            All Customers
          </Link>
          <Link to="/admin/view-transactions" className="block p-4 bg-gray-700 rounded hover:bg-gray-600 text-center" >
            Transactions
          </Link>
          <Link to="/admin/all-registered-customers" className="block p-4 bg-gray-700 rounded hover:bg-gray-600 text-center">
            Registered Users
          </Link>
        </div>
      </div>
      <div className="w-full max-w-4xl p-4">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminDashBoard;
