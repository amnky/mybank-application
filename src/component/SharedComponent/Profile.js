import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from 'bootstrap';
import { useParams } from 'react-router-dom';

function Profile() {
  const [profileData, setProfileData] = useState(null);
  const [firstName,setFirstName]=useState('')
  const [lastName,setLastName]=useState('')
  const [nomineeName,setNomineeName]=useState('')
  const [address,setAddress]=useState('')
  const [email,setEmail]=useState('')
  const {id}=useParams()

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDisabled, setDisabled] = useState(true); // Initially disabled
  const handleUpdateProfile=async(e)=>{
    try{
        
    const token = localStorage.getItem('cookie');
    
        const body = {
            firstName,
            lastName,
            nomineeName,
            address,
            email
          };
        const response = await axios.put(`http://localhost:8080/api/customer/profile/${id}`,body, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
          
        });
        handleChangeData(response)
        console.log('clikced')
    }
    catch(err){
        console.log("error is : ",err.message)
    }
  }
  const handleEditProfile=(e)=>{
    setDisabled(false)
  }
  const handleChangeData=(response)=>{
        setProfileData(response.data);
        setFirstName(response.data.firstName)
        setLastName(response.data.lastName)
        setEmail(response.data.email)
        setAddress(response.data.address)
        setNomineeName(response.data.nomineeName)
  }
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        console.log("id is :",id)
        const token=localStorage.getItem('cookie')
        const response = await axios.get(`http://localhost:8080/api/customer/profile/${id}`,{
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
  useEffect(() => {
    // This will run whenever 'firstName' changes
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
      <button 
      style={{ backgroundColor: isDisabled ? 'gray' : 'green' }}
        disabled={isDisabled}
        onClick={handleUpdateProfile} // Attach the click handler
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
      >
        Trigger Function
      </button>
    </div>
  );
}

export default Profile;