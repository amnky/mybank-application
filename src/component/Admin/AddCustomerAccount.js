import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import { useParams,useNavigate } from 'react-router-dom';
import ApiService from '../SharedComponent/Services/ApiServices';

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
  const [isDisabled, setDisabled] = useState(true);
  const handleUpdateProfile=async(e)=>{
    try{
        
      await ApiService.addAccount(id)
      toast.success("customer added successfully!")
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
      await  ApiService.deleteRegisteredUser(id)
      toast.success("customer deleted successfully!")
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
      const response=await ApiService.downloadAadhar(id)

  const contentDisposition = response.headers['content-disposition'];
  let filename = 'downloaded_file.xlsx';

  if (contentDisposition && contentDisposition.includes('filename=')) {
    filename = contentDisposition
      .split('filename=')[1]
      .split(';')[0]
      .replace(/['"]/g, ''); 
  } else {
    const contentType = response.headers['content-type'];
    if (contentType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      filename = 'downloaded_file.xlsx';
    }
    else{

    const extension = contentType ? contentType.split('/')[1] : 'bin'; 
    filename = `downloaded_file.${extension}`;
    }
  }

  const url = window.URL.createObjectURL(new Blob([response.data]));

  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();

  link.remove();
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
        setAadhar(response.data.uniqueIdentificationNumber)
  }
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token=localStorage.getItem('cookie')
        const response =await ApiService.getPendingAccount(id)
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
        onClick={handleEditProfile} 
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
        onClick={handleUpdateProfile} 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Add Customer
      </button>
      <button 
        onClick={handleDeleteCustomer}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Delete Customer
      </button>
      </div>
    </div>
  );
}

export default AddCustomerAccount;