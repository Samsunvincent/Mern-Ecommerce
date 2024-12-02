import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GetUser from "../functionalities/getUser";

export default function SideBar() {
    const [userName, setUserName] = useState("");
    const { login, id } = useParams(); // Extracting parameters from the URL

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                console.log("token_key:", login);
                console.log("id for the user:", id);

                const fetchedUserData = await GetUser(id);
                console.log("Fetched user data:", fetchedUserData);

                setUserName(fetchedUserData.name);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        if (id) fetchUserData(); // Ensure `id` is defined before making the call
    }, [login, id]);

    return (
        <>
            <div className="sidebar">
                <div className="settings-profile-name d-flex">
                    <span>
                        <img
                            src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/profile-pic-male_4811a1.svg"
                            className="p-3"
                            alt="Profile"
                        />
                    </span>
                    <div className="pt-3">
                        Hello
                        <div id="settings-name-container" className="fw-bold">
                            {userName || "Loading..."}
                        </div>
                    </div>
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
                                    <button className="remove-button-style mb-3">Saved Cards</button>
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
                                    <button className="remove-button-style mb-3">My Wishlist</button>
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

        </>
    )
}