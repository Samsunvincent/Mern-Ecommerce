import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SellerDetailsRoute from "../../functionalities/AdminFunctionalities/SellerDetailsRoute";

export default function SellerProfile() {
    const { login, id, usertype, s_id } = useParams();
    const token = localStorage.getItem(login);
    const [sellerDetails, setSellerDetails] = useState({});
    const [cartedProducts, setCartedProducts] = useState([]);
    const [orderedProducts, setOrderedProducts] = useState([]);
    const [wishlistedProducts, setWishlistedProducts] = useState([]);
    const [showCart, setShowCart] = useState(false);
    const [showWishlist, setShowWishlist] = useState(false);
    const [showOrders, setShowOrders] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSellerData = async () => {
            const data = await SellerDetailsRoute(token, s_id);
            setCartedProducts(data.cartedProducts);
            setSellerDetails(data.SellerDetails);
            setOrderedProducts(data.orderedProducts);
            setWishlistedProducts(data.wishlistedProducts);
        };
        fetchSellerData();
    }, [s_id, token]);

    const handleCartClick = useCallback(() => {
        setShowCart(true);
        setShowWishlist(false);
        setShowOrders(false);
    }, []);

    const handleWishlistClick = useCallback(() => {
        setShowCart(false);
        setShowWishlist(true);
        setShowOrders(false);
    }, []);

    const handleOrdersClick = useCallback(() => {
        setShowCart(false);
        setShowWishlist(false);
        setShowOrders(true);
    }, []);

    const handleDashboard = useCallback(() => {
        navigate(`/Admin/${login}/${id}/${usertype}`);
    }, [login, id, usertype, navigate]);

    const handleDashBoard = useCallback(() => {
        navigate(`/Admin/${login}/${id}/${usertype}`)
    })
    
    const handleSeller = useCallback(() =>{
        navigate(`/Sellers/${login}/${id}/${usertype}`)
    })
    const handleBuyer = useCallback(() =>{
        navigate(`/Buyer/${login}/${id}/${usertype}`)
    })

    return (
        <div className="bg-gray-100 font-roboto min-h-screen">
            <nav className="bg-gray-800 text-white py-3">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="" onClick={handleDashboard} className="hover:text-gray-300">
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="" onClick={handleSeller} className="hover:text-gray-300">
                                Seller
                            </a>
                        </li>
                        <li>
                            <a href="" onClick={handleBuyer} className="hover:text-gray-300">
                                Buyer
                            </a>
                        </li>
                        <li>
                            <a href="" onClick={handleDashboard} className="hover:text-gray-300">
                                Orders
                            </a>
                        </li>
                        <li>
                            <a href="" onClick={handleDashboard} className="hover:text-gray-300">
                                Products
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="container mx-auto p-6 border-4 border-b-indigo-500 border-r-indigo-500 pt-3">
                <h1 className="text-2xl font-bold mb-6">Seller Profile - {sellerDetails.name}</h1>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
                    <div className="space-y-4">
                        <div className="flex gap-2 items-center">
                            <span className="font-bold">Name:</span>
                            <span>{sellerDetails.name}</span>
                        </div>
                        <div className="flex gap-3 items-center">
                            <span className="font-bold">Email:</span>
                            <span>{sellerDetails.email}</span>
                        </div>
                        <div className="flex gap-2 items-center">
                            <span className="font-bold">Phone:</span>
                            <span>{sellerDetails.phone_number}</span>
                        </div>
                        {/* Additional seller details can go here */}
                    </div>

                    <div className="mt-6">
                        <button
                            onClick={handleCartClick}
                            className="border-4 border-t-indigo-700 border-l-indigo-700 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white"
                        >
                            Carted Products ({cartedProducts.length})
                        </button>
                        <button
                            onClick={handleWishlistClick}
                            className="border-4 border-t-indigo-700 border-l-indigo-700 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white ml-4"
                        >
                            Wishlisted Products ({wishlistedProducts.length})
                        </button>
                        <button
                            onClick={handleOrdersClick}
                            className="border-4 border-t-indigo-700 border-l-indigo-700 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white ml-4"
                        >
                            Orders ({orderedProducts.length})
                        </button>
                    </div>
                </div>

                {showCart && (
                    <ProductList title="Carted Products" products={cartedProducts} />
                )}

                {showWishlist && (
                    <ProductList title="Wishlisted Products" products={wishlistedProducts} />
                )}

                {showOrders && (
                    <ProductList title="Ordered Products" products={orderedProducts} />
                )}
            </div>
        </div>
    );
}

const ProductList = ({ title, products }) => (
    <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
                    <img
                        src={`http://localhost:3000/${product.images[0]?.url || ""}`}
                        alt={product.name}
                        className="w-full h-60 rounded-md mb-4"
                    />
                    <h3 className="text-lg font-semibold">{product.name}</h3>
                    <p>{product.description?.slice(0, 60)}...</p>
                    <p className="text-lg font-bold">Price: ${product.price}</p>
                    <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
            ))}
        </div>
    </div>
);
