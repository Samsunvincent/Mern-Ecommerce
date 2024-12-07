import { useEffect, useState } from "react";
import GetCartData from "../../functionalities/FetchCart";
import { useParams } from "react-router-dom";
import RemoveCartData from "../../functionalities/RemoveCartRoute";
import FetchAddress from "../../functionalities/getAddress";
import Buynow from "../../functionalities/placeOrderRoute";
import Nav from "../../Nav/navOne";

export default function CartData() {
    const params = useParams();
    const id = params.id;
    const [cartData, setCartData] = useState(null); // Initialize as null
    const [totalAmount, setTotalAmount] = useState(0); // State for total amount
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        const fetchedData = async () => {
            try {
                const response = await GetCartData(id); // Fetch cart data
                console.log("RESPONSE", response); // Log the response
                setCartData(response); // Set the cart data state
                calculateTotalAmount(response); // Calculate total amount
            } catch (error) {
                console.error("Error fetching cart data:", error); // Handle error
            }
        };

        fetchedData(); // Call the async function
    }, [id]);

    useEffect(() => {
        const getAddresses = async () => {
            const fetchedAddresses = await FetchAddress(id);
            if (fetchedAddresses && fetchedAddresses.length > 0) {
                setAddresses(fetchedAddresses);
                setSelectedAddress(fetchedAddresses[0]); // Default to the first address
            }
        };
        getAddresses();
    }, [id]);

    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        setShowPrompt(false); // Close the prompt
    };

    const calculateTotalAmount = (cartItems) => {
        const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0); // Multiply by quantity
        setTotalAmount(total); // Set the total amount for cart
    };

    const handleRemoveCartData = async (productId) => {
        console.log("Removing product with ID:", productId);
        const data = { id: id };

        let deletedata = await RemoveCartData(productId, data);
        console.log("delete data", deletedata);
    };

    // Collect all product IDs, quantities, and prices to send to Buynow
    const handleProceedToPayment = async () => {
        // Collect all product IDs, quantities, and prices to send to Buynow
        const productsToOrder = cartData.map((item) => ({
            productId: item._id,   // Product ID
            quantity: item.quantity, // Quantity
            totalPrice: item.price * item * 1 // Total price for the product
        }));

        try {
            // Call Buynow function with products to order
            const response = await Buynow({ products: productsToOrder }, id);  // Send products as a body object
            console.log("Order placed successfully:", response);
            // Handle success (e.g., redirect to confirmation page or show success message)
        } catch (error) {
            console.error("Error placing order:", error);
            // Handle error (e.g., show an error message to the user)
        }
    };

    return (

        <>
        <Nav/>
            <div className="flex md:container md:mx-auto">
                {/* Left Side: Cart Items and Address */}
                <div className="p-3 w-3/4 space-y-4">
                    {/* Delivery Address Section */}
                    <div className="bg-white shadow">
                        <div className="flex justify-between px-3">
                            <div className="p-3">
                                <h5>Delivery ADDRESS:</h5>
                                <p>
                                    {selectedAddress
                                        ? `${selectedAddress.name}, ${selectedAddress.street}, ${selectedAddress.city}, ${selectedAddress.state}, ${selectedAddress.country} - ${selectedAddress.pincode}`
                                        : "No address selected."}
                                </p>
                            </div>
                            <div className="pt-4">
                                <button
                                    style={{
                                        color: "rgb(67,133,242)",
                                        background: "none",
                                        border: "1px solid transparent",
                                        padding: 0,
                                        fontSize: "inherit",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setShowPrompt(true)}
                                >
                                    Change
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Cart Products Section */}
                    <div className="bg-white shadow p-4">
                        <h5 className="text-lg font-semibold mb-4">Your Cart</h5>
                        {cartData && cartData.length > 0 ? (
                            <ul className="space-y-4">
                                {cartData.map((item, index) => (
                                    <li
                                        key={index}
                                        className="flex items-center justify-between border-b pb-4"
                                    >
                                        {/* Left Side: Product Image */}
                                        <div className="flex-shrink-0 w-16 h-16">
                                            <img
                                                src={`http://localhost:3000/${item.images[0].url}`} // Replace with the correct image field
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>

                                        {/* Right Side: Product Details */}
                                        <div className="ml-4 flex-1">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-gray-600 text-sm">Price: ₹{item.price}</p>
                                            <p className="text-gray-500 text-xs">
                                                Quantity: {item.quantity || 1}
                                            </p>
                                        </div>

                                        {/* Remove Button */}
                                        <button
                                            className="text-red-600 underline text-sm"
                                            onClick={() => handleRemoveCartData(item._id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Your cart is empty.</p>
                        )}
                    </div>
                </div>

                {/* Right Side: Payment Summary */}
                <div className="p-3 w-1/4">
                    <div className="bg-white shadow p-4">
                        <h5 className="text-lg font-semibold mb-4">Payment Summary</h5>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <p>Subtotal:</p>
                                <p>₹{totalAmount}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Shipping:</p>
                                <p className="text-green-500">₹free</p> {/* Replace with dynamic value if applicable */}
                            </div>
                            <div className="flex justify-between font-semibold">
                                <p>Total:</p>
                                <p>₹{totalAmount + 50}</p> {/* Adjust based on shipping */}
                            </div>
                        </div>
                        <button
                            className="mt-4 bg-blue-500 text-white w-full py-2 rounded hover:bg-blue-600"
                            onClick={handleProceedToPayment}
                        >
                            Proceed to Payment
                        </button>
                    </div>
                </div>

                {/* Address Selection Prompt */}
                {showPrompt && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded shadow-md">
                            <h2 className="text-lg font-semibold mb-4">Select Address</h2>
                            {addresses.length > 0 ? (
                                <ul>
                                    {addresses.map((address, index) => (
                                        <li key={index} className="mb-2">
                                            <label className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="address"
                                                    value={address._id}
                                                    className="mr-2"
                                                    checked={selectedAddress && selectedAddress._id === address._id}
                                                    onChange={() => handleAddressChange(address)}
                                                />
                                                {`${address.name}, ${address.street}, ${address.city}, ${address.state}, ${address.country} - ${address.pincode}`}
                                            </label>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No addresses available.</p>
                            )}
                            <button
                                className="mt-4 bg-gray-500 text-white px-4 py-2 rounded"
                                onClick={() => setShowPrompt(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
