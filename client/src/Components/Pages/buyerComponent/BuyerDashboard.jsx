import { useCallback, useEffect, useState } from "react";
import GetUser from "../../functionalities/getUser";
import {  useNavigate, useParams } from "react-router-dom";
import UpdateUser from "../../functionalities/updateUser";
import PostAddress from "../../functionalities/PostAddress";
import Nav from "../../Nav/navOne";

export default function SellerDashboard() {
    const [userName, setUserName] = useState("");
    const params = useParams();
    const [userData, setUserData] = useState("");
    const{login,id,usertype} = useParams()


    const [showProfile, setShowProfile] = useState(true);
    const [showManageAddress, setShowManageAddress] = useState(false);
    const [showPan, setShowPan] = useState(false);

    const navigate = useNavigate(   )


    const [showAddressForm, setShowAddressForm] = useState(false);
    // const [closeAddressForm, setCloseAddressForm] = useState(true);
    const [reloadProfile, setReloadProfile] = useState(false); // Triggers reload of profile section
    const [name, setName] = useState('');
    const [street, setStreet] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('');
    const [pincode, setPincode] = useState('');
    const [addressData, setAddressData] = useState('')

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                let token_key = params.login;
                console.log("token_key:", token_key);

                let id = params.id;
                console.log("id for the user:", id);

                const fetchedUserData = await GetUser(id);
                console.log("Fetched user data:", fetchedUserData);

                setUserName(fetchedUserData.name);
                setUserData(fetchedUserData);
                setAddressData(fetchedUserData.Address);

            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        fetchUserData();
    }, [params.login, params.id]); // Dependency array ensures it runs only when params change

    useEffect(() => {
        const loadFetchedData = () => {
            let name = document.getElementById("name");
            let email = document.getElementById("email");
            let phone = document.getElementById("phone");

            if (name && email && phone) {
                name.value = userData.name || "";
                email.value = userData.email || "";
                phone.value = userData.phone_number || "";
            }
        };

        if (userData) {
            loadFetchedData();
        }
    }, [userData, reloadProfile]); // Runs only when userData changes

    useEffect(() => {
        // Initialize the edit, save, cancel functionality after userData is set
        if (userData) {
            initializeEditSaveCancelLogic();
        }
    }, [userData]); // Triggered when userData changes

    useEffect(() => {
        setShowProfile(true); // Show Personal Information by default
    }, []);


    function initializeEditSaveCancelLogic() {
        // Function to set up logic for each input section
        function setupField(fieldId) {
            const input = document.getElementById(fieldId);
            const editButton = document.getElementById(`edit-${fieldId}-button`);
            const saveButton = document.getElementById(`save-${fieldId}-button`);
            const cancelButton = document.getElementById(`cancel-${fieldId}-button`);

            let originalValue = input.value; // Store original value for cancel functionality
            let id = params.id;




            // Toggle between edit and read-only mode
            function toggleEditMode(editMode) {
                const isEditable = !!editMode;

                input.readOnly = !isEditable;
                editButton.style.display = isEditable ? 'none' : 'inline-block';
                saveButton.style.display = isEditable ? 'inline-block' : 'none';
                cancelButton.style.display = isEditable ? 'inline-block' : 'none';

                if (isEditable) {
                    originalValue = input.value; // Update original value on edit
                    input.focus(); // Focus input for editing
                }
            }

            // Edit Button Logic
            editButton.addEventListener('click', () => toggleEditMode(true));

            // Save Button Logic
            saveButton.addEventListener('click', async () => {
                try {
                    const updatedValue = input.value;

                    // Prepare the data for updating the user
                    const updateData = {};
                    updateData[fieldId] = updatedValue;
                    console.log("updated data", updateData)

                    await UpdateUser(id, updateData)

                } catch (error) {
                    console.error(`An error occurred while saving ${fieldId}:`, error);
                }
            });

            // Cancel Button Logic
            cancelButton.addEventListener('click', () => {
                input.value = originalValue; // Revert to original value
                toggleEditMode(false); // Exit edit mode
            });

            // Start in non-edit mode
            toggleEditMode(false);
        }

        // Set up logic for each field
        setupField('name');
        setupField('email');
        setupField('phone');




    }

    const showProfileSection = () => {
        setShowProfile(true);
        setShowManageAddress(false);
        setShowPan(false)

        // Toggle `reloadProfile` to force reloading content
        setReloadProfile((prev) => !prev);
    };


    const showManageAddressSection = () => {
        setShowProfile(false);
        setShowManageAddress(true);
        setShowPan(false)
    };

    const showPanInformation = () => {
        setShowPan(true);
        setShowProfile(false);
        setShowManageAddress(false)
    }


    const addAddress = useCallback(async (e) => {
        e.preventDefault();

        const id = params.id;
        const Address = {
            name,
            street,
            city,
            state,
            country,
            pincode,
        };

        // Check for missing fields
        const missingFields = Object.entries(Address)
            .filter(([key, value]) => !value) // Filter out empty or falsy fields
            .map(([key]) => key); // Extract the field names

        if (missingFields.length > 0) {
            console.error("The following fields are missing:", missingFields.join(", "));
            return;
        }

        try {
            const response = await PostAddress(id, Address); // Call the PostAddress function
            console.log("Address added successfully:", response);
            // Handle successful response, e.g., display success message or update UI
        } catch (error) {
            console.error("Error adding address:", error.message);
            // Handle error, e.g., display an error message
        }
    }, [params.id, name, street, city, state, country, pincode]);

    const handleMyOrders = useCallback(() =>{
        navigate(`/orderdata/${login}/${id}/${usertype}`)
    })





    return (
        <>
    
            <div className="bg-light">
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
                                <div id="settings-name-container" className="fw-bold">
                                    {userName || "Loading..."} {/* Display the user's name or a loading message */}
                                </div>
                            </div>
                        </div>
                        <div className="pt-3">
                            <div className="pt-3 settings-side-nav">
                                <div
                                    style={{ borderBottom: "3px solid rgb(246,246,246)" }}
                                    className="pb-4"
                                >
                                    <span
                                        className="settings-my-order"
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            cursor : "pointer"
                                        }}
                                        onClick={handleMyOrders}
                                    >
                                        <img
                                            src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIxOCIgdmlld0JveD0iMCAwIDI0IDE4Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC04LjY5NCAtMTEpIj48ZWxsaXBzZSBjeD0iMjAuNTU3IiBjeT0iMjAiIHJ4PSIyMC41NTciIHJ5PSIyMCIvPjxwYXRoIGZpbGw9IiMyODc0RjEiIGQ9Ik05IDExdjE3LjEwOGMwIC40OTMuNDEuODkyLjkxOC44OTJoNC45M3YtNS4yNTdoLTMuMDMzbDQuOTEyLTQuNzcgNC45NzIgNC44M2gtMy4wMzVWMjloMTIuNDE3Yy41MDcgMCAuOTE4LS40LjkxOC0uODkyVjExSDl6Ii8+PC9nPjwvc3ZnPg=="
                                            alt=""
                                            className="px-3"
                                            style={{ marginRight: "8px" }}
                                            
                                        />
                                        MY ORDERS
                                    </span>
                                </div>

                                <div
                                    className="pt-5 pb-3"
                                    style={{ borderBottom: "3px solid rgb(246,246,246)" }}
                                >
                                    <div>
                                        <span
                                            className="settings-account-settings"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMiIgaGVpZ2h0PSIyMSIgdmlld0JveD0iMCAwIDIyIDIxIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjY5NCAtMTApIj48cGF0aCBmaWxsPSIjMjg3NEYwIiBkPSJNMTQuMjc1IDIyLjcwNGMyLjI3Mi0uNDEyIDQuMzQ3LS42MTggNi4yMjUtLjYxOCAxLjg3OCAwIDMuOTUzLjIwNiA2LjIyNS42MThhNS4xNSA1LjE1IDAgMCAxIDQuMjMgNS4wNjhWMzFoLTIwLjkxdi0zLjIyOGE1LjE1IDUuMTUgMCAwIDEgNC4yMy01LjA2OHptMS4yNzQtNy43MjRjMC0yLjU4IDIuMTYzLTQuNjczIDQuODMyLTQuNjczIDIuNjY3IDAgNC44MyAyLjA5MiA0LjgzIDQuNjczIDAgMi41OC0yLjE2MyA0LjY3My00LjgzIDQuNjczLTIuNjcgMC00LjgzMy0yLjA5Mi00LjgzMy00LjY3M3oiLz48ZWxsaXBzZSBjeD0iMjAuNTU3IiBjeT0iMjAiIHJ4PSIyMC41NTciIHJ5PSIyMCIvPjwvZz48L3N2Zz4="
                                                alt=""
                                                className="px-3"
                                                style={{ marginRight: "8px" }}
                                            />
                                            ACCOUNT SETTINGS
                                        </span>
                                    </div>

                                    <div>
                                        <div className="px-5 pt-3 button-hov" id="profile-link">
                                            <button
                                                className="remove-button-style mb-3"
                                                onClick={showProfileSection}
                                            >
                                                Profile Information
                                            </button>
                                        </div>
                                        <div className="px-5 pt-3 button-hov" id="manage-address-link">
                                            <button
                                                className="remove-button-style mb-3"
                                                onClick={showManageAddressSection}
                                            >
                                                Manage Addresses
                                            </button>
                                        </div>
                                        <div className="px-5 pt-3 button-hov">
                                            <button className="remove-button-style mb-3" onClick={showPanInformation}>
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
                                        <span
                                            className="settings-account-settings"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMyIgaGVpZ2h0PSIyMiIgdmlld0JveD0iMCAwIDIzIDIyIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05LjY5NCAtOSkiPjxlbGxpcHNlIGN4PSIyMC41NTciIGN5PSIyMCIgcng9IjIwLjU1NyIgcnk9IjIwIi8+PHBhdGggZD0iTTcgNmgyOHYyOEg3eiIvPjxwYXRoIGZpbGw9IiMyODc0RjAiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTMxLjUgMjd2MS4xNjdhMi4zNCAyLjM0IDAgMCAxLTIuMzMzIDIuMzMzSDEyLjgzM2EyLjMzMyAyLjMzMyAwIDAgMS0yLjMzMy0yLjMzM1YxMS44MzNBMi4zMzMgMi4zMzMgMCAwIDEgMTIuODMzIDkuNWgxNi4zMzRhMi4zNCAyLjM0IDAgMCAxIDIuMzMzIDIuMzMzVjEzSDIxYTIuMzMzIDIuMzMzIDAgMCAwLTIuMzMzIDIuMzMzdjkuMzM0QTIuMzMzIDIuMzMzIDAgMCAwIDIxIDI3aDEwLjV6TTIxIDI0LjY2N2gxMS42Njd2LTkuMzM0SDIxdjkuMzM0em00LjY2Ny0yLjkxN2MtLjk3IDAtMS43NS0uNzgyLTEuNzUtMS43NXMuNzgtMS43NSAxLjc1LTEuNzVjLjk2OCAwIDEuNzUuNzgyIDEuNzUgMS43NXMtLjc4MiAxLjc1LTEuNzUgMS43NXoiLz48L2c+PC9zdmc+"
                                                alt=""
                                                className="px-3"
                                                style={{ marginRight: "8px" }}
                                            />
                                            PAYMENTS
                                        </span>
                                    </div>

                                    <div>
                                        <div className="px-5 pt-3 button-hov">
                                            <button className="remove-button-style mb-3" >Gift card</button>
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
                                        <span
                                            className="settings-account-settings"
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                            }}
                                        >
                                            <img
                                                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMyIgaGVpZ2h0PSIxOSIgdmlld0JveD0iMCAwIDIzIDE5Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyODc0RjAiIGZpbGwtcnVsZT0ibm9uemVybyIgZD0iTTIwLjUgMi43NWgtOUw5LjI1LjVIMi41QTIuMjQ3IDIuMjQ3IDAgMCAwIC4yNiAyLjc1bC0uMDEgMTMuNUEyLjI1NyAyLjI1NyAwIDAgMCAyLjUgMTguNWgxOGEyLjI1NyAyLjI1NyAwIDAgMCAyLjI1LTIuMjVWNWEyLjI1NyAyLjI1NyAwIDAgMC0yLjI1LTIuMjV6bS01LjYyNSAzLjM3NWEyLjI1NyAyLjI1NyAwIDAgMSAyLjI1IDIuMjUgMi4yNTcgMi4yNTcgMCAwIDEtMi4yNSAyLjI1IDIuMjU3IDIuMjU3IDAgMCAxLTIuMjUtMi4yNSAyLjI1NyAyLjI1NyAwIDAgMSAyLjI1LTIuMjV6bTQuNSA5aC05VjE0YzAtMS40OTYgMy4wMDQtMi4yNSA0LjUtMi4yNXM0LjUuNzU0IDQuNSAyLjI1djEuMTI1eiIvPjxwYXRoIGQ9Ik0tMi00aDI3djI3SC0yeiIvPjwvZz48L3N2Zz4="
                                                alt=""
                                                className="px-3"
                                                style={{ marginRight: "8px" }}
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
                        {showProfile && (
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
                        )}
                    </div>
                    {showManageAddress && (
                        <div id="manageAdresses">
                            <div
                                className="pt-3 bg-white p-5 px-5"
                                style={{ width: "50vw", marginLeft: 16 }}
                            >
                                <div className="manage-adress-text pt-3" id="empty-manage" style={{ fontSize: "18px", fontWeight: "700px", }}>
                                    Manage Addresses
                                </div>
                                <div className="pt-5">
                                    {!showAddressForm && (
                                        <div
                                            className="p-3 border d-flex align-items-center"
                                            id="newaddress"
                                            style={{ display: "flex", alignItems: "center" }}
                                        >
                                            <img
                                                src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxMiAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGZpbGw9IiMyMTc1RkYiIGQ9Ik0xMS4yNSA2Ljc1aC00LjV2NC41aC0xLjV2LTQuNUguNzV2LTEuNWg0LjVWLjc1aDEuNXY0LjVoNC41Ii8+PHBhdGggZD0iTS0zLTNoMTh2MThILTMiLz48L2c+PC9zdmc+"
                                                alt=""
                                                className="px-3"
                                                style={{ marginRight: "8px" }}
                                            />
                                            <span
                                                onClick={() => setShowAddressForm(true)}
                                                style={{ cursor: "pointer", color: "rgb(40,116,240)" }}
                                            >
                                                ADD A NEW ADDRESS
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Address Form */}
                                {showAddressForm && (
                                    <div
                                        id="address-form"
                                        style={{ backgroundColor: "rgb(245,250,255)" }}
                                        className="p-3"
                                    >
                                        <form onSubmit={addAddress}>
                                            <div>
                                                <div style={{ color: "rgb(40,116,240)" }}>
                                                    ADD A NEW ADDRESS
                                                </div>
                                                <div className="d-flex pt-5 gap-5">
                                                    <div className="input-container w-100">
                                                        <input
                                                            type="text"
                                                            className="p-2 w-100"
                                                            name="name"
                                                            id="name1"
                                                            onChange={(e) => setName(e.target.value)}
                                                        />
                                                        <label htmlFor="name" className="lBFHyk">
                                                            Name
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="d-flex pt-5 gap-5">
                                                    <div className="input-container">
                                                        <input
                                                            type="text"
                                                            className="p-2"
                                                            name="state"
                                                            id="state"
                                                            onChange={(e) => setState(e.target.value)}
                                                        />
                                                        <label htmlFor="state" className="lBFHyk">
                                                            State
                                                        </label>
                                                    </div>
                                                    <div className="input-container">
                                                        <input
                                                            type="text"
                                                            className="p-2"
                                                            name="city"
                                                            id="city"
                                                            onChange={(e) => setCity(e.target.value)}
                                                        />
                                                        <label htmlFor="city" className="lBFHyk">
                                                            City
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
                                                            onChange={(e) => setStreet(e.target.value)}
                                                        />
                                                        <label htmlFor="street" className="lBFHyk">
                                                            Street
                                                        </label>
                                                    </div>
                                                    <div className="input-container">
                                                        <input
                                                            type="text"
                                                            className="p-2"
                                                            name="pincode"
                                                            id="pincode"
                                                            onChange={(e) => setPincode(e.target.value)}
                                                        />
                                                        <label htmlFor="pincode" className="lBFHyk">
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
                                                            onChange={(e) => setCountry(e.target.value)}
                                                        />
                                                        <label htmlFor="country" className="lBFHyk">
                                                            Country
                                                        </label>
                                                    </div>
                                                </div>
                                                <div className="d-flex gap-3 pt-3">
                                                    <button
                                                        type="submit"
                                                        className="remove-button-style bg-white border border-0"
                                                        style={{
                                                            border: "2px solid rgb(245,245,245)",
                                                            color: "rgb(69,69,69)",
                                                            backgroundColor: "rgb(40,116,240)",
                                                        }}
                                                    >
                                                        Save
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="remove-button-style"
                                                        onClick={() => setShowAddressForm(false)}
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                {/* Added address */}
                                <div className="mt-4">
                                    <h4 className="mb-3">Added Addresses</h4>
                                    {addressData.length > 0 ? (
                                        <div>
                                            {addressData.map((address, index) => (
                                                <div
                                                    key={index}
                                                    className="p-2 mb-2 bg-light"
                                                    style={{
                                                        border: "1px solid rgb(230,230,230)",
                                                        borderRadius: "6px",
                                                        padding: "16px",
                                                    }}
                                                >
                                                    <h5 className="mb-2" style={{ color: "rgb(40,116,240)" }}>
                                                        Address {index + 1}
                                                    </h5>
                                                    <p>
                                                        <strong>Name:</strong> {address.name}
                                                    </p>
                                                    <p>
                                                        <strong>Street:</strong> {address.street}
                                                    </p>
                                                    <p>
                                                        <strong>City:</strong> {address.city}
                                                    </p>
                                                    <p>
                                                        <strong>State:</strong> {address.state}
                                                    </p>
                                                    <p>
                                                        <strong>Pincode:</strong> {address.pincode}
                                                    </p>
                                                    <p>
                                                        <strong>Country:</strong> {address.country}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div>No addresses added yet.</div>
                                    )}
                                </div>

                            </div>
                        </div>
                    )}


                    {showPan && (
                        <div>
                            hello world
                        </div>
                    )}

                </div>
            </div>

        </>

    )
}