import React, { useState, useEffect, useCallback } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Nav from "../../Nav/navOne";
import NavTwo from "../../Nav/navTwo";
import getAllProducts from "../../functionalities/getAllProducts";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";
import FooterComponent from "../../Footer/footerComponent";

const slides = [
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/398ef080b952d576.jpg?q=20", alt: "Slide 1" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/1316eb53d6f52c71.jpg?q=20", alt: "Slide 2" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/b2cc5dc49ea38fa5.jpeg?q=20", alt: "Slide 3" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/cb01dc6be133fe44.jpg?q=20", alt: "Slide 4" },
  { imgSrc: "https://rukminim2.flixcart.com/fk-p-flap/1620/270/image/f7b74e32c435adb6.jpg?q=20", alt: "Slide 5" },
];

export default function IndexComponent() {
  const { id, usertype } = useParams(); // Retrieve route parameters
  const [allProducts, setAllProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // State for filtered products
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()
  const params = useParams()

  // Fetch all products on component mount
  useEffect(() => {
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
  }, [id, usertype]); // Dependency array ensures it re-runs when params change

  // Render Product Card Component
  const ProductCard = ({ product }) => {
    const imageUrl = product.images?.[0]?.url
      ? product.images[0].url.replaceAll("\\", "/")
      : "default-image-path.jpg";

    return (
      <div className="card" key={product._id}>
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

  // Get the last N products (New Arrivals) but reverse the order
  const getNewArrivals = (products, n) => {
    return products.slice(-n).reverse(); // Take the last N products and reverse them
  };
  const handleSingleView = useCallback((p_id) => {

    let token_key = params.login;
    let id = params.id;
    let usertype = params.usertype;
    console.log("p_if",p_id)



    navigate(`/singleView/${token_key}/${id}/${usertype}/${p_id}`)

  })

  return (
    <>
      <Nav />
      {/* Pass filteredProducts and its updater to NavTwo */}
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
            <div
              id="productsContainer"
              className="product-card container"
            >
              {isLoading ? (
                <div>Loading...</div>
              ) : filteredProducts.length > 0 ? ( // Display filtered products if available
                filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSingleView(product._id)} // Pass the ID as a parameter
                  >
                    <ProductCard product={product} />
                  </div>
                ))
              ) : (
                allProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => handleSingleView(product._id)} // Pass the ID as a parameter
                  >
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
                .filter((product) => product.price < 1000) // Adjust price for budget products
                .map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
            </div>

            {/* New Arrivals Section */}
            <div className="text-center p-5 fs-2 fw-bolder" id="newarrivals">
              NEW ARRIVALS
            </div>
            <div className="product-card container">
              {getNewArrivals(allProducts, 5).map((product) => ( // Show last 5 products, reverse order
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
