import { useEffect, useState } from "react";
import Nav from "../../Nav/navOne";
import FetchOrder from "../../functionalities/FetchOrderRoute";
import { useParams } from "react-router-dom";
import CancelOder from "../../functionalities/CancelOderRoute";
import { toast } from 'react-toastify'; // Import Toastify for alerts

export default function OrderData() {
    const { login, id, usertype } = useParams();
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        // Fetch order data when the component mounts or `id` changes
        const orderdata = async () => {
            try {
                const order = await FetchOrder(id);
                if (order) {
                    setOrders(order); // Set orders in the state
                } else {
                    toast.error("No orders found.");
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to fetch orders.");
            }
        };
        orderdata();
    }, [id]);

    // Handle cancel order functionality
    const handleCancelOrder = async (p_id) => {
        if (!p_id) {
            toast.error("Product ID is invalid.");
            return;
        }

        try {
            const cancel = await CancelOder(id, p_id);
            console.log("cancel",cancel)
            if (cancel) {
                toast.success("Order canceled successfully.");
                // Optionally, remove the canceled order from the state
                setOrders((prevOrders) => prevOrders.filter(order => order.productId !== p_id));
            } else {
                toast.error("Failed to cancel order.");
            }
        } catch (error) {
            console.error("Error canceling order:", error);
            toast.error("Error canceling order.");
        }
    };

    return (
        <>
            <div>
                <Nav />
            </div>
            <div className="container p-4 bg-white shadow pt-8">
                <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
                <div className="space-y-4">
                    {orders.length > 0 ? (
                        orders.map((order) => (
                            <div key={order._id} className="card shadow-md p-4 mb-4">
                                <div className="flex justify-between items-center space-x-4">
                                    {/* Image Section */}
                                    <div className="flex-shrink-0">
                                        <img
                                            src={`http://localhost:3000/${order.productImage}`}
                                            alt={order.productName}
                                            className="w-24 h-24 object-cover rounded-lg"
                                        />
                                    </div>

                                    {/* Product Details Section */}
                                    <div className="flex-1">
                                        <h4 className="text-xl font-semibold">{order.productName.slice(0, 60) + "..."}</h4>
                                        <p className="text-gray-500">Quantity: {order.quantity}</p>
                                        <p className="text-gray-500">Total Price: ₹{order.totalPrice}</p>
                                    </div>

                                    {/* Cancel Button */}
                                    <button
                                        onClick={() => handleCancelOrder(order.productId)}
                                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    >
                                        Cancel Order
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No orders found.</p>
                    )}
                </div>
            </div>
        </>
    );
}
