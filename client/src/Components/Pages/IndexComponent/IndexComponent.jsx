import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Nav from "../../Nav/navOne";
import NavTwo from "../../Nav/navTwo";
import getAllProducts from "../../functionalities/getAllProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import FooterComponent from "../../Footer/footerComponent";
import { toast } from "react-toastify"; // Import Toastify
import Wishlist from "../../functionalities/WishlistRoute";

const slides = [
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/398ef080b952d576.jpg?q=20", alt: "Slide 1" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1316eb53d6f52c71.jpg?q=20", alt: "Slide 2" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/b2cc5dc49ea38fa5.jpeg?q=20", alt: "Slide 3" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/cb01dc6be133fe44.jpg?q=20", alt: "Slide 4" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/f7b74e32c435adb6.jpg?q=20", alt: "Slide 5" },
];

const ProductCard = ({ product, allProducts, setAllProducts }) => {
  const { login, id, usertype } = useParams();
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(product.isWishlisted);  // Initialize from product data

  const handleHeartClick = useCallback(
    async (e, p_id) => {
      e.stopPropagation();

      if (!id || !login) {
        toast("Please login to continue", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        return;
      }

      console.log("Current wishlist status:", isWishlisted); // Log current value of isWishlisted

      try {
        // Perform the wishlist operation
        const response = await Wishlist(id, p_id);

        // Log the full response to inspect its structure
        console.log("API Response:", response);

        // Check if the response contains the wishlist data
        if (response.data && Array.isArray(response.data.wishlist)) {
          // Update the product list based on the response
          const updatedWishlist = response.data.wishlist;
          setAllProducts((prevProducts) =>
            prevProducts.map((product) => {
              // Check if the product ID is in the wishlist
              const isWishlisted = updatedWishlist.some(
                (item) => item.productId === product._id
              );
              return {
                ...product,
                isWishlisted: isWishlisted,
              };
            })
          );
        } else {
          console.error("Wishlist data is missing in the response:", response.data);
          toast("Failed to update wishlist. Please try again.", {
            position: "bottom-center",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }

        const message = response.data.message || "Operation was successful";
        toast(message, {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      } catch (error) {
        console.error("Error updating wishlist:", error);
        toast("Something went wrong. Please try again.", {
          position: "bottom-center",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }
    },
    [id, login, isWishlisted, setAllProducts]
  );

  const handleSingleView = (p_id) => {
    navigate(`/singleView/${login}/${id}/${usertype}/${p_id}`);
  };

  return (
    <div
      className="card"
      key={product._id}
      onClick={() => handleSingleView(product._id)}
    >
      {/* Heart Icon */}
      <img
        src={
          isWishlisted
            ? "https://img.icons8.com/ios-filled/50/000000/like.png"  // Filled heart when in wishlist
            : "https://img.icons8.com/ios/50/000000/like.png"        // Outline heart when not in wishlist
        }
        alt="Heart Icon"
        onClick={(e) => handleHeartClick(e, product._id)}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "24px",
          height: "24px",
          pointerEvents: "auto",
          cursor: "pointer",
        }}
      />
      {/* Product Image */}
      <img
        src={`http://localhost:3000/${product.images?.[0]?.url}`}
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

export default function IndexComponent() {
  const { id, usertype, login } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const products = await getAllProducts(id, usertype);
        setAllProducts(products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [id, usertype]);

  const getNewArrivals = (products, n) => {
    return products.slice(-n).reverse();
  };

  return (
    <>
      <Nav />
      <NavTwo setFilteredProducts={setFilteredProducts} />

      <div className="container-fluid">
        <div className="row">
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

            <div className="text-center p-5 fs-2 fw-bolder" id="featured">
              FEATURED
            </div>
            <div id="productsContainer" className="product-card container">
              {isLoading ? (
                <div>Loading...</div>
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} allProducts={allProducts} setAllProducts={setAllProducts} />
                ))
              ) : (
                allProducts.map((product) => (
                  <ProductCard key={product._id} product={product} allProducts={allProducts} setAllProducts={setAllProducts} />
                ))
              )}
            </div>

            <div className="text-center p-5 fs-2 fw-bolder" id="budget">
              BUDGET PRODUCTS
            </div>
            <div className="product-card container">
              {allProducts
                .filter((product) => product.price < 1000)
                .map((product) => (
                  <ProductCard key={product._id} product={product} allProducts={allProducts} setAllProducts={setAllProducts} />
                ))}
            </div>

            <div className="text-center p-5 fs-2 fw-bolder" id="newarrivals">
              NEW ARRIVALS
            </div>
            <div className="product-card container">
              {getNewArrivals(allProducts, 5).map((product) => (
                <ProductCard key={product._id} product={product} allProducts={allProducts} setAllProducts={setAllProducts} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <FooterComponent />
    </>
  );
}
