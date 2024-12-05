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
import SellerDashboard from './Components/Pages/sellerComponent/sellerDashboard';
import './Components/Pages/sellerComponent/sellerDashboard.css';
import SingleProductView from './Components/Pages/SingleProductView/SingleProductView';
import CartData from './Components/Pages/cartdata/CartData';
import SellerProducts from './Components/Pages/sellerComponent/SellerProducts';
import UpdateProduct from './Components/Pages/sellerComponent/UpdateProductForm';
import BuyerDashboard from './Components/Pages/buyerComponent/BuyerDashboard';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import WishlistContainer from './Components/Pages/WishList/Wishlist';


function App() {
  return (
    <>
      {/* Toast notification container */}
      <ToastContainer />
      
      <Router>
        <Routes>
          {/* Static routes */}
          <Route path='/signin' element={<Signin />} />
          <Route path='/Login' element={<Login />} />
          <Route path='/Admin/:login/:id/:usertype' element={<Admin />} />
          <Route path='/seller/:login/:id/:usertype' element={<Seller />} />
          <Route path='/addProducts/:login/:id/:usertype' element={<AddProducts />} />
          <Route path='/sellerDashboard/:login/:id/:usertype' element={<SellerDashboard />} />
          <Route path='/singleView/:login/:id/:usertype/:p_id' element={<SingleProductView />} />
          <Route path='/getcartdata/:login/:id/:usertype/' element={<CartData />} />
          <Route path='/products/:id' element={<SellerProducts />} />
          <Route path='/updateProduct/:id/:p_id' element={<UpdateProduct />} />
          <Route path='/buyerDashboard/:id/:p_id/:usertype' element={<BuyerDashboard />} />
          <Route path='/wishlist/:login/:id/:usertype' element={<WishlistContainer/>}/>

          {/* Base route */}
          <Route path='/' element={<IndexComponent />} />

          {/* Catch-all for dynamic routes */}
          <Route path='/:login/:id/:usertype' element={<IndexComponent />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
