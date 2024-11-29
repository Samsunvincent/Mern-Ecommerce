import { Link, useNavigate, useParams } from "react-router-dom";
import { useCallback } from "react";
import Logout from "../functionalities/Logout";

function classNames(...classes) {
    return classes.filter(Boolean).join(' ');
}

export default function Nav() {
    const navigate = useNavigate();
    const { login } = useParams(); // Destructure login from params

    const handleLogout = useCallback(() => {
        Logout(login, navigate); // Pass login and navigate to the Logout function
    }, [login, navigate]); // Dependencies

    return (
        <div className="d-flex align-items-center f-nav-p justify-content-between px-4 py-2">
            {/* Left Section */}
            <div className="d-flex">
                <img
                    src="https://img.icons8.com/?size=100&id=24934&format=png&color=000000"
                    alt="Logo"
                    className="jordan-sizing"
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
                    <a
                        href="#"
                        onClick={() => console.log("Filter clicked")}
                        data-bs-toggle="offcanvas"
                        data-bs-target="#filterOffcanvas"
                        aria-controls="filterOffcanvas"
                    >
                        Filter
                    </a>
                </li>
                <li>
                    <i className="fa fa-shopping-cart" style={{ fontSize: 24 }} onClick={() => console.log("Go to Cart clicked")} />
                </li>

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
                            <li onClick={() => console.log("Settings clicked")}>
                                <a className="dropdown-item" href="#">
                                    Manage profile
                                </a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Orders
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
    );
}
