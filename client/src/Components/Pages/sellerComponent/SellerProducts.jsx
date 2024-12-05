import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import GetAddedProducts from "../../functionalities/GetAddedProducts"; // Adjust the path as needed
import axios from "axios";


export default function SellerProducts() {
    const { id } = useParams(); // Retrieve seller ID from the route parameters
    const [addedProducts, setAddedProducts] = useState([]); // State to store fetched products
    const [isLoading, setIsLoading] = useState(true); // State to handle loading status
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAddedProducts = async () => {
            try {
                const products = await GetAddedProducts(id); // Fetch products using the seller's ID
                setAddedProducts(products); // Update state with fetched products
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setIsLoading(false); // Set loading to false after the fetch attempt
            }
        };

        fetchAddedProducts(); // Call the async function inside useEffect
    }, [id]); // Dependency array ensures this runs when `id` changes

    // Handle delete action
    const handleDelete = async (p_id) => {
        try {
            const response = await axios.delete(`http://localhost:3000/deleteProducts/${id}/${p_id}`); // API call to delete the product
            
            if (response.status === 200) {
                alert("Product deleted successfully!");
                // Update state with functional form to ensure correct state update
                setAddedProducts((prevProducts) =>
                    prevProducts.filter((product) => product._id !== p_id)
                ); // Update the state after deletion
            } else {
                // Handle unexpected response status
                alert("Failed to delete product. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
    
            // Check if it's a network error or if the response contains an error status
            if (!error.response) {
                alert("Network error. Please check your internet connection and try again.");
            } else {
                alert(`Failed to delete product. Error: ${error.response?.data?.message || 'Please try again.'}`);
            }
        }
    };
    

    // Handle update action
    const handleUpdate = (p_id) => {
        navigate(`/updateProduct/${id}/${p_id}`); // Navigate to the product update page
    };

    return (
        <div className="container mx-auto px-4">
            <h1 className="text-center text-3xl font-bold mb-6">Seller's Added Products</h1>
            {isLoading ? (
                <p className="text-center text-lg">Loading...</p>
            ) : addedProducts.length > 0 ? (
                <div>
                    {addedProducts.map((product) => (
                        <div
                            className="product-card bg-white p-4 border rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
                            key={product._id}
                        >
                            <img
                                src={`http://localhost:3000/${product.images?.[0]?.url}` || "default-image.jpg"}
                                alt={product.name}
                                className="w-full h-48 mb-4 rounded"
                            />
                            <div className="flex flex-col justify-between h-full">
                                <div>
                                    <div className="text-xl font-semibold">{product.name}</div>
                                    <div className="pt-4">BRAND: {product.brand}</div>
                                    <div className="text-danger pt-2">${product.price}</div>
                                </div>
                                <div className="mt-auto flex space-x-4">
                                    <button
                                        onClick={() => handleUpdate(product._id)} // Navigate to the update page
                                        className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors"
                                    >
                                        Update
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product._id)} // Call handleDelete function
                                        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center text-lg">No products found.</p>
            )}
        </div>
    );
}
