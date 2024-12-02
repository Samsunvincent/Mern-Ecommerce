const mongoose = require('mongoose');

let productSchema = new mongoose.Schema({
    sellerID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user_data", 
        required: true
    },
    name: {
        type: String,
        required: true, 
        trim: true
    },
    description: {
        type: String,
        required: true 
    },
    price: {
        type: Number,
        required: true,
        min: 0 
    },
    brand: {
        type: String,
        required: true 
    },
    stock: {
        type: Number,
        min: 0,
        default: 0 
    },
    images: [
        {
            url: { type: String, required: true }, 
            alt: { type: String } 
        }
    ],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category", 
        required: true
    },
    discount: {
        type: String, 
        default: "0%" 
    },
    offer: {
        type: String, 
        default: "" 
    }
});

module.exports = mongoose.model('product_data', productSchema);
