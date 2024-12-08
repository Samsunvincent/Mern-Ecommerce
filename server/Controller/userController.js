let user = require('../db/model/user-Model')
const { success_function, error_function } = require('../utils/Response-Handler')
let userType = require('../db/model/userType')
const bcrypt = require('bcrypt');

const category = require('../db/model/category');
const product = require('../db/model/product-model')
const addtocartmodel = require('../db/model/addtocart-Model');
const Cart = require('../db/model/addtocart-Model');

const mongoose = require('mongoose');





exports.signin = async function (req, res) {
    let body = req.body;
    console.log("body :", body);

    if (body) {
        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(body.email)) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Invalid email format"
            });
            res.status(response.statusCode).send(response);
            return;
        }

        // Check if Address exists and validate pincode
        // if (body.Address && body.Address.pincode) {
        //     const pincodeRegex = /^\d{6}$/;
        //     if (!pincodeRegex.test(body.Address.pincode)) {
        //         let response = error_function({
        //             success: false,
        //             statusCode: 400,
        //             message: "Pincode must be exactly 6 digits"
        //         });
        //         res.status(response.statusCode).send(response);
        //         return;
        //     }
        // } else {
        //     let response = error_function({
        //         success: false,
        //         statusCode: 400,
        //         message: "Address and pincode are required"
        //     });
        //     res.status(response.statusCode).send(response);
        //     return;
        // }

        // Phone number validation (if needed, adjust your request to include a phone number)
        let phone = body.phone
        if (phone) {
            const phoneRegex = /^\d{10}$/;
            if (!phoneRegex.test(body.phone)) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Phone number must be exactly 10 digits"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        }


        try {
            // Check for duplicate email
            let existingUser = await user.findOne({ email: body.email });
            if (existingUser) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Email already exists"
                });
                res.status(response.statusCode).send(response);
                return;
            }

            let users = await userType.findOne({ userType: body.userType });
            if (!users) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Invalid user type"
                });
                res.status(response.statusCode).send(response);
                return;
            }

            let id = users._id;
            body.userType = id;

            // Hash the password
            const saltRounds = 10; // You can adjust the salt rounds for security
            body.password = await bcrypt.hash(body.password, saltRounds);

            // Create user and save to the database
            let data = await user.create(body);

            if (data) {
                let response = success_function({
                    success: true,
                    statusCode: 200,
                    message: "Signup successful",
                    data: data
                });
                res.status(response.statusCode).send(response);
                return;
            } else {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "Signup failed, try again"
                });
                res.status(response.statusCode).send(response);
                return;
            }
        } catch (error) {
            console.log("error", error);
            let response = error_function({
                success: false,
                statusCode: 500,
                message: "Something went wrong, try again"
            });
            res.status(response.statusCode).send(response);
            return;
        }
    }
};

exports.getUserTypes = async function(req,res){
    try {
        let selectUserTypes = await userType.find();
       

        if(selectUserTypes){
            let response = success_function({
                success : true,
                statusCode : 200,
                message : "successfully fetched the userTypes",
                data : selectUserTypes
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log('error',error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "userType fetching failed",
            
        });
        res.status(response.statusCode).send(response)
        return;
    }

}

exports.getAllUsers = async function(req, res) {
    try {
        // Fetch all users from the database
        let users = await user.find();

        // Log the retrieved users
        console.log("Fetched users:", users);

        // Check if users were found
        if (!users || users.length === 0) {
            let response = {
                success: true,
                statusCode: 200,
                message: "No users found",
                data: []
            };
            res.status(response.statusCode).send(response);
            return;
        }

        // Send the users back to the client
        let response = {
            success: true,
            statusCode: 200,
            message: "Users fetched successfully",
            data: users
        };
        res.status(response.statusCode).send(response);
        
    } catch (error) {
        // Log the error
        console.log("Error fetching users:", error);
        
        // Send an error response
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Users fetching failed"
        });
        res.status(response.statusCode).send(response);
    }
};

exports.getUser = async function(req,res){
    try {
        let id = req.params.id;
    console.log("id from single user",id);

    if(!id){
        let response = error_function({
            success : false,
            statusCode : 400,
            messsage : "something went wrong"
        });
        res.status(response.statusCode).send(response);
        return;
    }else{
        let singleUser = await user.findOne({_id : id});
        console.log("singleUser",singleUser);
        
        if(!singleUser){
            let response = error_function({
                success : false,
                statusCode : 400,
                message : "User not found",

            });
            res.status(response.statusCode).send(response);
            return;
        }else{
            let response = success_function({
                success : true,
                statusCode : 200,
                message : "User found",
                data : singleUser
            });
            res.status(response.statusCode).send(response);
            return
        }
    }
    } catch (error) {
        console.log('error',error);

        let response = error_function({
            success : false,
            statusCode : 400,
            message : "Something went wrong, try again"
        });
        res.status(response.statusCode).send(response);
        return;
    }
}

exports.updateUserData = async function(req,res){
    let body = req.body;
    console.log("body",body);

    let userId = req.params.id;
    console.log("userId",userId);

    if(!body){
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "body is not available",
        });
        return res.status(response.statusCode).send(response);

    }else{
        let updatingData = await user.findOne({ _id : userId});
        console.log("updating Data",updatingData);

        if(!updatingData){
            let response = error_function({
                success : false,
                statusCode : 400,
                message : "user not found",

            });
            return res.status(response.statusCode).send(response);
        }else{
            let updatedData = await user.updateOne({_id : userId},{$set : {name:body.name, email : body.email, phone : body.phone_number}});
            console.log("updated data",updatedData);

            if(updatedData){
                let response  = success_function({
                    success : true,
                    statusCode : 200,
                    message : "user updated succesfully",
                    data : updatedData
                });
                return res.status(response.statusCode).send(response);

            }else{
                let response = error_function({
                    success : false,
                    statusCode : 400,
                    message : "user updation failed",
                });
                return res.status(response.statusCode).send(response);
            }
           
        }
    }
}

exports.getCategory = async function(req,res){
    try {
        let categories = await category.find();

        if(categories){
            let response = success_function({
                success : true,
                statusCode : 200,
                message : null,
                data : categories
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        console.log("error",error);
        let response = error_function({
            success : false,
            statusCode : 400,
            message : "something went wrong try again"
        });
        res.status(response.statusCode).send(response);
    }
}

exports.addAddress = async function (req, res) {
    let id = req.params.id; // User ID from request parameters
    let newAddress = req.body.Address;
    console.log("new address",newAddress) 
    console.log('req.body',req.body);// New address from the request body

    // Check if the Address field is addt
    if (!newAddress) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Address field is required",
        });
        res.status(response.statusCode).send(response);
        return;
    }

    try {
        // Add the new address to the user's Address array using $push
        let updateData = await user.updateOne(
            { _id: id },
            { $push: { Address: newAddress } } // Push the new address to the Address array
        );

        console.log("updateData", updateData);

        // Check if the update was successful
        if (updateData.matchedCount === 1 && updateData.modifiedCount === 1) {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Address added successfully",
                data: updateData,
            });
           return res.status(response.statusCode).send(response);
        } else {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Something went wrong, address was not added",
            });
            return res.status(response.statusCode).send(response);
        }
    } catch (error) {
        console.error("Error adding address:", error);

        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Server error",
            error: error.message,
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.getAddress = async function (req, res) {
    let id = req.params.id;
    if (!id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "ID is required",
        });
        return res.status(response.statusCode).send(response);
    }

    // Check if the user exists
    let check_user = await user.findOne({ _id: id });
    if (!check_user) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "User not found",
        });
        return res.status(response.statusCode).send(response);
    }

    // Fetch the address from the user data
    let address = check_user.Address; // This assumes Address is an array
    if (!address || address.length === 0) { // Check if there are no addresses
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Address is not available",
        });
        return res.status(response.statusCode).send(response);
    } else {
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Address retrieved successfully",
            data: address,
        });
        return res.status(response.statusCode).send(response);
    }
};




exports.filterCategory = async function(req, res) {
    // Validate the category in the request body
    const query_category = req.body.category;
    if (!query_category) {
        // Category is missing in the request body
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Category is required."
        });
        return res.status(response.statusCode).send(response);
    }

    console.log("category", query_category);

    // Find the category in the database
    let categoryDoc;
    try {
        categoryDoc = await category.findOne({ category: query_category });
    } catch (error) {
        // If there's a database error
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Error occurred while querying the database."
        });
        return res.status(response.statusCode).send(response);
    }

    if (!categoryDoc) {
        // If the category doesn't exist
        let response = error_function({
            success: false,
            statusCode: 404,
            message: "Category not found."
        });
        return res.status(response.statusCode).send(response);
    }

    console.log("categoryDoc", categoryDoc);

    // Extract the category ID
    const c_id = categoryDoc._id;
    console.log("c_id", c_id);

    try {
        // Find the products in the specified category
        let productInCategory = await product.find({ category: c_id });

        console.log('productInCategory', productInCategory);

        if (productInCategory.length === 0) {
            // No products available in the category
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "No products available in this category."
            });
            return res.status(response.statusCode).send(response);
        } else {
            // Products found in the category
            let response = success_function({
                success: true,
                statusCode: 200,
                data: productInCategory
            });
            res.status(response.statusCode).send(response);
            return;
        }
    } catch (error) {
        // Handle any errors during the product query
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Error occurred while fetching products."
        });
        return res.status(response.statusCode).send(response);
    }
};
exports.addToCart = async function (req, res) {
    try {
        const { userId, productId, price } = req.body; // Removed `quantity` from req.body
        console.log("Request Body:", req.body);

        // Validate input data
        if (!userId || !productId || !price) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "Invalid input data. Ensure userId, productId, and price are provided."
            });
            return res.status(response.statusCode).send(response);
        }

        // Check if user exists
        const userExists = await user.findById(userId);
        if (!userExists) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "User not found."
            });
            return res.status(response.statusCode).send(response);
        }

        // Check if product exists
        const productExists = await product.findById(productId);
        if (!productExists) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "Product not found."
            });
            return res.status(response.statusCode).send(response);
        }

        // Retrieve the cart or create a new one if it doesn't exist
        let cart = await addtocartmodel.findOne({ userId });

        if (!cart) {
            console.log("No existing cart found, creating a new one.");
            cart = new addtocartmodel({ userId, items: [] });
        }

        // Check if the product is already in the cart
        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            // If the item already exists, ensure its quantity remains 1
            console.log(`Product ${productId} already exists in the cart. Quantity set to 1.`);
            existingItem.quantity = 1; // Force quantity to remain 1
        } else {
            // Add new product to the cart with quantity set to 1
            cart.items.push({ productId, quantity: 1, price });
            console.log(`Added new product ${productId} to the cart with quantity 1.`);
        }

        // Calculate total price of the cart
        const totalPrice = cart.items.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);

        // Update totalPrice field in the cart
        cart.totalPrice = totalPrice;

        // Save the updated cart
        await cart.save();

        console.log(`Total price of cart updated: ${totalPrice}`);

        // Send a success response with the total price
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Item added to cart successfully.",
            totalPrice: cart.totalPrice // Include total price in the response
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error in addToCart:", error);

        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while adding to the cart."
        });
        return res.status(response.statusCode).send(response);
    }
};



exports.getCartData = async function (req, res) {
    const id = req.params.id;

    // Check if user ID is provided
    if (!id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "User ID is missing",
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Fetch cart data
        const cartData = await Cart.findOne({ userId: id });

        if (!cartData || cartData.items.length === 0) {
            // Return 200 for an empty cart
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Your cart is empty",
                data: [],
            });
            return res.status(response.statusCode).send(response);
        }

        // Extract product IDs and fetch product data
        const productIds = cartData.items.map((item) => item.productId);
        const productData = await product.find({ _id: { $in: productIds } });

        // Return the product data
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Products retrieved successfully",
            data: productData,
        });
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Backend error:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while fetching cart data",
        });
        return res.status(response.statusCode).send(response);
    }
};


exports.removeCartData = async function (req, res) {
    const userId = req.params.id;
    const productId = req.params.p_id;

    // Validate user ID and product ID
    if (!userId || !productId) {
        const response = {
            success: false,
            statusCode: 400,
            message: "User ID and Product ID are required to remove an item from the cart.",
        };
        return res.status(response.statusCode).send(response);
    }

    try {
        // Find the cart for the user
        const userCart = await Cart.findOne({ userId });

        if (!userCart) {
            const response = {
                success: false,
                statusCode: 404,
                message: "Cart not found for this user.",
            };
            return res.status(response.statusCode).send(response);
        }

        // Find and remove the product from the cart
        const updatedItems = userCart.items.filter(item => item.productId.toString() !== productId);

        if (updatedItems.length === userCart.items.length) {
            const response = {
                success: false,
                statusCode: 404,
                message: "Product not found in the cart.",
            };
            return res.status(response.statusCode).send(response);
        }

        // Update the cart items and recalculate the total price
        userCart.items = updatedItems;
        userCart.totalPrice = updatedItems.reduce((total, item) => total + item.price * item.quantity, 0);
        await userCart.save();

        const response = {
            success: true,
            statusCode: 200,
            message: "Product removed from the cart successfully.",
            cart: userCart,
        };
        return res.status(response.statusCode).send(response);
    } catch (error) {
        const response = {
            success: false,
            statusCode: 500,
            message: "An error occurred while removing the product from the cart.",
            error: error.message,
        };
        return res.status(response.statusCode).send(response);
    }
};

exports.addToWishlist = async function(req, res) {
    let userId = req.params.id;  // Get user ID from the URL params
    let p_id = req.params.p_id;  // Get product ID from the URL params

    try {
        // Find the user by userId
        let userData = await user.findById(userId);

        if (!userData) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the product exists in the products collection
        let productExists = await product.findById(p_id);

        if (!productExists) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Check if the product is already in the wishlist
        let productIndex = userData.wishlist.findIndex(item => item.productId.toString() === p_id);

        if (productIndex !== -1) {
            // If the product exists in the wishlist, remove it
            userData.wishlist.splice(productIndex, 1);
            await userData.save();
            return res.status(200).json({ message: 'Product removed from wishlist', wishlist: userData.wishlist });
        } else {
            // If the product doesn't exist in the wishlist, add it
            userData.wishlist.push({ productId: p_id });
            await userData.save();
            return res.status(200).json({ message: 'Product added to wishlist', wishlist: userData.wishlist });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};


exports.getWishlist = async function(req, res) {
    try {
        const id = req.params.id;

        // Validate ID parameter
        if (!id) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "User ID is required",
            });
            return res.status(response.statusCode).send(response);
        }

        // Find the user in the database
        const check_user = await user.findOne({ _id: id });

        // Check if the user exists
        if (!check_user) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "User not found",
            });
            return res.status(response.statusCode).send(response);
        }

        // Get the user's wishlist
        const wishlist = check_user.wishlist;

        // Check if the wishlist exists or is empty
        if (!wishlist || wishlist.length === 0) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "Wishlist is empty or not found",
            });
            return res.status(response.statusCode).send(response);
        }

        // Initialize an array to store the product data
        let products = [];

        // Iterate over the wishlist and fetch the respective product data
        for (let i = 0; i < wishlist.length; i++) {
            const productId = wishlist[i].productId;

            // Check if productId exists in the wishlist item
            if (!productId) {
                console.error(`Product ID missing in wishlist item: ${JSON.stringify(wishlist[i])}`);
                continue; // Skip to the next item in the wishlist
            }

            // Fetch the product using productId
            const productdata = await product.findById(productId);

            if (productdata) {
                // Add the product data to the products array
                products.push(productdata);
            } else {
                console.error(`Product not found for ID: ${productId}`);
            }
        }

        // If products were found, return them
        if (products.length > 0) {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "Wishlist retrieved successfully",
                data: products,
            });
            return res.status(response.statusCode).send(response);
        } else {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "No products found in wishlist",
            });
            return res.status(response.statusCode).send(response);
        }

    } catch (error) {
        console.error("Error in getWishlist:", error);

        // Handle any other server errors
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Internal server error. Please try again later.",
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.deleteWishlist = async function (req, res) {
    try {
        const p_id  = req.params.p_id;

        // Validate product ID
        if (!p_id) {
            const response = error_function({
                success: false,
                statusCode: 400,
                message: "Product ID is required.",
            });
            return res.status(response.statusCode).send(response);
        }

        // Validate user existence in the database
        const userId = req.params.id; // Assuming `req.user` contains the authenticated user's details
        const userRecord = await user.findById(userId);

        if (!userRecord) {
            const response = error_function({
                success: false,
                statusCode: 404,
                message: "User not found.",
            });
            return res.status(response.statusCode).send(response);
        }

        // Check if the product exists in the user's wishlist
        const productIndex = userRecord.wishlist.findIndex(
            (item) => item.productId === p_id
        );

        if (productIndex === -1) {
            const response = error_function({
                success: false,
                statusCode: 404,
                message: "Product not found in the wishlist.",
            });
            return res.status(response.statusCode).send(response);
        }

        // Remove the product from the wishlist
        userRecord.wishlist.splice(productIndex, 1); // Remove the product
        await userRecord.save(); // Save the updated user record

        const response = success_function({
            success: true,
            statusCode: 200,
            message: "Product removed from wishlist successfully.",
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error in deleteWishlist:", error);

        // Handle unexpected server errors
        const response = error_function({
            success: false,
            statusCode: 500,
            message: "Internal server error. Please try again later.",
        });
        return res.status(response.statusCode).send(response);
    }
};




//place order


exports.placeOrders = async function (req, res) {
    let { products } = req.body; // Array of { productId, quantity, totalPrice }
    let userId = req.params.id;

    // Check required fields
    if (!products || products.length === 0) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Products array is required",
        });
        return res.status(response.statusCode).send(response);
    }

    if (!userId) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Please login and continue",
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Check if the user exists
        let matchId = await user.findOne({ _id: userId });
        if (!matchId) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "User not found",
            });
            return res.status(response.statusCode).send(response);
        }

        // Iterate over the products array to validate and process each product
        let orderSummary = [];
        for (const { productId, quantity = 1, totalPrice } of products) {
            // Check if productId and quantity are provided
            if (!productId || quantity <= 0) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: `Product ID and valid quantity are required for all products`,
                });
                return res.status(response.statusCode).send(response);
            }

            // Check if the product exists
            let matchProduct = await product.findOne({ _id: productId });
            if (!matchProduct) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: `Product not found for ID: ${productId}`,
                });
                return res.status(response.statusCode).send(response);
            }

            // Check if the quantity requested is available in stock
            if (quantity > matchProduct.stock) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: `Insufficient stock for product ID: ${matchProduct.name}. Available stock is ${matchProduct.stock}`,
                });
                return res.status(response.statusCode).send(response);
            }

            // Calculate total price if not provided
            let calculatedTotalPrice = totalPrice || matchProduct.price * quantity;

            // Check if the product is already ordered
            let existingOrder = matchId.orders.find(order => order.productId === productId);

            if (existingOrder) {
                // If product is already ordered, update the quantity and total price
                existingOrder.quantity += quantity;
                existingOrder.totalPrice += calculatedTotalPrice;
            } else {
                // Otherwise, add a new order
                matchId.orders.push({
                    productId,
                    quantity,
                    totalPrice: calculatedTotalPrice,
                });
            }

            // Reduce the stock of the product
            matchProduct.stock -= quantity;

            // Save the updated product data
            await matchProduct.save();

            // Add to order summary
            orderSummary.push({
                productId,
                quantity: existingOrder ? existingOrder.quantity : quantity,
                totalPrice: existingOrder
                    ? existingOrder.totalPrice
                    : calculatedTotalPrice,
            });
        }

        // Save the updated user data
        await matchId.save();

        // Respond with success and the order summary
        let response = {
            success: true,
            statusCode: 200,
            message: "Order(s) placed successfully",
            orders: orderSummary,
        };
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error placing order:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.getOrders = async function(req, res) {
    let id = req.params.id;

    // Check if user ID is provided
    if (!id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Please login to continue",
        });
        return res.status(response.statusCode).send(response);
    }

    // Find user by ID
    let findOrders = await user.findOne({ _id: id });
    if (!findOrders) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "No user found",
        });
        return res.status(response.statusCode).send(response);
    }

    // Get the user's orders
    let ordersdata = findOrders.orders;
    if (!ordersdata || ordersdata.length === 0) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "No orders yet",
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Map through each order and retrieve the product details
        const ordersWithProducts = await Promise.all(ordersdata.map(async (order) => {
            // Find the product details for each productId in the order
            let productDetails = await product.findOne({ _id: order.productId });

            if (productDetails) {
                // Add product details to the order
                return {
                    productId: order.productId,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    productName: productDetails.name, // Example field, adjust according to your schema
                    productPrice: productDetails.price, // Example field, adjust according to your schema
                    productImage: productDetails.images[0].url, // Example field for product image, adjust according to your schema
                };
            } else {
                // If no product found, return a simplified order object
                return {
                    productId: order.productId,
                    quantity: order.quantity,
                    totalPrice: order.totalPrice,
                    productName: 'Product not found',
                    productPrice: 0,
                    productImage: '',
                };
            }
        }));

        // Respond with the orders including product details
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Retrieved orders successfully",
            data: ordersWithProducts
        });
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error retrieving orders:", error);
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "Internal server error",
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.cancelOrder = async function(req, res) {
    let id = req.params.id;
    let p_id = req.params.p_id;

    if (!id || !p_id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Please login to continue",
        });
        return res.status(response.statusCode).send(response);
    }

    // Check if the user exists
    let check_user = await user.findOne({ _id: id });
    if (!check_user) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "User not found",
        });
        return res.status(response.statusCode).send(response);
    }

    // Check if the order exists in the user's orders and match the product
    let orderIndex = check_user.orders.findIndex(order => order.productId.toString() === p_id);
    if (orderIndex === -1) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Order not found",
        });
        return res.status(response.statusCode).send(response);
    }

    // Remove the order from the user's orders
    check_user.orders.splice(orderIndex, 1);
    
    // Save the updated user object
    await check_user.save();

    let response = success_function({
        success: true,
        statusCode: 200,
        message: "Order canceled successfully",
    });
    return res.status(response.statusCode).send(response);
};










// exports.search = async function(req,res){
//    try {
//     let name = req.body.name;
//     console.log("name",name);

//     if(name){
//         let check_product_name = await product.findOne({name : name})
//         console.log("check_product_name",check_product_name);
//     }
//    } catch (error) {
//     console.log("error",error);
//    }


// }


