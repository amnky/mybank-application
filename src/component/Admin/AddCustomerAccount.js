import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'bootstrap';
import { useParams,useNavigate } from 'react-router-dom';

function AddCustomerAccount() {
  const navigate=useNavigate()
  const [profileData, setProfileData] = useState(null);
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [nomineeName,setNomineeName]=useState('')
  const [address,setAddress]=useState('')
  const [email,setEmail]=useState('')
  const [aadhar,setAadhar]=useState('')
  const {id}=useParams()

  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDisabled, setDisabled] = useState(true); // Initially disabled
  const handleUpdateProfile=async(e)=>{
    try{
        
      const token = localStorage.getItem('cookie');
    
        
        const response = await axios.post(`http://localhost:8080/api/admin/pending-accounts/${id}`,{}, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
          
        });
        navigate('/admin/all-registered-customers')
    }
    catch(err){
        console.log("error is : ",err.message)
    }
  }
  const handleEditProfile=(e)=>{
    setDisabled(false)
  }
  const handleDeleteCustomer=async(e)=>{
    try{
      const token=localStorage.getItem('cookie')
      const response = await axios.delete(`http://localhost:8080/api/admin/pending-accounts/${id}`,{
      headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
      });
      navigate('/admin/all-registered-customers')
    }
    catch(err){
        console.log(err.message)
    }
  }

  const handleDownloadAadhar=async(e)=>{
    e.preventDefault()
    try{
      const token=localStorage.getItem('cookie')
      const response = await axios.get(`http://localhost:8080/api/admin/download-aadhar/${id}`,{
      headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        responseType: 'blob',
      });
      // Extract filename from Content-Disposition header
    const contentDisposition = response.headers['content-disposition'];
    let filename = 'downloaded_file'; // Default filename

    if (contentDisposition && contentDisposition.includes('filename=')) {
      filename = contentDisposition
        .split('filename=')[1]
        .split(';')[0]
        .replace(/['"]/g, ''); // Remove quotes if any
    } else {
      // Optional: Extract file extension from response data if possible
      const contentType = response.headers['content-type'];
      const extension = contentType.split('/')[1];
      filename = `downloaded_file.${extension}`;
    }

    // Create a URL for the blob object
    const url = window.URL.createObjectURL(new Blob([response.data]));

    // Create a link and trigger the download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
    }
    catch(err){

    }
    
  }
  const handleChangeData=(response)=>{
        setProfileData(response.data);
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setEmail(response.data.email)
        setAddress(response.data.address)
        setNomineeName(response.data.nomineeName)
        setAadhar(response.data.identificationNumber)
  }
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        // console.log("id is :",id)
        const token=localStorage.getItem('cookie')
        const response = await axios.get(`http://localhost:8080/api/admin/pending-account/${id}`,{
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },});
        handleChangeData(response)
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    
    <div className="container mx-auto p-4">

      <h1 className="text-3xl font-bold mb-4">User Profile</h1>
      <button 
        onClick={handleEditProfile} // Attach the click handler
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
       Edit Profile
      </button>

      <div className="bg-white shadow-md rounded p-6">
        <div className="mb-4">
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"

            id="firstName"
            name="firstName"
            value={firstName} 

            disabled={isDisabled}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>


        <div className="mb-4">

          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={lastName}
            disabled ={isDisabled}
            onChange={(e)=>setLastName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nomineeName" className="block text-sm font-medium text-gray-700">
            Nominee Name
          </label>
          <input
            type="text" 

            id="nomineeName"
            name="nomineeName"
            value={nomineeName}

            disabled={isDisabled}
            onChange={(e) => setNomineeName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text" 

            id="address"
            name="address"
            value={address} 

            disabled={isDisabled}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="text" 

            id="email"
            name="email"
            value={email} 

            disabled={isDisabled}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4"> 

          <label htmlFor="uniqueIdentificationNumber" className="block text-sm font-medium text-gray-700">
            Aadhar Number
          </label>
          <input
            type="text"
            id="uniqueIdentificationNumber"
            name="uniqueIdentificationNumber"
            value={aadhar}
            onChange={(e) => setAadhar(e.target.value)}
            disabled={isDisabled} 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button 
        onClick={handleDownloadAadhar} 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Download Aadhar
      </button>   
      </div>
      <div className='flex flex-col space-y-4 p-4 bg-gray-100 rounded-md'>
      <button 
        onClick={handleUpdateProfile} // Attach the click handler
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Add Customer
      </button>
      <button 
        onClick={handleDeleteCustomer} // Attach the click handler
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Delete Customer
      </button>
      </div>
    </div>
  );
}

export default AddCustomerAccount;