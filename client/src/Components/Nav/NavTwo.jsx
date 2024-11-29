import { useState } from "react";

export default function NavTwo() {
  const [showOffcanvas, setShowOffcanvas] = useState(false);

  const toggleOffcanvas = () => {
    setShowOffcanvas(!showOffcanvas);
  };

  return (
    <>
      <div className="nav-two-container">
        {/* Menu Button and Search Box */}
        <div className="d-flex align-items-center gap-3">
          {/* Menu Button */}
          <button
            className="btn btn-primary"
            onClick={toggleOffcanvas}
          >
            Menu
          </button>

          {/* Search Box */}
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
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
          <button
            className="btn-close"
            onClick={toggleOffcanvas}
          >
            &times;
          </button>
        </div>
        <div className="offcanvas-body">
          <ul className="list-unstyled">
            <li>Electronics</li>
            <li>Fashion</li>
            <li>Home & Kitchen</li>
            <li>Sports</li>
            <li>Books</li>
          </ul>
          {/* Another Close Button at the Bottom */}
          <button
            className="btn btn-secondary w-100 mt-3"
            onClick={toggleOffcanvas}
          >
            Close
          </button>
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

        .offcanvas-body ul {
          padding: 0;
        }

        .offcanvas-body li {
          margin-bottom: 1rem;
        }

        ul {
          margin: 0;
          padding: 0;
          list-style-type: none;
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
