import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexComponent from './Components/Pages/IndexComponent/IndexComponent';
import './Components/Pages/IndexComponent/IndexComponent.css';
import Signin from './Components/Pages/signinpage/Signin';
import './Components/Pages/signinpage/Signin.css';
import Login from './Components/Pages/loginComponent/Login';
import './Components/Pages/loginComponent/Login.css';
import Admin from './Components/Pages/adminComponent/Admin';
import Seller from './Components/Pages/sellerComponent/SellerComponent';
import AddProducts from './Components/Pages/addProductsComponent/addProducts';
import sellerDashboard from './Components/Pages/sellerComponent/sellerDashboard';
import './Components/Pages/sellerComponent/sellerDashboard.css';






function App() {
  return (
    <>
      <>
        <Router>
          <Routes>
            {/* Move dynamic routes to the bottom */}
            <Route path='/signin' element={<Signin />} />
            <Route path='/Login' element={<Login />} />
            <Route path='/Admin/:login/:id/:usertype' element={<Admin />} />
            <Route path='/seller/:login/:id/:usertype' element={<Seller />} />
            <Route path='/addProducts/:login/:id/:usertype' element={<AddProducts/>}/>

            {/* Base route */}
            <Route path='/' element={<IndexComponent />} />

            {/* Catch-all for dynamic routes */}
            <Route path='/:login/:id/:usertype' element={<IndexComponent />} />
          </Routes>
        </Router>
      </>


    </>
  );
}

export default App;

