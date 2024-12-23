import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Nav from "../../Nav/navOne";
import NavTwo from "../../Nav/navTwo";
import getAllProducts from "../../functionalities/getAllProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import FooterComponent from "../../Footer/footerComponent";
import Wishlist from "../../functionalities/WishlistRoute";
import { toast } from "react-toastify";

const slides = [
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/398ef080b952d576.jpg?q=20", alt: "Slide 1" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1316eb53d6f52c71.jpg?q=20", alt: "Slide 2" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/b2cc5dc49ea38fa5.jpeg?q=20", alt: "Slide 3" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/cb01dc6be133fe44.jpg?q=20", alt: "Slide 4" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/f7b74e32c435adb6.jpg?q=20", alt: "Slide 5" },
];

const Seller = () => {
  const { id, usertype, login } = useParams();
  const [allProducts, setAllProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await getAllProducts(id, usertype);

        if (Array.isArray(data)) {
          const filtered = usertype === "seller" ? data.filter((product) => product.sellerID !== id) : data;
          setAllProducts(filtered);
        } else {
          console.error("Fetched data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const storedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlist(storedWishlist);

    fetchProducts();
  }, [id, usertype]);

  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleWishlistToggle = async (productId, event) => {
    event.stopPropagation();

    if (!login) {
      toast.error("Please log in to continue!");
      return;
    }

    try {
      await Wishlist(id, productId);
      const updatedWishlist = wishlist.includes(productId)
        ? wishlist.filter((id) => id !== productId)
        : [...wishlist, productId];

      setWishlist(updatedWishlist);
      toast.success(wishlist.includes(productId) ? "Removed from wishlist!" : "Added to wishlist!");
    } catch (error) {
      console.error("Error updating wishlist:", error);
      toast.error("Something went wrong!");
    }
  };

  const ProductCard = ({ product }) => {
    const imageUrl = product.images?.[0]?.url?.replaceAll("\\", "/") || "default-image-path.jpg";
    const isInWishlist = wishlist.includes(product._id);

    return (
      <div
        className="card cursor-pointer"
        onClick={() => navigate(`/singleView/${login}/${id}/${usertype}/${product._id}`)}
      >
        <button
          onClick={(e) => handleWishlistToggle(product._id, e)}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "24px",
            color: isInWishlist ? "red" : "gray",
          }}
        >
          {isInWishlist ? "❤️" : "🤍"}
        </button>
        <img
          src={`http://localhost:3000/${imageUrl}`}
          className="card-img-top w-[309.15px] h-[309.15px]"
          alt={product.images?.[0]?.alt || product.name}
        />
        <div className="card-body">
          <h5 className="card-title hover:text-sky-600">
            {product.name.length > 100 ? `${product.name.slice(0, 100)}...` : product.name}
          </h5>
          <p className="card-text text-danger">${product.price}</p>
        </div>
      </div>
    );
  };

  const filterProducts = (condition) => {
    return allProducts.filter(condition);
  };

  const renderProducts = (products) =>
    products.length > 0 ? products.map((product) => <ProductCard key={product._id} product={product} />) : <p>No products found.</p>;

  return (
    <>
      <Nav />
      <NavTwo />

      <div className="container-fluid">
        <Swiper modules={[Autoplay]} spaceBetween={10} slidesPerView={1} autoplay={{ delay: 3000 }} loop>
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <img src={slide.imgSrc} alt={slide.alt} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="text-center p-5 fs-2 fw-bolder">FEATURED</div>
        <div className="product-card container">
          {isLoading ? <div>Loading...</div> : renderProducts(allProducts)}
        </div>

        <div className="text-center p-5 fs-2 fw-bolder">BUDGET PRODUCTS</div>
        <div className="product-card container">
          {isLoading ? <div>Loading...</div> : renderProducts(filterProducts((product) => product.price <= 1000))}
        </div>

        <div className="text-center p-5 fs-2 fw-bolder">NEW ARRIVALS</div>
        <div className="product-card container">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            renderProducts(
              allProducts
                .slice(-5) // Select the last 5 products
                .reverse() // Reverse to show the most recent first
            )
          )}
        </div>

      </div>

      <FooterComponent />
    </>
  );
};

export default Seller;
