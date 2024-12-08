import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Count from "../../functionalities/AdminFunctionalities/CountRoute";

export default function AdminDashBoard() {
    const { login, id, usertype } = useParams();
    const [totalUsers, setTotalUsers] = useState('');
    const [totalOrders, setTotalOrders] = useState('');
    const [totalRevenue, setTotalRevenue] = useState('');
    const [lastFiveOrders, setLastFiveOrders] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const countData = async () => {
            const token = localStorage.getItem(login);
            const count = await Count(token);
            console.log("count from dashboard:", count);

            // Set count data
            setTotalUsers(count.totalUsers);
            setTotalOrders(count.totalOrders);
            setTotalRevenue(count.totalRevenue);
            
            // Set the last five orders (Assuming the structure is correct)
            setLastFiveOrders(count.lastFiveOrders); // Assuming `count.lastFiveOrders` contains product details
        };
        countData();
    }, [login]);

    const handleSingleView = useCallback((p_id) => {
        // console.log("Selected product ID:", productId);
        navigate(`/singleView/${login}/${id}/${usertype}/${p_id}`)
        // You can now use the productId to navigate to a product detail page or perform other actions
    }, []);

   const handleSellers = useCallback(() =>{
    console.log('hello world');
    navigate(`/Sellers/${login}/${id}/${usertype}`)
   })

   const handleBuyers = useCallback(() =>{
    console.log('hello world');
    navigate(`/Buyer/${login}/${id}/${usertype}`)
   })
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-md">
                <div className="container mx-auto px-6 py-6 flex justify-between items-center">
                    <h1 className="text-3xl font-semibold text-gray-800">Admin Panel</h1>
                    <div className="flex items-center space-x-6">
                        <button className="text-gray-600 hover:text-gray-800">
                            <i className="fas fa-bell text-xl"></i>
                        </button>
                        <img
                            alt="Profile picture of the admin"
                            className="w-12 h-12 rounded-full"
                            height={48}
                            src="https://storage.googleapis.com/a1aa/image/IeyVJMLWMlVeE0mfsAYaHIw4OLA4O3MqxkIaJfV9Dba5k0iPB.jpg"
                            width={48}
                        />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-64 bg-white shadow-lg">
                    <div className="p-6">
                        <nav className="space-y-6">
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-tachometer-alt mr-4 text-lg"></i>
                                Dashboard
                            </a>
                            
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#" onClick={handleSellers}>
                                <i className="fas fa-users mr-4 text-lg"></i>
                                Sellers
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#" onClick={handleBuyers}>
                                <i className="fas fa-users mr-4 text-lg"></i>
                                Buyers
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-cogs mr-4 text-lg"></i>
                                Orders
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-cogs mr-4 text-lg"></i>
                                Products
                            </a>
                            <a className="flex items-center text-gray-700 hover:text-gray-900 font-medium" href="#">
                                <i className="fas fa-sign-out-alt mr-4 text-lg"></i>
                                Logout
                            </a>
                        </nav>
                    </div>
                </aside>

                {/* Main Panel */}
                <main className="flex-1 p-6">
                    <div className="container mx-auto">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-6">Dashboard</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Card 1: Total Users */}
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Total Users</h3>
                                    <p className="text-3xl font-bold text-gray-900">{totalUsers}</p>
                                </div>
                                <i className="fas fa-users text-4xl text-gray-300"></i>
                            </div>

                            {/* Card 2: New Orders */}
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">New Orders</h3>
                                    <p className="text-3xl font-bold text-gray-900">{totalOrders}</p>
                                </div>
                                <i className="fas fa-shopping-cart text-4xl text-gray-300"></i>
                            </div>

                            {/* Card 3: Revenue */}
                            <div className="bg-white p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-semibold text-gray-800">Revenue</h3>
                                    <p className="text-3xl font-bold text-gray-900">{totalRevenue}</p>
                                </div>
                                <i className="fas fa-dollar-sign text-4xl text-gray-300"></i>
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="mt-12">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
                            <div className="bg-white p-6 rounded-xl shadow-lg">
                                <ul className="space-y-6">
                                    {lastFiveOrders.length > 0 ? lastFiveOrders.map((order, index) => (
                                        <li 
                                            key={index} 
                                            className="flex items-center justify-between space-x-4 hover:bg-gray-50 rounded-lg p-3" 
                                            onClick={() => handleSingleView(order.productId)} // Pass the productId when clicked
                                        >
                                            <div className="flex items-center">
                                                <img
                                                    alt={order.productDetails.name} // Use product name for alt text
                                                    className="w-16 h-16 rounded-md mr-4" // Increased image size and added margin
                                                    height={64}
                                                    src={`http://localhost:3000/${order.productDetails.images[0].url}`} // Assuming the product image is stored under "uploads"
                                                    width={64}
                                                />
                                                <div>
                                                    <p className="text-gray-800 font-semibold">{order.productDetails.name.slice(0, 60) + "..."}</p>
                                                    <p className="text-gray-600">{order.productDetails.description.slice(0, 50) + "..."}</p>
                                                    <p className="text-gray-800 font-semibold">Price: ₹{order.productDetails.price}</p>
                                                </div>
                                            </div>
                                            <span className="text-gray-600 text-sm">
                                                {new Date(order.createdAt).toLocaleDateString()} {/* Display order creation date */}
                                            </span>
                                        </li>
                                    )) : (
                                        <li>No recent orders available.</li>
                                    )}
                                </ul>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
