import React, { useState } from 'react';
import { toast } from 'react-toastify'; 
import { Link } from 'react-router-dom';
import ApiService from '../SharedComponent/Services/ApiServices';
const CustomerRegistration = () => {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState('');
    
    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      nomineeName: '',
      address: '',
      email: '',
      uniqueIdentificationNumber: '',
    });
  
  
    const handleFileChange = (e) => {
      setFile(e.target.files[0]);
    };
  
    const handleSubmitDocument = async (id,uid) => {
    //   e.preventDefault();
      console.log("id is:",id)
      const formData = new FormData();
      formData.append('file', file);
  
      try {
        const response =await ApiService.uploadDocument(id,uid,formData)
        setMessage('File uploaded successfully');
        toast.success("registration success")
        console.log(response.data);
        
      } catch (error) {
        console.error(error);
        setMessage('Failed to upload file');
      }
    };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response =await ApiService.registerUserRequest(formData)
    //   setRegisterId(response.data)
      console.log("response from first api is :",response.data)
      handleSubmitDocument(response.data,formData.uniqueIdentificationNumber)

    } catch (error) {
      console.error(error); // Handle error
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full  max-w-md p-8 space-y-4 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-center mb-4">Registration Form</h1>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto">
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-gray-700">
            First Name
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="lastName" className="block text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nomineeName" className="block text-gray-700">
          Nominee Name
          </label>
          <input
            type="text"
            id="nomineeName"
            name="nomineeName"
            value={formData.nomineeName}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700">
          email
          </label>
          <input
            type="text"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="uniqueIdentificationNumber" className="block text-gray-700">
            Aadhar Number
          </label>
          <input
            type="text"
            id="uniqueIdentificationNumber"
            name="uniqueIdentificationNumber"
            value={formData.uniqueIdentificationNumber}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-lg"
            onKeyDown={(e) => {
              if (e.keyCode === 38 || e.keyCode === 40) {
                e.preventDefault();
              }
            }}
            onInput={(e) => {
              const inputValue = e.target.value;
              const regex = /^[0-9]+$/;
              if (!regex.test(inputValue)) {
                e.target.value = inputValue.replace(/[^0-9]/g, '');
              }
            }}
          />
        </div>
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <label htmlFor="file" className="block text-gray-700">
            Upload Aadhar
          </label>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="file">
            Select a file
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded-md w-full"
            required
          />
        </div>

        {message && (
          <p className={`mb-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
            {message}
          </p>
        )}
        </div>
        {/* Add input fields for lastName, nomineeName, address, email, and uniqueIdentificationNumber */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Register
        </button>
      </form>
      <div>
          Already have an account <Link to={"/"}> click here</Link>
        </div>
        </div>
    </div>
  );
};

export default CustomerRegistration;