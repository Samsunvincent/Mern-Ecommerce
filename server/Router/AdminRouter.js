const express = require('express');
const Router = express.Router();
const AdminController = require('../Controller/AdminController')
const accessControl = require('../Controller/access-Controller').accessControl


function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

Router.get('/ordercount',setAccessControl('1'),AdminController.orderCount)

//Buyers
Router.get('/Buyers',setAccessControl('1'),AdminController.Buyers);
Router.get('/BuyerDetails/:b_id',setAccessControl('1'),AdminController.BuyerDetails);

//Sellers
Router.get('/Sellers',setAccessControl('1'),AdminController.Sellers);
Router.get('/SellerDetails/:s_id',setAccessControl('1'),AdminController.SellerDetails);




module.exports = Router