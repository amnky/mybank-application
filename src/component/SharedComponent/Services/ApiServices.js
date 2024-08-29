import axios from 'axios';

const apiBaseUrl = 'http://localhost:8080/api';
const token = localStorage.getItem('cookie');

const ApiService = {
    
  // Fetch posts with pagination
  addAccount: async (id) => {
    const response = await axios.post(`${apiBaseUrl}/admin/pending-accounts/${id}`,{}, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
        
      });
  },

  // Get a specific post by ID
  deleteRegisteredUser: async (id) => {
    const response = await axios.delete(`${apiBaseUrl}/admin/pending-accounts/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
        
      });
  },

  // Create a new post with specified data
  downloadAadhar: async (id) => {
    const response = await axios.get(`${apiBaseUrl}/admin/download-aadhar/${id}`,{
      headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        responseType: 'blob',
      });
      return response
  },

    // Create a new post with specified data
    getPendingAccount: async (id) => {
        const response = await axios.get(`${apiBaseUrl}/admin/pending-account/${id}`,{
          headers: {
              'Authorization': `Bearer ${token}` // Include the token in the Authorization header
            },
          });
          return response
      },


        // Create a new post with specified data
  getCurrentBalance: async (customerId) => {
    const response = await axios.get(`${apiBaseUrl}/customer/accounts-balance/${customerId}`,{
      headers: {
        'Authorization': `Bearer ${token}` // Include the token in the Authorization header
      }
    });
      return response
  },

    // Create a new post with specified data
    getAllAccountsBalances: async () => {
        const response = await axios.get(`${apiBaseUrl}/customer/accounts-balances`,{
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
        
      });
          return response
      },

        // Create a new post with specified data
    updateCustomerProfile: async (id,body) => {
    const response = await axios.put(`${apiBaseUrl}/customer/profile/${id}`,body, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          }
          
        });
      return response
  },



  getCustomerProfile: async (id) => {
    const response = await axios.get(`${apiBaseUrl}/customer/profile/${id}`,{
        headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },});
      return response
  },
  getAllCustomers: async (params) => {
    const response = await axios.get(`${apiBaseUrl}/admin/customers`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
          params: params
        });
      return response
  },
  getAllPendingAccounts: async (params) => {
    const response = await axios.get(`${apiBaseUrl}/admin/pending-accounts`, {
          headers: {
            'Authorization': `Bearer ${token}` // Include the token in the Authorization header
          },
          params: params
        });
      return response
  },
  registerUserRequest: async (formData) => {
    const response = await axios.post(`${apiBaseUrl}/auth/register`, formData);
      return response
  },
  uploadDocument: async (id,uid,formData) => {
    const response = await axios.post(`${apiBaseUrl}/auth/register/${id}/${uid}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      return response
  },
  loginUser: async (username,password) => {
    console.log("username and passsword",username," ",password)
    const response = await axios.post(`${apiBaseUrl}/auth/login`, {
        "username": username,
        "password": password
      });
      return response
  },
  PerformTransaction: async (body) => {
    const response = await axios.post(
        `${apiBaseUrl}/customer/transactions`,body,{
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        }
      );
      return response
  },
  getAllTransactions: async (apiurl,params) => {
    const response = await axios.get(apiurl, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        params: params
      });
      return response
  },
  deleteCustomer: async (id) => {
    const response = await axios.delete(`${apiBaseUrl}/admin/customers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      return response
  },
  getAllInactiveCustomers: async (params) => {
    const response = await axios.get(`${apiBaseUrl}/admin/inactive-customers`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        },
        params:params
      });
      return response
  },
  getInactiveCustomerProfile: async (id) => {
    const response = await axios.get(`${apiBaseUrl}/admin/inactive-customer/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      return response
  },
  ActiveCustomer: async (id) => {
    const response = await axios.post(`${apiBaseUrl}/admin/activate-customer/${id}`,{},{
        headers: {
          'Authorization': `Bearer ${token}` // Include the token in the Authorization header
        }
      });
      return response
  },

  // ... other API methods
};

export default ApiService;