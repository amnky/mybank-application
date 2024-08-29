import { BrowserRouter,Routes,Route} from 'react-router-dom';
import { AppProvider } from './component/AppContext';
import LoginPage from './component/Auth/LoginPage';
import PerformTransaction from './component/Customer/PerformTransaction';
import ViewAllCustomers from './component/Admin/ViewAllCustomers';
import UpdateCustomer from './component/SharedComponent/UpdateCustomer';
import UpdatePassword from './component/Auth/UpdatePassword';
import CustomerRegistration from './component/Auth/CustomerRegistration';
import AdminDashBoard from './component/Admin/AdminDashBoard';
import CustomerDashboard from './component/Customer/CustomerDashboard';
import ViewAllRegisteredCustomers from './component/Admin/ViewAllRegisteredCustomers';
import AddCustomerAccount from './component/Admin/AddCustomerAccount';
import AllTransactions from './component/SharedComponent/AllTransactions';
import PersistentHeader from './component/SharedComponent/PersistentHeader';
import Profile from './component/SharedComponent/Profile';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InactiveCustomers from './component/Admin/InactiveCustomers';
import InactiveProfile from './component/SharedComponent/InactiveProfile';
function App() {
  return (
    <div className="App">
      <AppProvider>
       <BrowserRouter>
      <Routes>

        <Route path="/" element={<LoginPage/>}/>
        <Route path="/register" element={<CustomerRegistration/>}></Route>
        <Route
                path="/*"
                element={
                  <>
                    <PersistentHeader />
                    <Routes>
                     
        <Route path="customer/dashboard" element={<CustomerDashboard/>}></Route>
        <Route path="customer/view-transactions" element={<AllTransactions/>}></Route>
        <Route path="customer/perform-transactions" element={<PerformTransaction/>}></Route>
        <Route path="customer/update-password" element={<UpdatePassword/>}></Route>
        <Route path="customer/profile/:id" element={<Profile/>}></Route>

        <Route path="/update-customer" element={<UpdateCustomer/>}></Route>
        

        <Route path="admin/view-customers" element={<ViewAllCustomers/>}></Route>
        <Route path="admin/view-transactions" element={<AllTransactions/>}></Route>
        <Route path="admin/all-registered-customers" element={<ViewAllRegisteredCustomers/>}></Route>
        <Route path="admin/add-registered-customers" element={<AddCustomerAccount/>}></Route>
        <Route path="admin/registered-customer/:id" element={<AddCustomerAccount/>}></Route>
        <Route path="admin/dashboard" element={<AdminDashBoard/>}></Route>
        <Route path="admin/inactive-customers" element={<InactiveCustomers/>}></Route>
        <Route path="admin/inactive-customer/:id" element={<InactiveProfile/>}></Route>
                    </Routes>
                  </>
                }
                />      
      </Routes>
    </BrowserRouter>
    </AppProvider>
    <ToastContainer />
    </div>
  );
}

export default App;
