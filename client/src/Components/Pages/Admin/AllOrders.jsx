import { useEffect, useState } from "react";
import AllOrdersRoute from "../../functionalities/AdminFunctionalities/AllOrdersRoute"; // Assuming this fetches the orders
import { useParams } from "react-router-dom";

export default function AllOrders() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [orderData, setOrderData] = useState([]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const ordersData = await AllOrdersRoute(token); // Fetch orders from the backend
                console.log("Fetched ordersData:", ordersData);
                setOrderData(ordersData.orders || []); // Set orders array from the response
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };
        fetchOrders();
    }, [token]);

    return (
        <div className="bg-gray-100 font-roboto h-screen flex flex-col">
            <nav className="bg-gray-800 text-white py-3">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="" className="hover:text-gray-300">Dashboard</a>
                        </li>
                        <li>
                            <a href="" className="hover:text-gray-300">Seller</a>
                        </li>
                        <li>
                            <a href="" className="hover:text-gray-300">Buyer</a>
                        </li>
                        <li>
                            <a href="" className="hover:text-gray-300">Orders</a>
                        </li>
                        <li>
                            <a href="" className="hover:text-gray-300">Products</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Orders View</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Product Image</th>
                                <th className="py-2 px-4 border-b">Product Name</th>
                                <th className="py-2 px-4 border-b">Category</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Stock</th>
                                <th className="py-2 px-4 border-b">Seller</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData && orderData.length > 0 ? (
                                orderData.map((order, orderIndex) => {
                                    console.log(`Order ${orderIndex + 1}:`, order); // Debugging log
                                    return (
                                        <tr key={order._id}>
                                            <td className="py-2 px-4 border-b">
                                                <img
                                                    alt={order.name}
                                                    height={100}
                                                    src={`http://localhost:3000/${order.images[0]?.url || ""}`}
                                                    width={100}
                                                />
                                            </td>
                                            <td className="py-2 px-4 border-b">{order.name}</td>
                                            <td className="py-2 px-4 border-b">{order.category}</td>
                                            <td className="py-2 px-4 border-b">${order.price}</td>
                                            <td className="py-2 px-4 border-b">{order.stock}</td>
                                            <td className="py-2 px-4 border-b">
                                                {order.sellerID?.name || "Unknown Seller"} <br />
                                                {order.sellerID?.email || "No Email"}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-2 px-4">No orders found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
