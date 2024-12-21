import { useCallback, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import GetCartData from "../../functionalities/FetchCart";
import { useNavigate, useParams } from "react-router-dom";
import RemoveCartData from "../../functionalities/RemoveCartRoute";
import FetchAddress from "../../functionalities/getAddress";
import Buynow from "../../functionalities/placeOrderRoute";
import Nav from "../../Nav/navOne";

export default function CartData() {
    const params = useParams();
    const [cartData, setCartData] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const navigate = useNavigate();
    const { login, id, usertype } = useParams();

    // Fetch cart data
    useEffect(() => {
        const fetchCartData = async () => {
            try {
                const response = await GetCartData(id);
                setCartData(response);
                calculateTotalAmount(response);
            } catch (error) {
                console.error("Error fetching cart data:", error);
                toast.error("Failed to fetch cart data.");
            }
        };

        fetchCartData();
    }, [id]);

    // Fetch addresses
    useEffect(() => {
        let isMounted = true; // Flag to track the first render

        const fetchAddresses = async () => {
            try {
                const fetchedAddresses = await FetchAddress(id);
                if (isMounted) {
                    if (fetchedAddresses && fetchedAddresses.length > 0) {
                        setAddresses(fetchedAddresses);
                        setSelectedAddress(fetchedAddresses[0]);
                    } else {
                        toast.warning("No addresses available.");
                    }
                }
            } catch (error) {
                console.error("Error fetching addresses:", error);
                toast.error("Failed to fetch addresses.");
            }
        };

        fetchAddresses();

        return () => {
            isMounted = false; // Cleanup for strict mode
        };
    }, [id]);

    // Calculate total cart amount
    const calculateTotalAmount = (cartItems) => {
        const total = cartItems.reduce(
            (acc, item) => acc + item.price * (item.quantity || 1),
            0
        );
        setTotalAmount(total);
    };

    // Update quantity in the cart with stock validation
    const handleQuantityChange = (productId, newQuantity) => {
        const updatedCart = cartData.map((item) => {
            if (item._id === productId) {
                // Check if the stock is available
                if (newQuantity <= item.stock) {
                    return { ...item, quantity: Math.max(1, newQuantity) };
                } else {
                    // Show a toast error if the quantity exceeds stock
                    toast.success(`Insufficient stock is available for ${item.name}.`);
                    return item;
                }
            }
            return item;
        });
        setCartData(updatedCart);
        calculateTotalAmount(updatedCart);
    };

    // Handle address selection
    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        setShowPrompt(false);
    };

    // Handle product removal from cart
    const handleRemoveCartData = async (productId, e) => {
        e.stopPropagation();
        try {
            const removedDataMessage = await RemoveCartData(id, productId);
            if (removedDataMessage.success) {
                toast.success(removedDataMessage.message);
                const updatedCart = await GetCartData(id);
                setCartData(updatedCart);
                calculateTotalAmount(updatedCart);
            } else {
                toast.error("Failed to remove product.");
            }
        } catch (error) {
            console.error("Error removing product:", error);
            toast.error("An error occurred while removing the product.");
        }
    };

    // Handle proceeding to payment with stock validation
    const handleProceedToPayment = async () => {
        if (!cartData || cartData.length === 0) {
            toast.error("Your cart is empty.");
            return;
        }

        if (!selectedAddress) {
            toast.error("Please select a delivery address.");
            return;
        }

        // Validate stock for each item
        for (let item of cartData) {
            if (item.quantity > item.stock) {
                toast.error(`Only ${item.stock} items are available for ${item.name}.`);
                return;
            }
        }

        const productsToOrder = cartData.map((item) => ({
            productId: item._id,
            quantity: item.quantity || 1,
            totalPrice: item.price * (item.quantity || 1),
        }));

        try {
            // Send the order to the backend and clear the cart on success
            const response = await Buynow(
                { products: productsToOrder, addressId: selectedAddress._id },
                id
            );

            if (response && response.success) {
                toast.success("Order placed successfully!");

                // Delay the page reload to allow the toast notification to show
                setTimeout(() => {
                    window.location.reload();
                }, 2000); // Delay for 2 seconds
            }
        } catch (error) {
            console.error("Error placing order:", error);
            toast.error("Failed to place order. Please try again.");
        }
    };

    // Check if there's any item in the cart with stock 0
    const isStockAvailable = cartData.every(item => item.stock > 0);

    // Handle navigating to single product view
    const handleSingleView = useCallback((p_id) => {
        navigate(`/singleView/${login}/${id}/${usertype}/${p_id}`);
    }, [navigate, login, id, usertype]);

    return (
        <>
            <Nav />
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
                                        onClick={() => handleSingleView(item._id)}
                                        style={{ cursor: "pointer" }}
                                    >
                                        <div className="flex-shrink-0 w-16 h-16">
                                            <img
                                                src={`http://localhost:3000/${item.images[0].url}`}
                                                alt={item.name}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <p className="font-semibold">{item.name}</p>
                                            <p className="text-gray-600 text-sm">
                                                Price: ₹{item.price}
                                            </p>
                                            <p className="text-gray-500 text-xs">
                                                Quantity:
                                                <button
                                                    className="px-2 py-1 bg-gray-200 text-black font-semibold rounded-l hover:bg-gray-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(item._id, (item.quantity || 1) - 1);
                                                    }}
                                                >
                                                    -
                                                </button>
                                                <span className="px-4 py-1 border-t border-b border-gray-300">{item.quantity || 1}</span>
                                                <button
                                                    className="px-2 py-1 bg-gray-200 text-black font-semibold rounded-r hover:bg-gray-300"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleQuantityChange(item._id, (item.quantity || 1) + 1);
                                                    }}
                                                >
                                                    +
                                                </button>
                                            </p>
                                            {/* Stock Message */}
                                            {item.stock === 0 && (
                                                <p className="text-red-500 text-xs mt-1">No stock</p>
                                            )}
                                            {item.stock > 0 && item.stock <= 10 && (
                                                <p className="text-orange-500 text-xs mt-1">Hurry, only few left !</p>
                                            )}
                                        </div>
                                        <button
                                            className="text-red-600 underline text-sm"
                                            onClick={(e) => handleRemoveCartData(item._id, e)}
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
                                <p className="text-green-500">₹free</p>
                            </div>
                            <div className="flex justify-between font-semibold">
                                <p>Total:</p>
                                <p>₹{totalAmount}</p>
                            </div>
                        </div>
                        <button
                            className={`mt-4 w-full py-2 rounded ${isStockAvailable ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
                            onClick={isStockAvailable ? handleProceedToPayment : null}
                            disabled={!isStockAvailable}
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
                                className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                                onClick={() => setShowPrompt(false)}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
            <ToastContainer />
        </>
    );
}
