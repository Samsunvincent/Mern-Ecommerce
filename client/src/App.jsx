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





function App() {
  return (
    <>
      <Router>
        <Routes>
          <Route path='/' element={<IndexComponent />} />
          <Route path='/:login/:id' element={<IndexComponent />} />
          <Route path='/signin' element={<Signin/>}/>
          <Route path='/Login' element={<Login />} />
          <Route path='/Admin/:login/:id' element= {<Admin/>}/>
          {/* <Route path='/' element={<Buyer/>}/> */}
          <Route path='/seller' element={<Seller/>}/>


        </Routes>
      </Router>
    </>
  );
}

export default App;

