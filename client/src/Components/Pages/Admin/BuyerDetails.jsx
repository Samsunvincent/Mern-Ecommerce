import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import BuyerDetailsRoute from "../../functionalities/AdminFunctionalities/BuyerDetailsRoute";


export default function UserProfile() {
  const { login, id, usertype, b_id } = useParams();
  const token = localStorage.getItem(login);
  const [cartedProducts, setCartedProducts] = useState([]);
  const [buyerData, setBuyerData] = useState({});
  const [orderedProducts, setOrderedProducts] = useState([]);
  const [wishlistedProducts, setWishlistedProducts] = useState([]);
  const [showCart, setShowcart] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);
  const [showOrders, setShowOrders] = useState(false);
  const navigate = useNavigate()

  useEffect(() => {
    const BuyersData = async () => {
      let data = await BuyerDetailsRoute(token, b_id);
      console.log("data", data);
      setCartedProducts(data.cartedProducts);
      setBuyerData(data.BuyerDetails); // Set buyer details
      setOrderedProducts(data.orderedProducts);
      setWishlistedProducts(data.wishlistedProducts);
    };
    BuyersData();
  }, [b_id, token]);

  const handleCartClick = useCallback(() => {
    setShowcart(true);
    setShowWishlist(false);
    setShowOrders(false)
  }, []);

  const handleWishlistClick = useCallback(() => {
    setShowcart(false);
    setShowWishlist(true);
    setShowOrders(false)
  }, []);

  const handleOrders = useCallback(() =>{
    setShowcart(false);
    setShowWishlist(false);
    setShowOrders(true)
  })

  const handleDashBoard = useCallback(() => {
    navigate(`/Admin/${login}/${id}/${usertype}`)
})

const handleSeller = useCallback(() =>{
    navigate(`/Sellers/${login}/${id}/${usertype}`)
})
const handleBuyer = useCallback(() =>{
    navigate(`/Buyer/${login}/${id}/${usertype}`)
})
const handleProductsClick = useCallback(() =>{
  navigate(`/AllProducts/${login}/${id}/${usertype}`)
})

  return (
    <div className="bg-gray-100 font-roboto min-h-screen">
      <nav className="bg-gray-800 text-white py-3">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <ul className="flex space-x-4">
            <li>
              <a href="" onClick={handleDashBoard} className="hover:text-gray-300">
                Dashboard
              </a>
            </li>
            <li>
              <a href="" onClick={handleBuyer} className="hover:text-gray-300">
                Buyers
              </a>
            </li>
            <li>
              <a href="" onClick={handleSeller} className="hover:text-gray-300">
                Seller
              </a>
            </li>
            <li>
              <a href="/admin-products" className="hover:text-gray-300">
                Products
              </a>
            </li>
            <li>
              <a href="" onClick={handleProductsClick} className="hover:text-gray-300">
                Orders
              </a>
            </li>
           
          </ul>
        </div>
      </nav>

      <div className="container mx-auto p-6 border-4 border-b-indigo-500 border-r-indigo-500 pt-3">
        <h1 className="text-2xl font-bold mb-6">Buyer Profile - {buyerData.name}</h1>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Profile Details</h2>
          <div className="space-y-4">
            <div className="flex gap-2 items-center">
              <span className="font-bold">Name:</span>
              <span>{buyerData.name}</span>
            </div>
            <div className="flex gap-3 items-center">
              <span className="font-bold">Email:</span>
              <span>{buyerData.email}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold">Phone:</span>
              <span>{buyerData.phone_number}</span>
            </div>
            <div className="flex gap-2 items-center">
              <span className="font-bold">Address:</span>
              <div>
                {buyerData.Address && buyerData.Address.length > 0 && (
                  <div>
                    <p>{buyerData.Address[0].name}, {buyerData.Address[0].street}, {buyerData.Address[0].city}, {buyerData.Address[0].state}, {buyerData.Address[0].country}, {buyerData.Address[0].pincode}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action buttons */}
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
            onClick={handleOrders}
              className="border-4 border-t-indigo-700 border-l-indigo-700 py-2 px-4 rounded-md hover:bg-blue-700 hover:text-white ml-4"
            >
              Orders ({orderedProducts.length})
            </button>
          </div>
        </div>

        {/* Carted products display */}
        {showCart && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Carted Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {cartedProducts.map((product, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
                  <img
                    src={`http://localhost:3000/${product.images[0].url}`} // Assuming product.image contains the image name
                    alt={product.name}
                    className="w-full h-60 rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p>{product.description.slice(0, 60) + "..."}</p>
                  <p className="text-lg font-bold">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Wishlisted products display */}
        {showWishlist && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Wishlisted Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {wishlistedProducts.map((product, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
                  <img
                    src={`http://localhost:3000/${product.images[0].url}`} // Assuming product.image contains the image name
                    alt={product.name}
                    className="w-full h-60 rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p>{product.description.slice(0, 60) + "..."}</p>
                  <p className="text-lg font-bold">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {showOrders &&(
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4">Wishlisted Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {orderedProducts.map((product, index) => (
                <div key={index} className="border p-4 rounded-lg shadow-sm hover:shadow-lg">
                  <img
                    src={`http://localhost:3000/${product.images[0].url}`} // Assuming product.image contains the image name
                    alt={product.name}
                    className="w-full h-60 rounded-md mb-4"
                  />
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p>{product.description.slice(0, 60) + "..."}</p>
                  <p className="text-lg font-bold">Price: ${product.price}</p>
                  <p className="text-sm text-gray-600">Quantity: {product.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
