import { useCallback, useEffect, useState } from "react";
import SingleView from "../../functionalities/SingleView";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../Nav/navOne"; // Only display this for non-admin users
import NavTwo from "../../Nav/navTwo";
import AddToCart from "../../functionalities/addToCart";
import { toast } from "react-toastify";


export default function SingleProductView() {
    const [singleData, setSingleData] = useState(null); // Store fetched product data
    const [enlargedImage, setEnlargedImage] = useState(""); // Store currently enlarged image
    const { id, login, usertype } = useParams(); // Get params from the URL
    const navigate = useNavigate(); // Hook for navigation
    const params = useParams();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { p_id } = params; // Access product ID from params
                const fetchedSingleData = await SingleView(p_id); // Fetch data using p_id
                console.log("Fetched single data:", fetchedSingleData);
                setSingleData(fetchedSingleData);

                // Set the default enlarged image
                if (fetchedSingleData?.product?.images?.length > 0) {
                    setEnlargedImage(fetchedSingleData.product.images[0].url);
                }
            } catch (error) {
                console.error("Error fetching single data:", error);
            }
        };

        fetchData();
    }, [params.p_id]);

    const handleEnlarge = (imageUrl) => {
        setEnlargedImage(imageUrl); // Update the enlarged image
    };

    const handleAddToCart = useCallback(async (p_id, price) => {
        try {
            const { id, login, usertype } = params;
    
            const data = {
                userId: id,
                productId: p_id,
                price,
            };
    
            const response = await AddToCart(data);
    
            console.log("API Response:", response); // Log the entire response
    
            // Check if the response has the success field
            if (response && response.success) {
                console.log("Item successfully added to cart:", response);
                toast.success(`Item added to cart. Total Price: ₹${response.totalPrice}`);
                navigate(`/getcartdata/${login}/${id}/${usertype}`);
            } else {
                console.error("Error adding item to cart:", response?.message || "Unknown error");
                toast.error(response?.message || "An error occurred while adding the item to the cart.");
            }
            
            
        } catch (error) {
            console.error("Exception in handleAddToCart:", error);
            // Check if login is undefined or invalid
            toast.error(login === "undefined" || !login ? "Please login to continue" : "An unexpected error occurred.");
            navigate(`/Login`);
        }
    }, [params, navigate]);
    

    const handleBuyNow = useCallback((p_id, price) => {

        if(login === "undefined"){
            toast.error("Please login to continue");
            navigate(`/Login`);
        }else{

            navigate(`/buynow/${login}/${id}/${usertype}/${p_id}/${price}`);
        }
    });

    return (
        <div>
            {/* Conditionally render Nav based on usertype */}
            {usertype !== "Admin" && <Nav />}

            <div className="container bg-white">
                <div className="row">
                    {/* Image Thumbnails */}
                    <div className="col-1">
                        <div className="row p-2">
                            {singleData?.product?.images?.map((image, index) => (
                                <div
                                    key={index}
                                    className="image-box"
                                    style={{ marginBottom: "16px", cursor: "pointer" }}
                                    onClick={() => handleEnlarge(image.url)}
                                >
                                    <img
                                        src={`http://localhost:3000/${image.url.replace(/\\/g, '/')}`} // Fix backslash to forward slash and use server base path
                                        alt={image.alt || `Image ${index + 1}`}
                                        style={{
                                            width: "100%",
                                            height: "auto",
                                            border: "1px solid #ddd",
                                            borderRadius: "8px",
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Enlarged Image */}
                    <div className="col-5">
                        {enlargedImage && (
                            <div style={{ width: "100%", height: "auto" }}>
                                <img
                                    src={`http://localhost:3000/${enlargedImage.replace(/\\/g, '/')}`} // Ensure correct relative path and base URL
                                    alt="Enlarged View"
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        border: "1px solid #ddd",
                                        borderRadius: "8px",
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Product Details */}
                    <div className="col-6">
                        {singleData ? (
                            <div className="pt-5">
                                <div className="productname">{singleData.product.name}</div>
                                <div className="productprice pt-2">
                                    ₹{singleData.product.price.toLocaleString()}
                                </div>
                                <div className="pt-3">
                                    <div className="productbrand">Brand</div>
                                    <div>{singleData.product.brand}</div>
                                </div>
                                <div className="pt-3">
                                    <div className="productcategory">Category</div>
                                    <div>{singleData.product.category.category}</div>
                                </div>
                                <div className="pt-4">
                                    <div className="productabout">About this product</div>
                                    <div>{singleData.product.description}</div>
                                </div>
                                <div className="pt-4">
                                    <div className="productseller">Seller Details</div>
                                    {singleData.seller ? (
                                        <>
                                            <div>Name: {singleData.seller.name}</div>
                                            <div>Email: {singleData.seller.email}</div>
                                        </>
                                    ) : (
                                        <div>Seller information is unavailable</div>
                                    )}
                                </div>

                               {/* Conditionally Render Add to Cart and Buy Now buttons */}
{usertype !== "Admin" && (
    <div className="d-flex gap-5 pt-4">
        <div>
            <button
                onClick={() =>
                    handleAddToCart(
                        singleData.product._id,
                        singleData.product.price
                    )
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
        </div>
        <div>
            <button
                className="p-3"
                style={{
                    width: "224.16px",
                    height: "56px",
                    backgroundColor: "rgb(251,100,27)",
                    border: "none",
                }}
                onClick={() =>
                    handleBuyNow(
                        singleData.product._id,
                        singleData.product.price
                    )
                }
            >
                Buy now
            </button>
        </div>
    </div>
)}

                            </div>
                        ) : (
                            <div>Loading product details...</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
