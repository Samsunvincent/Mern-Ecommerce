import { React } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import IndexComponent from './Components/Pages/IndexComponent/IndexComponent';
import './Components/Pages/IndexComponent/IndexComponent.css';
import Signin from './Components/Pages/signinpage/Signin';
import './Components/Pages/signinpage/Signin.css';
import Login from './Components/Pages/loginComponent/Login';
import './Components/Pages/loginComponent/Login.css';
import AdminDashBoard from './Components/Pages/Admin/AdminDashboard';
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
import PlaceOrder from './Components/Pages/PlaceOrder/PlaceOrder';
import OrderData from './Components/Pages/PlaceOrder/OrderData';
import Buyer from './Components/Pages/Admin/Buyer';
import Sellers from './Components/Pages/Admin/Sellers';
import BuyerDetails from './Components/Pages/Admin/BuyerDetails';
import SellerProfile from './Components/Pages/Admin/SellerDetails';



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
          <Route path='/Admin/:login/:id/:usertype' element={<AdminDashBoard />} />
          <Route path='/seller/:login/:id/:usertype' element={<Seller />} />
          <Route path='/addProducts/:login/:id/:usertype' element={<AddProducts />} />
          <Route path='/sellerDashboard/:login/:id/:usertype' element={<SellerDashboard />} />
          <Route path='/singleView/:login/:id/:usertype/:p_id' element={<SingleProductView />} />
          <Route path='/getcartdata/:login/:id/:usertype/' element={<CartData />} />
          <Route path='/products/:id' element={<SellerProducts />} />
          <Route path='/updateProduct/:id/:p_id' element={<UpdateProduct />} />
          <Route path='/buyerDashboard/:id/:p_id/:usertype' element={<BuyerDashboard />} />
          <Route path='/wishlist/:login/:id/:usertype' element={<WishlistContainer/>}/>
          <Route path='/buynow/:login/:id/:usertype/:p_id/:price' element={<PlaceOrder/>}/>
          <Route path='/orderdata/:login/:id/:usertype' element={<OrderData/>}/>
          <Route path='/Buyer/:login/:id/:usertype' element={<Buyer/>}/>
          <Route path='/Sellers/:login/:id/:usertype' element={<Sellers/>}/>
          <Route path='/Buyerdetails/:login/:id/:usertype/:b_id' element={<BuyerDetails/>}/>
          <Route path='/SellerDetails/:login/:id/:usertype/:s_id' element={<SellerProfile/>}/>

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
