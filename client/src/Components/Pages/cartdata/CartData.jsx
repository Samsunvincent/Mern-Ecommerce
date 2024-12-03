import { useEffect, useState } from "react";
import GetCartData from "../../functionalities/FetchCart";
import { useParams } from "react-router-dom";

export default function CartData() {
    const params = useParams();
    let token_key = params.login;
    let id = params.id;
    const [cartData, setCartData] = useState(null); // Initialize as null

    useEffect(() => {
        const fetchedData = async () => {
            try {
                const response = await GetCartData(id); // Fetch cart data
                console.log("RESPONSE", response); // Log the response
                setCartData(response); // Set the cart data state
            } catch (error) {
                console.error("Error fetching cart data:", error); // Handle error
            }
        };

        fetchedData(); // Call the async function
    }, [id]);

    const handleRemoveCartData = (productId) => {
    
    };

    return (
        <div id="emptycart" className="container mx-auto p-8">
            <div className="w-full text-center bg-white shadow-md rounded-xl p-8">
                <div className="text-center pt-5">
                        <div className="text-5xl">
                            Your cart
                        </div>
                    {cartData && cartData.length === 0 ? (
                        <>
                            <img
                                src="https://rukminim2.flixcart.com/www/800/800/promos/16/05/2019/d438a32e-765a-4d8b-b4a6-520b560971e8.png?q=90"
                                alt="Empty cart"
                                className="w-[221.91px] h-[162px] mx-auto"
                            />
                            <div>Your cart is empty!</div>
                            <div>Add items to it now</div>
                        </>
                    ) : cartData ? (
                        <div id="cartData">
                            {/* Display cart data */}
                            <div>Your Cart Data:</div>
                            {cartData.map((item, index) => (
                                <div key={index} className="p-5 card shadow-md rounded-md mb-4">
                                    <div className="flex gap-3">
                                        {/* Product Image */}
                                        <div>
                                            <img
                                                src={`http://localhost:3000/${item.images[0]?.url}` || ''}
                                                alt="Product image"
                                                className="w-[50%] h-[100%]"
                                            />
                                        </div>

                                        {/* Product Information */}
                                        <div className="flex flex-col justify-between">
                                            <div>
                                                <div className="text-lg font-semibold">
                                                    {item.name || 'Unknown Product'}
                                                </div>
                                                <div className="text-sm text-gray-600">
                                                    Brand: {item.brand || 'Unknown Brand'}
                                                </div>
                                                <div className="text-lg text-green-600">
                                                    ₹{item.price || 'N/A'}
                                                </div>
                                                <div className="text-sm text-gray-500">
                                                    Stock remaining: {item.stock || 'Out of stock'}
                                                </div>
                                            </div>

                                            {/* Remove Button */}
                                            <div className="pt-3">
                                                <button
                                                    onClick={() => handleRemoveCartData(item.productId)}
                                                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all"
                                                >
                                                    REMOVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div>Loading cart...</div> // If cartData is still null
                    )}
                </div>
            </div>
        </div>
    );
}
