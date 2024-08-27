import React from 'react'
import { useNavigate } from 'react-router-dom'

const RegisteredCustomers = ({paginate,registeredCustomers,currentPage,setCurrentPage,
  totalPages,itemsPerPage,filterfirstName,filterlastName,filterEmail,setFilterEmail,
  setFilterfirstName,setFilterlastName,filteredCustomers}) => {

    const navigate=useNavigate()
    const handleUserProfile=(id)=>{
      console.log('id is:',id)
      navigate(`/admin/registered-customer/${id}`)
    }
  return (
    <div>
      <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Registered Customer Details</h1>
    
      {/* Filter Section */}
      <div className="flex flex-col md:flex-row mb-4">
        <div className="mb-2 md:mr-2">
          <label htmlFor="filterEmail" className="block mb-1">Email:</label>
          <input 
            type="text" 
            id="filterEmail" 
            value={filterEmail} 
            onChange={(e) => setFilterEmail(e.target.value)} 
            className="border border-gray-300 rounded px-2 py-1" 
          />
        </div>
        
        <div className="mb-2">
          <label htmlFor="filterfirstName" className="block mb-1">firstName</label>
          <input 
            type="text" 
            id="filterfirstName" 
            value={filterfirstName} 
            onChange={(e) => setFilterfirstName(e.target.value)} 
            className="border border-gray-300 rounded px-2 py-1" 
          />
        </div>
        <div className="mb-2">
          <label htmlFor="filterfirstName" className="block mb-1">lastName</label>
          <input 
            type="text" 
            id="filterlastName" 
            value={filterlastName} 
            onChange={(e) => setFilterlastName(e.target.value)} 
            className="border border-gray-300 rounded px-2 py-1" 
          />
          </div>
      </div>


      {/* Transaction Table */}
      <table className="table-auto w-full border border-gray-300">
        <thead>
          <tr>
          <th className="border px-4 py-2" >Aadhar No.</th>
            <th className="border px-4 py-2">firstName</th>
            <th className="border px-4 py-2">lastName</th>
            <th className="border px-4 py-2">email</th>
            
            
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.map((customer, index) => (
            <tr key={index}>
              <td className="border px-4 py-2" onClick={()=>handleUserProfile(customer.id)}>{customer.uniqueIdentificationNumber}</td>
              <td className="border px-4 py-2">{customer.firstName}</td>
              <td className="border px-4 py-2">{customer.lastName}</td>
              <td className="border px-4 py-2">{customer.email}</td>
              
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <ul className="flex">
          {Array.from({ length: totalPages }).map((_, index) => (
            <li key={index} className={`px-3 py-2 border ${currentPage === index ? 'bg-blue-500 text-white' : 'bg-gray-300 hover:bg-gray-400'}`}>
              <button onClick={() => paginate(index + 1)}>{index + 1}</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    </div>

  )
}

export default RegisteredCustomers
