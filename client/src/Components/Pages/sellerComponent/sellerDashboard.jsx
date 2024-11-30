export default function sellerDashboard() {
    return (
        <>
            <div className="d-flex align-items-center f-nav-p justify-content-between px-4 py-2">
                <div className="d-flex">
                    <div>
                        <img
                            src="https://img.icons8.com/?size=100&id=24934&format=png&color=000000"
                            alt=""
                            className="jordan-sizing"
                        />
                    </div>
                    <div>
                        <ul className="list-decoration">
                            <li id="deliveryto">Delivery to</li>
                        </ul>
                    </div>
                </div>
                <ul className="d-flex align-items-center gap-4 list-decoration">
                    <li>
                        <a href="#" className="text-decoration-none text-dark">
                            Find a Store
                        </a>
                    </li>{" "}
                    |
                    <li onclick="getfiltercategory()">
                        <a
                            href="#"
                            data-bs-toggle="offcanvas"
                            className="text-decoration-none text-dark"
                            data-bs-target="#filterOffcanvas"
                            aria-controls="filterOffcanvas"
                        >
                            Filter
                        </a>
                    </li>{" "}
                    |
                    <li onclick="gotoCart()">
                        <i className="fa fa-shopping-cart" style={{ fontSize: 24 }} />
                    </li>{" "}
                    |
                    <div className="dropdown">
                        <button
                            className="remove-button-style"
                            id="account"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            <i className="fa fa-user-circle-o" style={{ fontSize: 24 }} />
                        </button>
                        <ul className="dropdown-menu">
                            <li onclick="buyerDashboard()">
                                <a className="dropdown-item">Manage profile</a>
                            </li>
                            <li>
                                <a className="dropdown-item" href="#">
                                    Orders
                                </a>
                            </li>
                            <li onclick="gotosettings()">
                                <a className="dropdown-item" href="#">
                                    Settings
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li onclick="logOut()">
                                <a className="dropdown-item" href="#">
                                    Logout
                                </a>
                            </li>
                        </ul>
                    </div>
                </ul>
            </div>
            {/*  */}
            <div className="settings-sizing d-flex container pt-3">
                {/* Sidebar Content */}
                <div className="sidebar ">
                    <div className="settings-profile-name d-flex">
                        <span>
                            <img
                                src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg"
                                className="p-3"
                                alt=""
                            />
                        </span>
                        <div className="pt-3">
                            Hello
                            <div id="settings-name-container" className="fw-bold" />
                        </div>
                    </div>
                    <div className="pt-3">
                        <div className="pt-3 settings-side-nav">
                            <div
                                style={{ borderBottom: "3px solid rgb(246,246,246)" }}
                                className="pb-4"
                            >
                                <span className="settings-my-order">
                                    <img
                                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDE4Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04LjY5NCAtMTEpIj48ZWxsaXBzZSBjeD0iMjAuNTU3IiBjeT0iMjAiIHJ4PSIyMC41NTciIHJ5PSIyMCIvPjxwYXRoIGZpbGw9IiMyODc0RjEiIGQ9Ik05IDExdjE3LjEwOGMwIC40OTMuNDEuODkyLjkxOC44OTJoNC45M3YtNS4yNTdoLTMuMDMzbDQuOTEyLTQuNzcgNC45NzIgNC44M2gtMy4wMzVWMjloMTIuNDE3Yy41MDcgMCAuOTE4LS40LjkxOC0uODkyVjExSDl6Ii8+PC9nPjwvc3ZnPg=="
                                        alt=""
                                        className="px-3"
                                    />
                                    MY ORDERS
                                </span>
                            </div>
                            <div
                                className="pt-5 pb-3"
                                style={{ borderBottom: "3px solid rgb(246,246,246)" }}
                            >
                                <div>
                                    <span className="settings-account-settings">
                                        <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDIyIDIxIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjY5NCAtMTApIj48cGF0aCBmaWxsPSIjMjg3NEYwIiBkPSJNMTQuMjc1IDIyLjcwNGMyLjI3Mi0uNDEyIDQuMzQ3LS42MTggNi4yMjUtLjYxOCAxLjg3OCAwIDMuOTUzLjIwNiA2LjIyNS42MThhNS4xNSA1LjE1IDAgMCAxIDQuMjMgNS4wNjhWMzFoLTIwLjkxdi0zLjIyOGE1LjE1IDUuMTUgMCAwIDEgNC4yMy01LjA2OHptMS4yNzQtNy43MjRjMC0yLjU4IDIuMTYzLTQuNjczIDQuODMyLTQuNjczIDIuNjY3IDAgNC44MyAyLjA5MiA0LjgzIDQuNjczIDAgMi41OC0yLjE2MyA0LjY3My00LjgzIDQuNjczLTIuNjcgMC00LjgzMy0yLjA5Mi00LjgzMy00LjY3M3oiLz48ZWxsaXBzZSBjeD0iMjAuNTU3IiBjeT0iMjAiIHJ4PSIyMC41NTciIHJ5PSIyMCIvPjwvZz48L3N2Zz4="
                                            alt=""
                                            className="px-3"
                                        />
                                        ACCOUNT SETTINGS
                                    </span>
                                </div>
                                <div>
                                    <div className="px-5 pt-3 button-hov" id="profile-link">
                                        <button
                                            className="remove-button-style mb-3"
                                            onclick="showProfile()"
                                        >
                                            Profile Information
                                        </button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov" id="manage-address-link">
                                        <button
                                            className="remove-button-style mb-3"
                                            onclick="manageAddress()"
                                        >
                                            Manage Addresses
                                        </button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">
                                            Pan Card Information
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="pt-5 pb-3"
                                style={{ borderBottom: "3px solid rgb(246,246,246)" }}
                            >
                                <div>
                                    <span className="settings-account-settings">
                                        <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMyIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDIzIDIyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjY5NCAtOSkiPjxlbGxpcHNlIGN4PSIyMC41NTciIGN5PSIyMCIgcng9IjIwLjU1NyIgcnk9IjIwIi8+PHBhdGggZD0iTTcgNmgyOHYyOEg3eiIvPjxwYXRoIGZpbGw9IiMyODc0RjAiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTMxLjUgMjd2MS4xNjdhMi4zNCAyLjM0IDAgMCAxLTIuMzMzIDIuMzMzSDEyLjgzM2EyLjMzMyAyLjMzMyAwIDAgMS0yLjMzMy0yLjMzM1YxMS44MzNBMi4zMzMgMi4zMzMgMCAwIDEgMTIuODMzIDkuNWgxNi4zMzRhMi4zNCAyLjM0IDAgMCAxIDIuMzMzIDIuMzMzVjEzSDIxYTIuMzMzIDIuMzMzIDAgMCAwLTIuMzMzIDIuMzMzdjkuMzM0QTIuMzMzIDIuMzMzIDAgMCAwIDIxIDI3aDEwLjV6TTIxIDI0LjY2N2gxMS42Njd2LTkuMzM0SDIxdjkuMzM0em00LjY2Ny0yLjkxN2MtLjk3IDAtMS43NS0uNzgyLTEuNzUtMS43NXMuNzgtMS43NSAxLjc1LTEuNzVjLjk2OCAwIDEuNzUuNzgyIDEuNzUgMS43NXMtLjc4MiAxLjc1LTEuNzUgMS43NXoiLz48L2c+PC9zdmc+"
                                            alt=""
                                            className="px-3"
                                        />
                                        PAYMENTS
                                    </span>
                                </div>
                                <div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">Gift Cards</button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">Saved UPI</button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">
                                            Saved Cards
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="pt-5 pb-3"
                                style={{ borderBottom: "3px solid rgb(246,246,246)" }}
                            >
                                <div>
                                    <span className="settings-account-settings">
                                        <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMyIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDIzIDE5Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyODc0RjAiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTIwLjUgMi43NWgtOUw5LjI1LjVIMi41QTIuMjQ3IDIuMjQ3IDAgMCAwIC4yNiAyLjc1bC0uMDEgMTMuNUEyLjI1NyAyLjI1NyAwIDAgMCAyLjUgMTguNWgxOGEyLjI1NyAyLjI1NyAwIDAgMCAyLjI1LTIuMjVWNWEyLjI1NyAyLjI1NyAwIDAgMC0yLjI1LTIuMjV6bS01LjYyNSAzLjM3NWEyLjI1NyAyLjI1NyAwIDAgMSAyLjI1IDIuMjUgMi4yNTcgMi4yNTcgMCAwIDEtMi4yNSAyLjI1IDIuMjU3IDIuMjU3IDAgMCAxLTIuMjUtMi4yNSAyLjI1NyAyLjI1NyAwIDAgMSAyLjI1LTIuMjV6bTQuNSA5aC05VjE0YzAtMS40OTYgMy4wMDQtMi4yNSA0LjUtMi4yNXM0LjUuNzU0IDQuNSAyLjI1djEuMTI1eiIvPjxwYXRoIGQ9Ik0tMi00aDI3djI3SC0yeiIvPjwvZz48L3N2Zz4="
                                            alt=""
                                            className="px-3"
                                        />
                                        MY STUFF
                                    </span>
                                </div>
                                <div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">My Coupons</button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">
                                            My Reviews &amp; Ratings
                                        </button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">
                                            All Notifications
                                        </button>
                                    </div>
                                    <div className="px-5 pt-3 button-hov">
                                        <button className="remove-button-style mb-3">
                                            My Wishlist
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="py-4">
                                <span className="settings-logout pt-3">
                                    <img src="" alt="" className="px-3" />
                                    Logout
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="pt-3 py-3">
                        <div className="settings-profile-name pt-3 px-3 py-3 settings-frequent">
                            Frequently Visited:
                            <div className="d-flex ">
                                <div className="frequent-button-style">
                                    <button className="remove-button-style pt-3">Track Order</button>
                                </div>
                                <div className="frequent-button-style">
                                    <button className="remove-button-style pt-3">Help Center</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Main content area with gap and white background */}
                <div
                    className="main-content pt-3 bg-white p-5 px-5"
                    style={{ width: "75%", marginLeft: 16 }}
                    id="main-content"
                >
                    <div>
                        {/* Personal Information */}
                        <div className="fs-5 personalInformation pt-4">
                            Personal Information
                            <span className="fs-6 te edit-button-color">
                                <button id="edit-name-button" className="remove-button-style px-5">
                                    Edit
                                </button>
                                <button
                                    id="save-name-button"
                                    className="remove-button-style px-5"
                                    style={{ display: "none" }}
                                >
                                    Save
                                </button>
                                <button
                                    id="cancel-name-button"
                                    className="remove-button-style px-5"
                                    style={{ display: "none" }}
                                >
                                    Cancel
                                </button>
                            </span>
                            <div className="pt-4">
                                <input
                                    type="text"
                                    name="name"
                                    id="name"
                                    className="p-2"
                                    readOnly=""
                                />
                            </div>
                        </div>
                        {/* Email Address */}
                        <div className="pt-4 fs-5 personalInformation">
                            Email Address
                            <span className="fs-6 te edit-button-color">
                                <button id="edit-email-button" className="remove-button-style px-5">
                                    Edit
                                </button>
                                <button
                                    id="save-email-button"
                                    className="remove-button-style px-5"
                                    style={{ display: "none" }}
                                >
                                    Save
                                </button>
                                <button
                                    id="cancel-email-button"
                                    className="remove-button-style px-5"
                                    style={{ display: "none" }}
                                >
                                    Cancel
                                </button>
                            </span>
                            <div className="pt-4">
                                <input
                                    type="email"
                                    name="email"
                                    id="email"
                                    className="p-2"
                                    readOnly=""
                                />
                            </div>
                        </div>
                        {/* Mobile Number */}
                        <div className="pt-4 fs-5 personalInformation">
                            Mobile Number
                            <span className="fs-6 te edit-button-color">
                                <button id="edit-phone-button" className="remove-button-style px-5">
                                    Edit
                                </button>
                                <button
                                    id="save-phone-button"
                                    className="remove-button-style px-5"
                                    style={{ display: "none" }}
                                >
                                    Save
                                </button>
                                <button
                                    id="cancel-phone-button"
                                    className="remove-button-style px-5"
                                    style={{ display: "none" }}
                                >
                                    Cancel
                                </button>
                            </span>
                            <div className="pt-4">
                                <input
                                    type="number"
                                    name="phone"
                                    id="phone"
                                    className="p-2"
                                    readOnly=""
                                />
                            </div>
                        </div>
                        {/* FAQs Section */}
                        <div className="pt-5 faqs">
                            <div>FAQ's</div>
                            <div className="pt-3 fs-6">
                                What happens when I update my email address (or mobile number)?
                                <div className="fw-light pt-2">
                                    Your login email id (or mobile number) changes, likewise. You'll
                                    receive all your account-related communication on your updated
                                    email address (or mobile number).
                                </div>
                            </div>
                            <div className="pt-3 fs-6">
                                Does my Seller account get affected when I update my email address?
                                <div className="fw-light pt-2">
                                    We have a 'single sign-on' policy. Any changes will reflect in
                                    your Seller account also.
                                </div>
                            </div>
                            <div>
                                <div className="pt-5">
                                    <button className="account-action-btn remove-button-style fs-6 deaacc-color">
                                        Deactivate Account
                                    </button>
                                    <button className="account-action-btn remove-button-style fs-6 deleacc-color">
                                        Delete Account
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div id="manageAdresses" style={{ display: "none" }}>
                    <div
                        className=" pt-3 bg-white p-5 px-5"
                        style={{ width: "50vw", marginLeft: 16 }}
                    >
                        <div className="manage-adress-text pt-3" id="empty-manage">
                            Manage Addresses
                        </div>
                        <div className="pt-5">
                            <div className="p-3 border" id="newaddress">
                                <span
                                    onclick="showForm()"
                                    style={{ cursor: "pointer", color: "rgb(40,116,240)" }}
                                >
                                    <img
                                        src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMTc1RkYiIGQ9Ik0xMS4yNSA2Ljc1aC00LjV2NC41aC0xLjV2LTQuNUguNzV2LTEuNWg0LjVWLjc1aDEuNXY0LjVoNC41Ii8+PHBhdGggZD0iTS0zLTNoMTh2MThILTMiLz48L2c+PC9zdmc+"
                                        alt=""
                                        className="px-3"
                                    />
                                    ADD A NEW ADDRESS
                                </span>
                            </div>
                        </div>
                        {/* address form */}
                        <div
                            id="address-form"
                            style={{ display: "none", backgroundColor: "rgb(245,250,255)" }}
                            className="p-3"
                        >
                            <form onsubmit="addAddress(event)">
                                <div>
                                    <div style={{ color: "rgb(40,116,240)" }}>ADD A NEW ADDRESS</div>
                                    <div className="d-flex pt-5 gap-5">
                                        <div className="input-container w-100">
                                            <input
                                                type="text"
                                                className="p-2 w-100"
                                                name="name"
                                                id="name1"
                                            />
                                            <label htmlFor="name" className="lBFHyk">
                                                Name
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex pt-5 gap-5">
                                        <div className="input-container">
                                            <input type="text" className="p-2" name="state" id="state" />
                                            <label htmlFor="city" className="lBFHyk">
                                                State
                                            </label>
                                        </div>
                                        <div className="input-container">
                                            <input type="text" className="p-2" name="city" id="city" />
                                            <label htmlFor="city" className="lBFHyk">
                                                city
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex pt-5 gap-5">
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                className="p-2"
                                                name="street"
                                                id="street"
                                            />
                                            <label htmlFor="name" className="lBFHyk">
                                                Street
                                            </label>
                                        </div>
                                        <div className="input-container">
                                            <input
                                                type="text"
                                                className="p-2"
                                                name="pincode"
                                                id="pincode"
                                            />
                                            <label htmlFor="name" className="lBFHyk">
                                                Pincode
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex pt-5 gap-5">
                                        <div className="input-container w-100">
                                            <input
                                                type="text"
                                                className="p-2 w-100"
                                                name="country"
                                                id="country"
                                            />
                                            <label htmlFor="city" className="lBFHyk">
                                                Country
                                            </label>
                                        </div>
                                    </div>
                                    <div className="d-flex pt-4">
                                        <div>
                                            <button
                                                type="submit"
                                                className="remove-button-style px-5 p-3"
                                                style={{
                                                    backgroundColor: "rgb(40,116,240)",
                                                    color: "white"
                                                }}
                                            >
                                                SAVE
                                            </button>
                                        </div>
                                        <div>
                                            <button
                                                type="submit"
                                                className="remove-button-style p-3 px-5"
                                                onclick="closeForm()"
                                                style={{
                                                    color: "rgb(40,116,240)",
                                                    fontSize: 14,
                                                    fontWeight: 500
                                                }}
                                            >
                                                CANCEL
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div>
                            <div id="address-data" className="pt-3"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}