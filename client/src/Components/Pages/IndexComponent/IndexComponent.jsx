import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../Nav/navOne";
import NavTwo from "../../Nav/navTwo";
import getAllProducts from "../../functionalities/getAllProducts";
import Wishlist from "../../functionalities/WishlistRoute"; // Import your Wishlist function
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import FooterComponent from "../../Footer/footerComponent";
import { toast } from "react-toastify"; // Import Toastify

const slides = [
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/398ef080b952d576.jpg?q=20", alt: "Slide 1" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1316eb53d6f52c71.jpg?q=20", alt: "Slide 2" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/b2cc5dc49ea38fa5.jpeg?q=20", alt: "Slide 3" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/cb01dc6be133fe44.jpg?q=20", alt: "Slide 4" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/f7b74e32c435adb6.jpg?q=20", alt: "Slide 5" },
];

export default function IndexComponent() {
  const { id, usertype, login } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]); // Track wishlist state
  const navigate = useNavigate();

  // Load the wishlist from localStorage only once when the component mounts
  useEffect(() => {
    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);

    const fetchProducts = async () => {
      try {
        const data = await getAllProducts(id, usertype);
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
  }, [id, usertype]);

  // Save the wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const ProductCard = ({ product }) => {
    const imageUrl = product.images?.[0]?.url
      ? product.images[0].url.replaceAll("\\", "/")
      : "default-image-path.jpg";

    const isInWishlist = wishlist.includes(product._id);

    const handleWishlistToggle = async (productId, event) => {
      event.stopPropagation(); // Prevent the click event from propagating to the parent div

      // Check if the user is logged in (i.e., the 'login' parameter should be present)
      if (!login) {
        toast.error("Please log in to continue!"); // Show a Toastify error message
        return; // Do nothing if not logged in
      }

      try {
        // Make the API call to add/remove from wishlist
        await Wishlist(id, productId); // Call your API function

        // Toggle the wishlist state in UI
        if (isInWishlist) {
          // If product is in wishlist, remove it
          const updatedWishlist = wishlist.filter((id) => id !== productId);
          setWishlist(updatedWishlist); // Update UI
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage
        } else {
          // If product is not in wishlist, add it
          const updatedWishlist = [...wishlist, productId];
          setWishlist(updatedWishlist); // Update UI
          localStorage.setItem("wishlist", JSON.stringify(updatedWishlist)); // Update localStorage
        }
      } catch (error) {
        console.error("Error adding/removing product from wishlist:", error);
      }
    };

    return (
      <div className="card" key={product._id} onClick={() => handleSingleView(product._id)}>
        <button
          onClick={(e) => handleWishlistToggle(product._id, e)} // Pass the event to handleWishlistToggle
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: isInWishlist ? "red" : "gray", // Heart color based on wishlist status
          }}
        >
          {isInWishlist ? "❤️" : "🤍"} {/* Change heart color */}
        </button>

        <img
          src={`http://localhost:3000/${imageUrl}`}
          className="card-img-top w-[309.15px] h-[309.15px]"
          alt={product.images?.[0]?.alt || product.name}
        />
        <div className="card-body">
          <h5 className="card-title hover:text-sky-600">
            {product.name.length > 40 ? product.name.slice(0, 40) + "..." : product.name}
          </h5>
          <p className="card-text" style={{ color: "red" }}>${product.price}</p>
        </div>
      </div>
    );
  };

  const getNewArrivals = (products, n) => {
    return products.slice(-n).reverse(); // Take the last N products and reverse them
  };

  const handleSingleView = useCallback((p_id) => {
    navigate(`/singleView/${login}/${id}/${usertype}/${p_id}`);
  });

  return (
    <>
      <Nav />
      <NavTwo setFilteredProducts={setFilteredProducts} />

      <div className="container-fluid">
        <div className="row">
          {/* Main Content - Full Width */}
          <div className="col-12" id="mainContent">
            <div className="swiper-container">
              <Swiper
                modules={[Autoplay]}
                spaceBetween={10}
                slidesPerView={1}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false,
                }}
                loop={true}
              >
                {slides.map((slide, index) => (
                  <SwiperSlide key={index}>
                    <img src={slide.imgSrc} alt={slide.alt} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Featured Section */}
            <div className="text-center p-5 fs-2 fw-bolder" id="featured">
              FEATURED
            </div>
            <div id="productsContainer" className="product-card container">
              {isLoading ? (
                <div>Loading...</div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <div key={product._id} onClick={() => handleSingleView(product._id)}>
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                allProducts.map((product) => (
                  <div key={product._id} onClick={() => handleSingleView(product._id)}>
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>

            {/* Budget Products Section */}
            <div className="text-center p-5 fs-2 fw-bolder" id="budget">
              BUDGET PRODUCTS
            </div>
            <div className="product-card container">
              {allProducts
                .filter((product) => product.price < 1000)
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* New Arrivals Section */}
            <div className="text-center p-5 fs-2 fw-bolder" id="newarrivals">
              NEW ARRIVALS
            </div>
            <div className="product-card container">
              {getNewArrivals(allProducts, 5).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
