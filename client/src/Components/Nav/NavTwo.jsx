import { useEffect, useState, useMemo } from "react";
import getCategory from "../functionalities/getCategory";
import filterCategory from "../functionalities/filterCategory";
import getAllProducts from "../functionalities/getAllProducts";

// Custom hook for fetching categories
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategory();
        if (Array.isArray(data)) {
          setCategories(data);
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};

export default function NavTwo({ setFilteredProducts }) {
  const [showOffcanvas, setShowOffcanvas] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filterError, setFilterError] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // State for search query
  const [allProducts, setAllProducts] = useState([]); // State for all products
  const { categories, isLoading, error } = useCategories();

  // Fetch all products on mount
  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const data = await getAllProducts();
        if (Array.isArray(data)) {
          setAllProducts(data);
          setFilteredProducts(data); // Initialize with all products
        } else {
          throw new Error("Failed to fetch products.");
        }
      } catch (err) {
        console.error(err.message);
        setFilteredProducts([]); // Reset filtered products on error
      }
    };

    fetchAllProducts();
  }, [setFilteredProducts]);

  // Toggle offcanvas state
  const toggleOffcanvas = useMemo(
    () => () => setShowOffcanvas((prev) => !prev),
    []
  );

  // Handle search input
  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);

    // Filter products based on search query
    if (query) {
      const filtered = allProducts.filter((product) =>
        product.name.toLowerCase().includes(query)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(allProducts); // Show all products if query is empty
    }
  };

  // Handle category selection
  const handleCategoryChange = async (e) => {
    const value = e.target.value;
    setSelectedCategory(value); // Update the selected category

    if (value) {
      try {
        const data = await filterCategory(value);
        if (data.success !== false) {
          setFilteredProducts(data);
          setFilterError(null);
        } else {
          setFilterError(data.message || "Failed to fetch filtered products.");
          setFilteredProducts([]);
        }
      } catch (err) {
        setFilterError("An error occurred while filtering products.");
        setFilteredProducts([]);
      }
    } else {
      setFilteredProducts(allProducts); // Reset to all products if no category is selected
      setFilterError(null);
    }
  };

  return (
    <>
      <div className="nav-two-container">
        {/* Menu Button and Search Box */}
        <div className="d-flex align-items-center gap-3">
          {/* Menu Button */}
          <button className="btn btn-primary" onClick={toggleOffcanvas}>
            <i className="fa fa-bars" aria-hidden="true"></i>
          </button>

          {/* Search Box */}
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        {/* Navigation Links */}
        <div className="nav-links-container">
          <ul className="list-unstyled d-flex gap-4 justify-content-center pt-3 text-color">
            <li>
              <a href="#featured">FEATURED</a>
            </li>
            <li>
              <a href="#budget">BUDGET PRODUCTS</a>
            </li>
            <li>
              <a href="#newarrivals">NEW ARRIVALS</a>
            </li>
            <li>TRENDING CATEGORIES</li>
          </ul>
        </div>
      </div>

      {/* Offcanvas */}
      <div className={`offcanvas ${showOffcanvas ? "show" : ""}`}>
        <div className="offcanvas-header">
          <h5>Categories</h5>
          {/* Close Button */}
          <button className="btn-close" onClick={toggleOffcanvas}>
            &times;
          </button>
        </div>
        <div className="offcanvas-body">
          {isLoading && <p>Loading categories...</p>}
          {error && <p className="text-danger">Error: {error}</p>}
          {!isLoading && !error && (
            <select
              className="form-select"
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.category}>
                  {cat.category}
                </option>
              ))}
            </select>
          )}

          {/* Display Filter Error */}
          {filterError && <p className="text-danger">Error: {filterError}</p>}
        </div>
      </div>

      {/* Styling */}
      <style jsx>{`
        .nav-two-container {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 16px;
        }

        .nav-links-container {
          flex: 1;
          text-align: center;
        }

        .offcanvas {
          position: fixed;
          top: 0;
          left: 0;
          width: 300px;
          height: 100%;
          background: white;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          z-index: 1050;
          transform: translateX(-100%);
          transition: transform 0.3s ease-in-out;
        }

        .offcanvas.show {
          transform: translateX(0);
        }

        .offcanvas-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem;
          border-bottom: 1px solid #ddd;
        }

        .offcanvas-body {
          padding: 1rem;
        }

        .form-select {
          width: 100%;
          padding: 0.5rem;
          margin-top: 1rem;
          border-radius: 4px;
        }

        .btn-close {
          border: none;
          background: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
      `}</style>
    </>
  );
}
