import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        "username": username,
        "password": password
      });
      if (response.status === 200) {
        const data = response.data;
        localStorage.setItem('customerId', data.customerId);
        localStorage.setItem('cookie', data.cookie);
        localStorage.setItem('role',data.userRole)
        if (data.userRole==="ADMIN")
        {
          navigate('admin/dashboard');
        }
        else if (data.userRole==="CUSTOMER")
        {
          navigate('customer/dashboard');
        }
        
      } else {
        const errorData = response.data; 
        setError(errorData.message || 'An error occurred during login.');
      }
    } catch (err) {
      console.error("Axios Error:", err);
      setError(err.response.data.message || 'An error occurred during login.');
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-bold text-center">Login</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-700">
              Username:
            </label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring focus:ring-indigo-200"
          >
            Login
          </button>
        </form>
        <div>
          Don't have an account <Link to={"/register"}> click here</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
