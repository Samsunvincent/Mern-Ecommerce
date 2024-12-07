import { useCallback, useEffect, useState } from "react";
import FetchWishlist from "../../functionalities/FetchWishlist";
import axios from "axios"; // Import axios for delete functionality
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../Nav/navOne";
import AddToCart from "../../functionalities/addToCart";

export default function WishlistContainer() {
    const { login, id, usertype } = useParams();
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const getWishlist = async () => {
            setLoading(true);
            try {
                const products = await FetchWishlist(id);
                setWishlistProducts(products);
            } catch (err) {
                console.error("Error fetching wishlist:", err);
                setError("Failed to fetch wishlist. Please try again later.");
            } finally {
                setLoading(false);
            }
        };
        getWishlist();
    }, [id]);

    const handleDelete = async (p_id) => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/deletewishlist/${id}/${p_id}`
            );
            console.log("Delete response:", response.data);

            // Remove the deleted product from the state
            setWishlistProducts((prev) =>
                prev.filter((product) => product._id !== p_id)
            );
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleShopNow = useCallback(() => {
        navigate(`/${login}/${id}/${usertype}`);
    }, [login, id, usertype, navigate]);

    const handleAddToCart = useCallback(
        async (p_id, price) => {
            try {
                const data = {
                    userId: id,
                    productId: p_id,
                    price,
                };

                const response = await AddToCart(data);

                console.log("API Response:", response);

                if (response && response.success) {
                    alert(`Item added to cart. Total Price: ${response.totalPrice}`);
                    navigate(`/getcartdata/${login}/${id}/${usertype}`);
                } else {
                    alert(`Error: ${response?.message || "Unknown error"}`);
                }
            } catch (error) {
                console.error("Exception in handleAddToCart:", error);
                alert("An unexpected error occurred while adding the item to the cart.");
            }
        },
        [id, login, usertype, navigate]
    );

    const handleBuyNow = (productId) => {
        navigate(`/checkout/${login}/${id}/${usertype}`);
    };

    const handleSingleView = useCallback(
        (p_id) => {
            navigate(`/singleView/${login}/${id}/${usertype}/${p_id}`);
        },
        [login, id, usertype, navigate]
    );

    return (
        <>
            <Nav />
            <div className="min-h-screen bg-gray-100 p-6">
                <div className="container mx-auto">
                    {loading && <p className="text-gray-600">Loading wishlist...</p>}
                    {error && <p className="text-red-600">{error}</p>}

                    {!loading && wishlistProducts.length === 0 && (
                        <p className="text-gray-600 flex flex-col items-center bg-white">
                            <img
                                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/mywishlist-empty_39f7a5.png"
                                alt="Empty Wishlist"
                                className="w-1/3"
                            />
                            <div className="text-xl font-semibold mt-4 pt-3">
                                Empty Wishlist
                            </div>
                            <div className="text-sm text-gray-600 pt-2 mb-4">
                                You have no items in your wishlist. Start adding!
                            </div>
                            <div className="bg-blue">
                                <button onClick={handleShopNow}>SHOP NOW</button>
                            </div>
                        </p>
                    )}

                    {!loading && wishlistProducts.length > 0 && (
                        <div className="grid gap-6">
                            {wishlistProducts.map((product) => (
                                <div
                                    key={product._id}
                                    className="relative flex items-center bg-white shadow-md rounded-lg overflow-hidden"
                                >
                                    {/* Delete Icon */}
                                    <button
                                        onClick={() => handleDelete(product._id)}
                                        className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 text-gray-600"
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            strokeWidth={2}
                                            stroke="currentColor"
                                            className="w-4 h-4"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                    </button>

                                    {/* Product Image */}
                                    <div className="w-1/3">
                                        <img
                                            src={`http://localhost:3000/${product.images[0]?.url}`}
                                            alt={product.images[0]?.alt || "Product Image"}
                                            className="w-full h-50 object-cover"
                                        />
                                    </div>

                                    {/* Product Details */}
                                    <div className="w-2/3 p-4">
                                        <h2
                                            className="text-xl font-semibold text-gray-800 cursor-pointer hover:text-blue-500"
                                            onClick={() => handleSingleView(product._id)}
                                        >
                                            {product.name}
                                        </h2>
                                        <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
                                        <p className="text-lg font-semibold text-gray-800 mt-4">
                                            Price: ₹{product.price}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-2">
                                            Stock: {product.stock}
                                        </p>

                                        {/* Add to Cart and Buy Now buttons */}
                                        <div className="d-flex gap-5 pt-4">
                                            <button
                                                onClick={() =>
                                                    handleAddToCart(product._id, product.price)
                                                }
                                                className="p-3"
                                                style={{
                                                    width: "224.16px",
                                                    height: "56px",
                                                    backgroundColor: "rgb(255,159,0)",
                                                    border: "none",
                                                }}
                                            >
                                                Add to cart
                                            </button>
                                            <button
                                                onClick={() => handleBuyNow(product._id)}
                                                className="p-3"
                                                style={{
                                                    width: "224.16px",
                                                    height: "56px",
                                                    backgroundColor: "rgb(251,100,27)",
                                                    border: "none",
                                                }}
                                            >
                                                Buy now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
