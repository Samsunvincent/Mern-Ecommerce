import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../../Nav/navOne";
import NavTwo from "../../Nav/navTwo";
import getAllProducts from "../../functionalities/getAllProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";  // Correct import for Autoplay

const slides = [
    { imgSrc: 'https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/398ef080b952d576.jpg?q=20', alt: 'Slide 1' },
    { imgSrc: 'https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1316eb53d6f52c71.jpg?q=20', alt: 'Slide 2' },
    { imgSrc: 'https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/b2cc5dc49ea38fa5.jpeg?q=20', alt: 'Slide 3' },
    { imgSrc: 'https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/cb01dc6be133fe44.jpg?q=20', alt: 'Slide 4' },
    { imgSrc: 'https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/f7b74e32c435adb6.jpg?q=20', alt: 'Slide 5' },
];

export default function IndexComponent() {
    const { login } = useParams();
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch all products on component mount
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await getAllProducts();
                if (Array.isArray(data)) {
                    setAllProducts(data);
                } else {
                    console.error("Fetched data is not an array:", data);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching products:", error);
                setIsLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // Get the last 5 products, and reverse to display the most recent first
    const newArrivals = allProducts.slice(-5).reverse(); // Get last 5 products and reverse the array

    // Get the 5 products with the lowest price
    const budgetProducts = allProducts
        .sort((a, b) => a.price - b.price) // Sort products by price in ascending order
        .slice(0, 5); // Get the 5 cheapest products

    // Render Product Card Component
    const ProductCard = ({ product }) => {
        const imageUrl = product.images?.[0]?.url
            ? product.images[0].url.replaceAll("\\", "/") // Replace backslashes with forward slashes
            : "default-image-path.jpg"; // Use a default image if no image is available

        return (
            <div className="card" key={product._id}>
                <img 
                    src={`http://localhost:3000/${imageUrl}`} // Ensure the path is relative to your server
                    className="card-img-top w-[309.15px] h-[309.15px]"
                    alt={product.images?.[0]?.alt || product.name}
                />
                <div className="card-body">
                <h5 className="card-title hover:text-sky-600">
  {product.name.length > 100 ? product.name.slice(0, 100) + "..." : product.name}
</h5>
                    <p className="card-text">${product.price}</p>
                </div>
            </div>
        );
    };

    return (
        <>
            <Nav />
            <NavTwo />

            <div className="container-fluid">
                <div className="row">
                    {/* Main Content - Full Width */}
                    <div className="col-12" id="mainContent">
                        <div className="swiper-container">
                            <Swiper
                                modules={[Autoplay]} // Include the Autoplay module
                                spaceBetween={10} // Space between slides
                                slidesPerView={1} // How many slides are visible at once
                                autoplay={{
                                    delay: 3000, // Delay in ms between slide transitions (3 seconds)
                                    disableOnInteraction: false, // Allows autoplay to continue after manual interaction
                                }}
                                loop={true} // Loop through the slides
                            >
                                {slides.map((slide, index) => (
                                    <SwiperSlide key={index}>
                                        <img src={slide.imgSrc} alt={slide.alt} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>

                        <div className="text-center p-5 fs-2 fw-bolder" id="featured">
                            FEATURED
                        </div>
                        <div id="productsContainer" className="product-card container">
                            {isLoading ? (
                                <div>Loading...</div>
                            ) : (
                                allProducts.map((product) => <ProductCard key={product._id} product={product} />)
                            )}
                        </div>

                        <div id="budget" className="text-center p-5 fs-2 fw-bolder">
                            BUDGET PRODUCTS
                        </div>
                        <div id="budget-container" className="product-card container">
                            {isLoading ? (
                                <div>Loading budget products...</div>
                            ) : (
                                budgetProducts.map((product) => <ProductCard key={product._id} product={product} />)
                            )}
                        </div>

                        <div className="text-center p-5 fs-2 fw-bolder" id="newarrivals">
                            NEW ARRIVALS
                        </div>
                        <div id="brand-new-container" className="product-card container">
                            {isLoading ? (
                                <div>Loading new arrivals...</div>
                            ) : (
                                newArrivals.map((product) => <ProductCard key={product._id} product={product} />)
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
