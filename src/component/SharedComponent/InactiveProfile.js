import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify'; 
import { useParams } from 'react-router-dom';
import ApiService from './Services/ApiServices';
import { useNavigate } from 'react-router-dom';

function InactiveProfile() {
  const navigate=useNavigate()
  const role=localStorage.getItem('role')
  const [profileData, setProfileData] = useState(null);
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const {id}=useParams()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const handleActiveCustomer=async(e)=>{
    const response=await ApiService.ActiveCustomer(id)
    toast.success("customer activated successfully")
    navigate("/admin/inactive-customers")
  }
  const handleChangeData=(response)=>{
        setProfileData(response.data);
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
  }
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log("id is :",id)
        const response=await ApiService.getInactiveCustomerProfile(id)
        toast.success("profiled fetched successfully!")
        handleChangeData(response)
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchProfileData();
  }, []);
  useEffect(() => {
    console.log('Updated firstName:', firstName); 
  }, [firstName]);
  if (loading) {
    return <div className="text-center p-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-center p-4 text-red-500">Error: {error.message}</div>;
  }

  return (
    
    <div className="container mx-auto p-4">

      <h1 className="text-3xl font-bold mb-4">Inactive Customer Profile</h1>

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

            disabled
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
            disabled
            onChange={(e)=>setLastName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4"> 

          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            id="accountNumber"
            name="accountNumber"
            value={profileData.accountNumber}
            disabled 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4"> 

          <label htmlFor="balance" className="block text-sm font-medium text-gray-700">
            Balance
          </label>
          <input
            type="text"
            id="balance"
            name="balance"
            value={profileData.balance}
            disabled 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="mb-4"> 

          <label htmlFor="customerId" className="block text-sm font-medium text-gray-700">
            CustomerId
          </label>
          <input
            type="text"
            id="customerId"
            name="customerId"
            value={profileData.customerId}
            disabled 
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>    
      </div>
      <div className="flex justify-center">
    {role === "ADMIN" && (
        <button
            onClick={handleActiveCustomer}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
            Activate Customer
        </button>
    )}
</div>
    </div>
  );
}

export default InactiveProfile;