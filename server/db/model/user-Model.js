const mongoose = require('mongoose');

let user_Schema = new mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    phone_number : {
        type : String
    },
 Address: [
        {
            name : {type : String},
            street: { type: String },
            city: { type: String },
            state: { type: String },
            country: { type: String },
            pincode: { type: String },
        },
    ],
    userType : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "userType"
    },
    wishlist : [
        {
            productId : {
                type : String
            }
        }
    ],
    orders: [
        {
            productId: {
                type: String, 
            },
            quantity: {
                type: Number, 
                default: 1,
            },
            totalPrice: {
                type: Number, 
            },
        },
    ],
})

let user = mongoose.model('user_data',user_Schema);
module.exports = user