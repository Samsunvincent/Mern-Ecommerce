import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect } from "react";
import Logout from "../functionalities/Logout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Nav() {
    const navigate = useNavigate();
    const { login, usertype, id } = useParams(); // Destructure login and usertype from params

    useEffect(() => {
        console.log("userType", usertype);
    }, [usertype]); // Dependency array to run effect when usertype changes

    const handleLogout = useCallback(() => {
        Logout(login, navigate); // Pass login and navigate to the Logout function
    }, [login, navigate]); // Dependencies

    const handleAddProducts = useCallback(() => {
        // Navigate to Add Products page
        if (login) {
            navigate(`/addProducts/${login}/${id}/${usertype}`);
        } else {
            console.log("User is not logged in.");
        }
    }, [navigate, usertype, id, login]); // Add necessary dependencies

    const handleProfile = useCallback(() => {
        // Navigate to Seller Dashboard
        if (login && usertype === "Seller") {
            navigate(`/sellerDashboard/${login}/${id}/${usertype}`);
        } else if (login && usertype === "Buyer") {
            navigate(`/buyerDashboard/${login}/${id}/${usertype}`);
        }
    }, [navigate, usertype, id, login]);

    const handleCartClick = useCallback(() => {
        if (login) {
            navigate(`/getcartdata/${login}/${id}/${usertype}`);
        } else {
            toast.error("Please log in to access the cart."); // Replaced alert with toast
        }
    }, [navigate, usertype, id, login]);

    const handleWishList = useCallback(() => {
        navigate(`/wishlist/${login}/${id}/${usertype}`);
    });

    const handleOrder = useCallback(() => {
        navigate(`/orderdata/${login}/${id}/${usertype}`);
    });

    const handleHome = useCallback(() => {
        navigate('/');
    });

    return (
        <>
            <div className="d-flex align-items-center f-nav-p justify-content-between px-4 py-2">
                {/* Left Section */}
                <div className="d-flex">
                    <img
                        src="https://img.icons8.com/?size=100&id=24934&format=png&color=000000"
                        alt="Logo"
                        className="jordan-sizing"
                        onClick={handleHome}
                    />
                    <ul className="list-decoration">
                        <li id="deliveryto">Delivery to</li>
                    </ul>
                </div>

                {/* Right Section */}
                <ul className="d-flex align-items-center gap-5 list-decoration px-4">
                    <li>
                        <a href="#">Find a Store</a>
                    </li>
                    <li>
                        <i
                            className="fa fa-shopping-cart"
                            style={{ fontSize: 24 }}
                            onClick={handleCartClick} // Call cart handler
                        />
                    </li>

                    {/* Add Products link for Seller */}
                    {login && usertype === "Seller" && (
                        <li>
                            <button onClick={handleAddProducts}>Add Products</button>
                        </li>
                    )}

                    {/* Conditional rendering for Signin and Account */}
                    {!login ? (
                        <li id="signin">
                            <Link to="/Signin">Signin</Link>
                        </li>
                    ) : (
                        <div className="dropdown">
                            <button
                                className="remove-button-style"
                                id="account"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <i className="fa fa-user" aria-hidden="true" id="profile"></i>
                            </button>
                            <ul className="dropdown-menu">
                                <li onClick={handleProfile}>
                                    <a className="dropdown-item" href="#">
                                        Manage profile
                                    </a>
                                </li>
                                <li onClick={handleOrder}>
                                    <a className="dropdown-item" href="#">
                                        Orders
                                    </a>
                                </li>
                                <li onClick={handleWishList}>
                                    <a className="dropdown-item" href="#">
                                        Wishlist
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li onClick={handleLogout}>
                                    <a className="dropdown-item" href="#">
                                        Logout
                                    </a>
                                </li>
                            </ul>
                        </div>
                    )}
                </ul>
            </div>
        </>
    );
}
