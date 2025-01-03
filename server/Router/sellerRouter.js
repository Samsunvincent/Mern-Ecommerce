const express = require('express');
const Router = express.Router();
const productController = require('../Controller/sellerController')
const accessControl = require('../Controller/access-Controller').accessControl
const upload = require('../utils/FileUpload')


function setAccessControl(access_types){
    return(req,res,next)=>{
        accessControl(access_types,req,res,next)
    }
}

// Router.post('/addProducts',upload.array('images',5),setAccessControl('3'),productController.addProducts);
// Router.post('/addProducts',upload.array('images', 5),setAccessControl('3'),productController.addProducts);

Router.post('/addProducts/:id', upload, productController.addProducts);
Router.get('/getProducts/:id?/:usertype?',productController.getProducts)

Router.get('/getAddedProducts/:id',productController.getAddedProducts);
Router.get('/getSingleViewProduct/:id',productController.getSingleViewProduct)

Router.delete('/deleteProducts/:id/:p_id',productController.deleteAddedProducts);
Router.put('/updateProducts/:id/:p_id',productController.updateAddedProducts)


module.exports = Router
