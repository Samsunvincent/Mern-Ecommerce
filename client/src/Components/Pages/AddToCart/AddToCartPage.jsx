import { useEffect, useState } from "react";
import AddToCart from "../../functionalities/addToCart"; // Import your AddToCart function
import { useParams } from "react-router-dom";

export default function AddToCartPage() {
    const [userId, setUserId] = useState('');
    const [productId, setProductId] = useState('');
    const [quantity, setQuantity] = useState(1); // Default quantity to 1
    const [price, setPrice] = useState(0);
    const [cartItems, setCartItems] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);

    const params = useParams();

    useEffect(() => {
        const { id, p_id, quantity, price } = params;

        setUserId(id);
        setProductId(p_id);
        setQuantity(quantity ? parseInt(quantity, 10) : 1); // Ensure quantity is a number
        setPrice(price ? parseFloat(price) : 0); // Ensure price is a number

        const data = {
            userId: id,
            productId: p_id,
            quantity: quantity ? parseInt(quantity, 10) : 1,
            price: price ? parseFloat(price) : 0
        };

        // Function to update the cart
        const updateCart = async () => {
            const result = await AddToCart(data);
            if (result) {
                if (result.cart && result.cart.items && result.cartItemsWithProducts) {
                    const items = result.cart.items;
                    const productsWithDetails = result.cartItemsWithProducts;
                    let total = 0;

                    const updatedCartItems = items.map((item, index) => {
                        const productData = productsWithDetails[index]?.product;
                        if (productData) {
                            const imageUrl = productData.images && productData.images[0] ? productData.images[0].url : '/path/to/placeholder.jpg';
                            total += productData.price * item.quantity;

                            return (
                                <div className="card p-4" data-product-id={item.productId} key={item.productId}>
                                    <div className="d-flex gap-5">
                                        <div>
                                            <img src={`http://localhost:3000/${imageUrl}`} alt={productData.name} style={{ width: 112, height: 112 }} />
                                        </div>
                                        <div>
                                            <div className="pt-3">{productData.name.slice(0, 60) + "..."}</div>
                                            <div className="pt-3">
                                                <strong>Seller Details:</strong><br />
                                                Name: {productData.sellerID.name}<br />
                                                Email: {productData.sellerID.email}
                                            </div>
                                            <div className="d-flex justify-content-between">
                                                <div className="pt-3">${(productData.price * item.quantity).toFixed(2)}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        }
                    });

                    setCartItems(updatedCartItems);
                    setTotalAmount(total);
                }
            }
        };

        // Refresh cart data after the page reloads
        const fetchCartData = async () => {
            const response = await fetch(`http://localhost:3000/api/cart/${id}`);  // Replace with your API endpoint to get the cart data
            const cartData = await response.json();
            if (cartData && cartData.items) {
                let total = 0;
                const updatedCartItems = cartData.items.map((item) => {
                    const productData = item.product; // Assuming you have product data in the item
                    if (productData) {
                        total += productData.price * item.quantity;
                        return (
                            <div className="card p-4" data-product-id={item.productId} key={item.productId}>
                                <div className="d-flex gap-5">
                                    <div>
                                        <img src={`http://localhost:3000/${productData.imageUrl}`} alt={productData.name} style={{ width: 112, height: 112 }} />
                                    </div>
                                    <div>
                                        <div className="pt-3">{productData.name}</div>
                                        <div className="pt-3">
                                            <strong>Seller Details:</strong><br />
                                            Name: {productData.sellerID.name}<br />
                                            Email: {productData.sellerID.email}
                                        </div>
                                        <div className="d-flex justify-content-between">
                                            <div className="pt-3">${(productData.price * item.quantity).toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                });
                setCartItems(updatedCartItems);
                setTotalAmount(total);
            }
        };

        // Fetch the current cart data on component mount
        fetchCartData();
        updateCart();
    }, [params]);

    return (
        <div>
            <div className="container pt-5">
                <div className="row">
                    <div className="col-2"></div>
                    <div className="col-6">
                        {cartItems} {/* Displaying the generated JSX cart items */}
                    </div>
                    <div className="col-4">
                        <div className="bg-white">
                            <div className="p-3">PRICE DETAILS</div>
                            <div>
                                <div className="d-flex justify-content-between p-3">
                                    <div><strong>Total Amount</strong></div>
                                    <div>${totalAmount.toFixed(2)}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
