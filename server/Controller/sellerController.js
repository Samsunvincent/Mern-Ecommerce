let userType = require('../db/model/userType');
const { success_function, error_function } = require('../utils/Response-Handler');
let products = require('../db/model/product-model');
let category = require('../db/model/category');
const user = require('../db/model/user-Model');


exports.addProducts = async function (req, res) {
    const body = req.body;
    console.log("Request body:", body);



    let body_category = body.category;
    console.log("body category", body_category);

    let match_category = await category.findOne({ category: body_category });
    console.log("matchcategory", match_category);

    body.category = match_category;
    console.log("body.category", body.category);

    let sellerID = req.params.id;
    console.log("sellerId", sellerID);
    try {
        // Check if the request body is empty
        if (!body || Object.keys(body).length === 0) {
            const response = error_function({
                success: false,
                statusCode: 400,
                message: "Fields are required",
            });
            return res.status(response.statusCode).send(response);
        }

        // Check for required fields
        const requiredFields = ['name', 'description', 'price', 'category', 'brand', 'stock'];
        for (const field of requiredFields) {
            if (!body[field]) {
                const response = error_function({
                    success: false,
                    statusCode: 400,
                    message: `${field} is required.`,
                });
                return res.status(response.statusCode).send(response);
            }
        }

        // Process uploaded images if req.files is defined
        const images = (req.files['images[]'] || []).map(file => ({
            url: file.path, // Store the file path
            alt: req.body.altText || 'Product Image', // Optional alt text
        }));

        // Create a new product document with provided data and images
        const newProduct = new products({
            sellerID: req.params.id,
            name: body.name,
            description: body.description,
            price: body.price,
            category: body.category,
            brand: body.brand,
            stock: body.stock,
            offer: body.offer,
            discount: body.discount,
            images, // Use processed images
        });

        // Save the product to the database
        const productDetails = await newProduct.save();

        const response = success_function({
            success: true,
            statusCode: 200,
            message: "Product added successfully",
            data: productDetails,
        });
        return res.status(response.statusCode).send(response);

    } catch (error) {
        console.error("Error adding product:", error);

        // Handle any errors during product creation
        const response = error_function({
            success: false,
            statusCode: 500, // Set to 500 for server error
            message: "Product adding failed, please try again.",
        });
        return res.status(response.statusCode).send(response);
    }
};



exports.getProducts = async function (req, res) {
    try {
        const userType = req.params.usertype ? req.params.usertype.toLowerCase() : null;
        const userId = req.params.id || null;

        let productQuery = {};

        // Fetch all products if no userType or userId is provided
        if (!userType && !userId) {
            productQuery = {};
        } else if (userType === "seller" && userId) {
            productQuery = { sellerID: { $ne: userId } }; // Exclude seller's products
        }

        

        let productData = await products.find(productQuery);

        if (!productData || productData.length === 0) {
            if (userType || userId) {
                let response = error_function({
                    success: false,
                    statusCode: 400,
                    message: "No products found for the given filter",
                });
                return res.status(response.statusCode).send(response);
            }
        }

        if (userId) {
            const userData = await user.findById(userId);
            let wishlistData = userData ? userData.wishlist : [];

            productData = productData.map(product => {
                let isWishlisted = wishlistData.some(wishlist => wishlist.productId.toString() === product._id.toString());
                return { ...product.toObject(), isWishlisted };
            });
        }

        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Fetching successful",
            data: productData,
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error:", error);

        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Something went wrong",
        });
        return res.status(response.statusCode).send(response);
    }
};





exports.getAddedProducts = async function (req, res) {
    let sellerID = req.params.id;  // The seller's ID is passed as a route parameter
    console.log("sellerID", sellerID);  // Log sellerID to verify it

    try {
        // Query the products collection for all products associated with the sellerID
        let addedProducts = await products.find({ sellerID: sellerID });

        console.log("addedProducts", addedProducts);  // Log the found products

        // If products are found, return them as a successful response
        if (addedProducts.length > 0) {
            const response = success_function({
                success: true,
                statusCode: 200,
                message: "Products retrieved successfully",
                data: addedProducts,
            });
            return res.status(response.statusCode).send(response);
        } else {
            // If no products are found for this seller, return a 404 response
            const response = error_function({
                success: false,
                statusCode: 404,
                message: "No products found for this seller.",
            });
            return res.status(response.statusCode).send(response);
        }
    } catch (error) {
        console.error("Error retrieving products:", error);

        // Handle any errors that occur during the process
        const response = error_function({
            success: false,
            statusCode: 500,
            message: "Failed to retrieve products, please try again.",
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.deleteAddedProducts = async function (req, res) {
    // Destructure sellerId and p_id from req.params

    const sellerId = req.params.id;
    let p_id = req.params.p_id

    // Validate that both sellerId and p_id are provided
    if (!sellerId || !p_id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "Both seller ID and product ID are required.",
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Find the product by its ID and associated seller ID
        const product = await products.findOne({ _id: p_id, sellerID: sellerId });

        // If no product is found, return an error response
        if (!product) {
            let response = error_function({
                success: false,
                statusCode: 404,
                message: "Product not found or doesn't belong to the specified seller.",
            });
            return res.status(response.statusCode).send(response);
        }

        // Proceed to delete the product if it exists
        await products.deleteOne({ _id: p_id });

        // Return a success response after successful deletion
        let response = success_function({
            success: true,
            statusCode: 200,
            message: "Product deleted successfully.",
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error deleting product:", error);

        // Return a 500 internal server error in case of any unexpected error
        let response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while deleting the product. Please try again later.",
        });
        return res.status(response.statusCode).send(response);
    }
};

exports.updateAddedProducts = async function (req, res) {
    const sellerId = req.params.id;
    const p_id = req.params.p_id;
    const updatedData = req.body; // Assuming the updated data is passed in the request body

    // Validate that both sellerId and p_id are provided
    if (!sellerId || !p_id) {
        const response = error_function({
            success: false,
            statusCode: 400,
            message: "Seller ID or Product ID is missing."
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Find the product by sellerId and productId
        const product = await products.findOne({ _id: p_id, sellerID: sellerId });

        if (!product) {
            const response = error_function({
                success: false,
                statusCode: 404,
                message: "Product not found."
            });
            return res.status(response.statusCode).send(response);
        }

        // Update the product with the provided data
        const result = await products.updateOne(
            { _id: p_id, sellerID: sellerId },
            { $set: updatedData } // This will update the product with the fields from updatedData
        );

        // Check if the update was successful
        if (result.modifiedCount === 0) {
            const response = error_function({
                success: false,
                statusCode: 400,
                message: "Product update failed. No changes made."
            });
            return res.status(response.statusCode).send(response);
        }

        // Success response
        const response = success_function({
            success: true,
            statusCode: 200,
            message: "Product updated successfully.",
            data: updatedData
        });
        return res.status(response.statusCode).send(response);
    } catch (error) {
        console.error("Error updating product:", error);
        const response = error_function({
            success: false,
            statusCode: 500,
            message: "An error occurred while updating the product. Please try again."
        });
        return res.status(response.statusCode).send(response);
    }
};



exports.getSingleViewProduct = async function (req, res) {

    let id = req.params.id;
    console.log("id", id);

    if (!id) {
        let response = error_function({
            success: false,
            statusCode: 400,
            message: "id is not available",
        });
        return res.status(response.statusCode).send(response);
    }

    try {
        // Populate both category and sellerID
        let productMatch = await products.findOne({ _id: id })
            .populate('category')  // Populating category
            .populate('sellerID');  // Populating sellerID

        console.log("productMatch", productMatch);

        if (!productMatch) {
            let response = error_function({
                success: false,
                statusCode: 400,
                message: "product not found",
            });
            return res.status(response.statusCode).send(response);
        } else {
            let response = success_function({
                success: true,
                statusCode: 200,
                message: "product fetched",
                data: {
                    product: productMatch,
                    category: productMatch.category.category,  // Assuming category has a 'category' field
                    seller: productMatch.sellerID,  // Added populated seller data
                }
            });
            return res.status(response.statusCode).send(response);
        }
    } catch (error) {
        console.log("error", error);
        // You may want to handle errors here (e.g., return a 500 server error response)
    }
}
