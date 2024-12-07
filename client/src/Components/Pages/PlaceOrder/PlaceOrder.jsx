import { useParams } from "react-router-dom";
import FetchAddress from "../../functionalities/getAddress";
import Nav from "../../Nav/navOne";
import React, { useState, useEffect, useCallback } from "react";
import SingleView from "../../functionalities/SingleView";
import GetUser from "../../functionalities/getUser";
import Buynow from "../../functionalities/placeOrderRoute";
import { toast } from 'react-toastify'; // Importing toast
import 'react-toastify/dist/ReactToastify.css';  // Import toast CSS for styling

export default function PlaceOrder() {
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const { id, p_id } = useParams();
    const [product, setProduct] = useState(null); // To store fetched product
    const [loading, setLoading] = useState(true); // Loading state for product
    const [quantity, setQuantity] = useState(1); // State to keep track of quantity
    const [orderConfirmationEmail, setOrderConfirmationEmail] = useState('');

    // Fetch addresses on component mount
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

    // Handle address change
    const handleAddressChange = (address) => {
        setSelectedAddress(address);
        setShowPrompt(false); // Close the prompt
    };

    // Fetch single product
    useEffect(() => {
        const fetchSingleData = async () => {
            setLoading(true); // Set loading to true before fetching
            const productData = await SingleView(p_id);
            console.log("product from placeorder", productData);
            setProduct(productData);
            setLoading(false); // Set loading to false once product is fetched
        };
        fetchSingleData();
    }, [p_id]);

    // Get stock message
    const getStockMessage = (stock) => {
        if (stock === 0) {
            return "No stock";
        } else if (stock < 10) {
            return "Hurry, few left!";
        } else {
            return ""; // No message for stock > 10
        }
    };

    // Handle increment of quantity
    const incrementQuantity = () => {
        if (product && quantity < product.product.stock) {
            setQuantity(quantity + 1);
        }
    };

    // Handle decrement of quantity
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    useEffect(() => {
        let fetchUserData = async function () {
            let user = await GetUser(id);
            console.log("user data form place order", user);
            setOrderConfirmationEmail(user.email);
        };
        fetchUserData();
    }, [id]);

    // Calculate final price after discount
    const discountPercentage = product ? parseInt(product.product.discount) : 0; // Parse the discount percentage
    const originalPrice = product ? product.product.price : 0;

    const discountAmount = (originalPrice * discountPercentage) / 100; // Calculate the discount amount
    const finalPrice = originalPrice - discountAmount; // Calculate the final price after discount

    const handlePlaceOrder = useCallback(() => {
        const postOrder = async function () {
            // Calculate the total price
            const totalPrice = finalPrice * quantity;
            console.log('totalPrice', totalPrice);

            let data = {
                productId: p_id,
                quantity,
                totalPrice,
            };

            try {
                const order = await Buynow(data, id); // Assuming Buynow function takes `data` and `id`
                console.log("order", order);

                // Display the server message in a toast if the order was successful
                if (order) {
                    // Success toast
                    toast.success(order.message || 'Order placed successfully!');
                }
            } catch (error) {
                console.error("Error placing the order", error);
                // Display error in case of failure
                toast.error(error.message || 'Something went wrong');
            }
        };

        postOrder();
    }, [finalPrice, quantity, p_id, id, selectedAddress, orderConfirmationEmail]);

    return (
        <>
            <div>
                <Nav />
            </div>
            <div className="flex md:container md:mx-auto">
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

                    {/* Order Summary Section */}
                    <div className="bg-white shadow">
                        <div className="p-3">
                            <h5>ORDER SUMMARY</h5>
                            {loading ? (
                                <p>Loading product details...</p> // Display loading message
                            ) : product ? (
                                <div className="flex">
                                    {/* Left Section for Product Image */}
                                    <div className="w-1/3">
                                        <img
                                            src={`http://localhost:3000/${product.product.images[0].url}`} // Ensure the image path is correct
                                            alt={product.product.images[0].alt}
                                            className="w-[500px]"
                                        />
                                    </div>

                                    {/* Right Section for Product Details */}
                                    <div className="w-2/3 pl-4">
                                        <p className="fs-4">{product.product.name.slice(0, 70) + "..."}</p>
                                        <p>{product.product.description.slice(0, 60) + "..."}</p>
                                        <div>Seller : {product.product.brand}</div>
                                        <div className="flex gap-3">
                                            <div><strong className="fs-5 line-through">${originalPrice}</strong></div>
                                            <div><p className="text-green-600">{discountPercentage}% off</p></div> {/* Discount percentage */}
                                        </div>
                                        <p>{getStockMessage(product.product.stock)}</p> {/* Stock message */}

                                        {/* Final Price */}
                                        <div className="mt-3">
                                            <p><strong className="fs-5"> ${finalPrice.toFixed(2)}</strong></p> {/* Final payable amount */}
                                        </div>

                                        {/* Quantity Counter Section */}
                                        <div className="mt-4">
                                            <div className="flex items-center">
                                                <button
                                                    onClick={decrementQuantity}
                                                    disabled={quantity <= 1}
                                                    className="px-3 py-1 bg-gray-300 rounded"
                                                >
                                                    -
                                                </button>
                                                <span className="px-4">{quantity}</span>
                                                <button
                                                    onClick={incrementQuantity}
                                                    disabled={product && quantity >= product.product.stock}
                                                    className="px-3 py-1 bg-gray-300 rounded"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>No product found.</p>
                            )}
                        </div>
                    </div>

                    {/* Order Confirmation Email Section */}
                    <div className="bg-white shadow mt-4">
                        <div className="flex justify-between">
                            <div className="p-3">
                                <p>An order confirmation email will be sent to <strong>{orderConfirmationEmail}</strong></p>
                            </div>
                            <div className="pt-3 px-3 "><button className="bg-orange-500 p-2 px-5" onClick={handlePlaceOrder}>Place Order</button></div>
                        </div>
                    </div>
                </div>

                {/* Payment Summary Section */}
                <div className="p-3 w-1/4">
                    <div className="bg-white shadow mt-4">
                        <div className="p-3">
                            <h5>PAYMENT SUMMARY</h5>
                            {/* Display Final Price After Discount and Quantity */}
                            <div className="flex justify-between">
                                <p>Quantity:</p>
                                <p>{quantity}</p>
                            </div>
                            <div className="flex justify-between">
                                <p>Total Price:</p>
                                <p><strong>${(finalPrice * quantity).toFixed(2)}</strong></p> {/* Total payable amount based on quantity */}
                            </div>
                            <div className="flex justify-between">
                                <p>Shipping (if any):</p>
                                <p><strong>$0.00</strong> {/* Placeholder for shipping cost */}</p>
                            </div>
                            <div className="flex justify-between">
                                <p><strong>Total Amount:</strong></p>
                                <p><strong>${(finalPrice * quantity).toFixed(2)}</strong></p> {/* Final amount to be paid */}
                            </div>
                        </div>
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
