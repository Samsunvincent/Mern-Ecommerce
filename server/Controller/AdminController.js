const user = require('../db/model/user-Model');
const product = require('../db/model/product-model');
const mongoose = require('mongoose');
const usertype = require('../db/model/userType');
const { success_function, error_function } = require('../utils/Response-Handler');
const cart = require('../db/model/addtocart-Model')



exports.orderCount = async function (req, res) {
    try {
        // 1. Use aggregation to get the total order count, total revenue, and orders with product details
        const result = await user.aggregate([
            { $unwind: "$orders" },  // Unwind the orders array to treat each order as a separate document

            // 2. Get the total number of orders, total revenue, and push all orders for later processing
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalRevenue: { $sum: "$orders.totalPrice" },  // Sum up the total revenue from orders
                    orders: { $push: "$orders" }  // Push orders for later processing
                }
            },

            // 3. Sort orders by createdAt field in descending order
            {
                $project: {
                    totalOrders: 1,
                    totalRevenue: 1,
                    orders: { $slice: ["$orders", -5] } // Limit to the last 5 orders
                }
            },
        ]);

        // 4. Check if we get any orders from the aggregation
        console.log("Aggregated Result:", JSON.stringify(result, null, 2)); // Pretty print the entire result

        // If no orders found, set totalOrders and totalRevenue to 0 and empty list for orders
        const totalOrders = result.length > 0 ? result[0].totalOrders : 0;
        const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;
        const lastFiveOrders = result.length > 0 ? result[0].orders : [];

        if (lastFiveOrders.length === 0) {
            return res.status(200).json({
                totalOrders,
                totalRevenue,
                lastFiveOrders: [],
                totalUsers: await user.countDocuments(),
            });
        }

        // 5. Extract productIds from the orders and convert them to ObjectId for querying products
        const productIds = lastFiveOrders.flatMap(order =>
            (order.productId) ? [new mongoose.Types.ObjectId(order.productId)] : [] // Use new to instantiate ObjectId
        );

        // If there are no productIds, return early with empty product data
        if (productIds.length === 0) {
            return res.status(200).json({
                totalOrders,
                totalRevenue,
                lastFiveOrders: [],
                totalUsers: await user.countDocuments(),
            });
        }

        // 6. Fetch product details based on productIds
        const products = await product.find({ '_id': { $in: productIds } });
        console.log("Fetched Products:", JSON.stringify(products, null, 2)); // Pretty print the fetched products

        // 7. Map product details to the orders
        const lastFiveOrdersWithProducts = lastFiveOrders.map(order => {
            const productDetails = products.find(product =>
                product._id.toString() === order.productId.toString()
            );

            return {
                ...order,
                productDetails: productDetails || {},  // Include product details or empty object if not found
            };
        });

        // 8. Get the total count of users
        const totalUsers = await user.countDocuments();

        // 9. Send the response with the total order count, total revenue, last 5 orders with product details, and total user count
        return res.status(200).json({
            totalOrders,
            totalRevenue,
            lastFiveOrders: lastFiveOrdersWithProducts,
            totalUsers,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "An error occurred while fetching the total order count, revenue, last orders, and user count." });
    }
};
exports.Buyers = async function (req, res) {
    try {
        // Query to find the user type with 'Buyer'
        const check_id = await usertype.findOne({ userType: 'Buyer' });

        // If no 'Buyer' user type is found
        if (!check_id) {
            let response = {
                success: false,
                statusCode: 400,
                message: 'User type "Buyer" not found',
            };
            return res.status(response.statusCode).send(response);
        }

        console.log('check_id', check_id);

        // Now that you have the userType id for 'Buyer', you can query the users
        // Fetch users whose userType matches the 'Buyer' type
        const buyers = await user.find({ userType: check_id._id });

        // Respond with the list of buyers
        res.status(200).json({
            success: true,
            data: buyers,
        });

    } catch (error) {
        console.error('Error:', error);
        let response = {
            success: false,
            statusCode: 500,
            message: 'Internal server error',
        };
        return res.status(response.statusCode).send(response);
    }
};




exports.BuyerDetails = async function (req, res) {
    let buyerId = req.params.b_id;

    // Check if buyerId is provided and valid
    if (!buyerId || !mongoose.Types.ObjectId.isValid(buyerId)) {
        let response = {
            success: false,
            statusCode: 400,
            message: 'Invalid or missing buyer ID',
        };
        return res.status(response.statusCode).send(response);
    }

    try {
        // Check if the buyer exists in the database
        let checkBuyer = await user.findOne({ _id: buyerId });

        // If buyer is not found, return an error
        if (!checkBuyer) {
            let response = {
                success: false,
                statusCode: 404,
                message: 'User not found',
            };
            return res.status(response.statusCode).send(response);
        }

        // Fetch ordered products based on the buyer's orders
        let orderedProducts = await product.find({ _id: { $in: checkBuyer.orders.map(order => order.productId) } });

        // Return empty array if no products are found
        if (!orderedProducts || orderedProducts.length === 0) {
            orderedProducts = [];
        }

        // Fetch wishlisted products based on the buyer's wishlist
        let wishlistedProducts = await product.find({ _id: { $in: checkBuyer.wishlist.map(wishlist => wishlist.productId) } });

        if (!wishlistedProducts || wishlistedProducts.length === 0) {
            wishlistedProducts = [];
        }

        // Fetch carted products based on the buyer's cart
        let cartData = await cart.findOne({ userId: checkBuyer._id });

        let cartedProducts = [];
        if (cartData && cartData.items.length > 0) {
            // For each product in the cart, fetch product details and include quantity and price
            cartedProducts = await Promise.all(
                cartData.items.map(async (item) => {
                    // Fetch full product details
                    let productDetails = await product.findById(item.productId);

                    if (productDetails) {
                        // Return product details including name, price, description, etc.
                        return {
                            productId: item.productId,
                            name: productDetails.name,
                            description: productDetails.description, // Added description
                            price: productDetails.price,
                            brand: productDetails.brand, // Added brand
                            stock: productDetails.stock, // Added stock
                            discount: productDetails.discount, // Added discount
                            images: productDetails.images, // Added images
                            quantity: item.quantity,
                            totalPrice: item.price * item.quantity,
                            imageUrl: productDetails.images.length > 0 ? `http://localhost:3000/${productDetails.images[0].url}` : '', // Use first image
                        };
                    } else {
                        // In case product not found, return a fallback
                        return {
                            productId: item.productId,
                            name: 'Unknown Product',
                            description: 'No description available',
                            price: 0,
                            brand: 'Unknown',
                            stock: 0,
                            discount: '0%',
                            images: [],
                            quantity: item.quantity,
                            totalPrice: 0,
                            imageUrl: '', // No image URL
                        };
                    }
                })
            );
        }

        // Return buyer data along with ordered, wishlisted, and carted products
        let response = {
            success: true,
            statusCode: 200,
            message: 'Buyer data retrieved successfully',
            data: { BuyerDetails: checkBuyer, orderedProducts, wishlistedProducts, cartedProducts },
        };
        return res.status(response.statusCode).send(response);
    } catch (error) {
        // Handle any errors that occur during the database query
        let response = {
            success: false,
            statusCode: 500,
            message: 'Error fetching buyer data',
            error: error.message,
        };
        return res.status(response.statusCode).send(response);
    }
};


exports.Sellers = async function (req, res) {
    try {
        const check_id = await usertype.findOne({ userType: 'Seller' });
        if (!check_id) {
            let response = {
                success: false,
                statusCode: 400,
                message: 'User type "Seller" not found',
            };
            return res.status(response.statusCode).send(response);
        }
        const sellers = await user.find({ userType: check_id._id });
        res.status(200).json({
            success: true,
            data: sellers,
        });
    } catch (error) {
        console.error('Error:', error);
        let response = {
            success: false,
            statusCode: 500,
            message: 'Internal server error',
        };
        return res.status(response.statusCode).send(response);
    }
}


exports.SellerDetails = async function (req, res) {
    const sellerId = req.params.s_id;

    if (!sellerId) {
        return res.status(400).send({
            success: false,
            statusCode: 400,
            message: 'Invalid or missing seller ID',
        });
    }

    try {
        const checkSeller = await user.findById(sellerId);

        if (!checkSeller) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: 'User not found',
            });
        }

        // Fetch ordered products
        const orderedProducts = await product.find({
            _id: { $in: checkSeller.orders?.map(order => order.productId) || [] },
        });

        // Fetch wishlisted products
        const wishlistedProducts = await product.find({
            _id: { $in: checkSeller.wishlist?.map(wishlist => wishlist.productId) || [] },
        });

        // Fetch added products by the seller
        const addedProducts = await product.find({ sellerID: sellerId });

        // Fetch cart details
        const cartData = await cart.findOne({ userId: sellerId });
        const cartedProducts = await Promise.all(
            cartData?.items.map(async (item) => {
                const productDetails = await product.findById(item.productId);
                return productDetails
                    ? {
                        productId: item.productId,
                        name: productDetails.name,
                        description: productDetails.description || 'No description available',
                        price: productDetails.price || 0,
                        brand: productDetails.brand || 'Unknown',
                        stock: productDetails.stock || 0,
                        discount: productDetails.discount || '0%',
                        images: productDetails.images || [],
                        quantity: item.quantity,
                        totalPrice: productDetails.price * item.quantity || 0,
                        imageUrl: productDetails.images?.[0]?.url
                            ? `http://localhost:3000/${productDetails.images[0].url}`
                            : '',
                    }
                    : {
                        productId: item.productId,
                        name: 'Unknown Product',
                        description: 'No description available',
                        price: 0,
                        brand: 'Unknown',
                        stock: 0,
                        discount: '0%',
                        images: [],
                        quantity: item.quantity,
                        totalPrice: 0,
                        imageUrl: '',
                    };
            }) || []
        );

        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: 'Seller data retrieved successfully',
            data: {
                SellerDetails: checkSeller,
                orderedProducts,
                wishlistedProducts,
                cartedProducts,
                addedProducts,
            },
        });
    } catch (error) {
        return res.status(500).send({
            success: false,
            statusCode: 500,
            message: 'Error fetching seller data',
            error: error.message,
        });
    }
};

exports.GetAllProducts = async function (req, res) {
    try {
        // Fetch all products
        let AllProducts = await product.find();
        console.log("AllProducts", AllProducts);

        // Fetch seller details for each product
        let productsWithSellers = await Promise.all(
            AllProducts.map(async (prod) => {
                try {
                    let sellerDetails = await user.findOne({ _id: prod.sellerID });
                    if (!sellerDetails) {
                        // If the seller is not found, add a fallback message
                        return {
                            ...prod._doc, // Spread the product data
                            sellerDetails: {
                                message: "Seller not found",
                            },
                        };
                    }
                    // Add seller details to the product
                    return {
                        ...prod._doc, // Spread the product data
                        sellerDetails: {
                            name: sellerDetails.name,
                            email: sellerDetails.email,
                            phone_number: sellerDetails.phone_number,
                        },
                    };
                } catch (error) {
                    console.error(`Error fetching seller for product ${prod._id}:`, error);
                    return {
                        ...prod._doc,
                        sellerDetails: {
                            message: "Error fetching seller details",
                        },
                    };
                }
            })
        );

        // Send success response
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "All products with sellers retrieved successfully",
            data: productsWithSellers,
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error fetching products:", error);

        // Send error response
        let response = success_function({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve products",
            data: null,
        });
        return res.status(response.statusCode).send(response);
    }
};


exports.getAllOrders = async function (req, res) {
    try {
        // Aggregation to fetch all orders
        const orders = await user.aggregate([
            { $unwind: "$orders" }, // Flatten the orders array
            {
                $project: {
                    _id: 0,         // Exclude _id if not needed
                    userId: "$_id", // Include userId for reference
                    order: "$orders" // Include each order
                }
            }
        ]);

        if (!orders.length) {
            return res.status(404).json({ message: "No orders found" });
        }

        // Now, orders contain individual orders, and each order has a 'productId'.
        const orderProductIds = orders.map(order => order.order.productId);

        // Fetch the products that match the productIds from the orders
        const orderedProducts = await product.find({
            _id: { $in: orderProductIds }
        }).populate('sellerID', 'name email');  // Use populate to get seller details

        if (orderedProducts.length > 0) {
            // Return the orders with populated seller data
            res.status(200).json({ orders: orderedProducts });
        } else {
            res.status(404).json({ message: "No products found for the orders" });
        }
    } catch (error) {
        console.error("Error fetching orders:", error);
        res.status(500).json({ message: "Server error", error });
    }
};

exports.BlockOrUnBlock = async function (req, res) {
    try {
        const userId = req.params.id;
        const description = req.params.description;

        // Validate required parameters
        if (!userId) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "User ID is required"
            });
        }

        if (!description) {
            return res.status(400).send({
                success: false,
                statusCode: 400,
                message: "Description is required"
            });
        }

        // Find user by ID
        const findUser = await user.findById(userId);
        if (!findUser) {
            return res.status(404).send({
                success: false,
                statusCode: 404,
                message: "User not found"
            });
        }

        // Toggle user status
        const newStatus = findUser.user_Status === "block" ? "unblock" : "block";
        findUser.user_Status = newStatus;

        // Update the user's status in the database
        await findUser.save();

        // Send a response with the updated status and description
        return res.status(200).send({
            success: true,
            statusCode: 200,
            message: `User has been ${newStatus}`,
            description: newStatus === "block" ? description : null, // Description is only relevant when blocking
            userStatus: newStatus
        });
    } catch (error) {
        // Handle unexpected errors
        return res.status(500).send({
            success: false,
            statusCode: 500,
            message: "An error occurred",
            error: error.message
        });
    }
};






