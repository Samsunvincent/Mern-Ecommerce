const express = require('express');
const Router = express.Router();
const usercontroller = require('../Controller/userController');
const accessControl = require('../Controller/access-Controller').accessControl



function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

Router.post('/signin',setAccessControl('*'),usercontroller.signin)
Router.get('/getUserType',usercontroller.getUserTypes);
Router.get('/users',setAccessControl('*'),usercontroller.getAllUsers);
Router.get('/user/:id',setAccessControl('*'),usercontroller.getUser);
Router.get('/getcategory',usercontroller.getCategory);
Router.patch('/updateuser/:id',usercontroller.updateUserData)

Router.patch('/addAddress/:id',usercontroller.addAddress);
Router.get('/getAddress/:id',usercontroller.getAddress);

//filter
Router.post('/filter',usercontroller.filterCategory)


//Cart
Router.post('/addtocart',usercontroller.addToCart);
Router.get('/getCartData/:id',usercontroller.getCartData)
Router.delete('/removeCartData/:id',usercontroller.removeCartData)

//place order

Router.post('/placeOrders/:id',usercontroller.placeOrders)

//wishlist
Router.post('/addtowishlist/:id/:p_id',usercontroller.addToWishlist)
Router.get('/getwishlist/:id',usercontroller.getWishlist)
Router.delete('/deletewishlist/:id/:p_id',usercontroller.deleteWishlist);




//search
// Router.post('/searchProduct', usercontroller.search)
module.exports = Router