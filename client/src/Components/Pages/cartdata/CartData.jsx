import { useEffect, useState } from "react";
import GetCartData from "../../functionalities/FetchCart";
import { useParams } from "react-router-dom";

export default function CartData() {
    const params = useParams();
    const id = params.id;
    const [cartData, setCartData] = useState(null); // Initialize as null
    const [totalAmount, setTotalAmount] = useState(0); // State for total amount

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

    const calculateTotalAmount = (cartItems) => {
        const total = cartItems.reduce((acc, item) => acc + item.price, 0);
        setTotalAmount(total); // Set the total amount for cart
    };

    const handleRemoveCartData = (productId) => {
        // Logic to remove item from cart
        console.log("Removing product with ID:", productId);
    };

    return (
        <div className="container pt-5">
            <div className="row">
                <div className="col-2"></div>
                <div className="col-6" id="cartData">
                    {cartData ? (
                        cartData.map((item) => (
                            <div className="card p-4" key={item.productId}>
                                <div className="d-flex gap-5">
                                    <div>
                                        <img
                                            src={`http://localhost:3000/${item.images[0]?.url || ''}`}
                                            alt="Product image"
                                            className="w-[150px] h-full"
                                        />


                                    </div>
                                    <div>
                                        <div className="pt-3">{item.name.slice(0, 60) + "..."}</div>
                                        <div className="pt-3">
                                            <strong>Seller Details:</strong><br />
                                            Name: {item.sellerID.name}<br />
                                            Email: {item.sellerID.email}
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="pt-3">${item.price.toFixed(2)}</div>
                                            <div className="pt-3">
                                                <button
                                                    onClick={() => handleRemoveCartData(item.productId)}
                                                    className="remove-button-style"
                                                >
                                                    REMOVE
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div>Loading cart...</div>
                    )}
                </div>
                <div className="col-4">
                    <div className="bg-white">
                        <div className="p-3">PRICE DETAILS</div>
                        <div id="totalAmount">
                            <div className="d-flex justify-content-between p-3">
                                <div><strong>Total Amount</strong></div>
                                <div>${totalAmount.toFixed(2)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
