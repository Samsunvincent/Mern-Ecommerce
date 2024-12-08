import { useNavigate, useParams } from "react-router-dom";
import BuyerRoute from "../../functionalities/AdminFunctionalities/BuyersRoute";
import { useCallback, useEffect, useState } from "react";

export default function Buyer() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [buyerData, setBuyerData] = useState([]);
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBuyerData = async () => {
            try {
                const response = await BuyerRoute(token);
                console.log("Response from API:", response);

                // Extract the buyers array correctly
                if (response?.data?.data) {
                    setBuyerData(response.data.data); // Set the nested data array
                    console.log("Buyer data set to state:", response.data.data);
                } else {
                    console.error("No buyer data found in response");
                }
            } catch (error) {
                console.error("Error fetching buyer data:", error);
            }
        };
        fetchBuyerData();
    }, [token]);



    const handleDashBoard = useCallback(() => {
        navigate(`/Admin/${login}/${id}/${usertype}`)
    })

    const handleSeller = useCallback(() =>{
        navigate(`/Sellers/${login}/${id}/${usertype}`)
    })
    const handleBuyerDetails = useCallback((b_id) =>{
        console.log("b_id from buyer",b_id)
        navigate(`/Buyerdetails/${login}/${id}/${usertype}/${b_id}`)
    })

    return (
        <>
            <div className="bg-gray-100 font-roboto min-h-screen">
                <nav className="bg-gray-800 text-white py-3">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                        <ul className="flex space-x-4">
                            <li>
                                <a className="hover:text-gray-300" onClick={handleDashBoard} style={{ cursor: "pointer" }}>Dashboard</a>
                            </li>
                            <li>
                                <a onClick={handleSeller} className="hover:text-gray-300">Sellers</a>
                            </li>
                            <li>
                                <a href="/admin-orders" className="hover:text-gray-300">Orders</a>
                            </li>
                            <li>
                                <a href="/admin-products" className="hover:text-gray-300">Products</a>
                            </li>
                            <li>
                                <a href="/admin-reports" className="hover:text-gray-300">Reports</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div className="container mx-auto p-4">
                    <h1 className="text-2xl font-bold mb-4">Admin View - Buyers Data</h1>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200">
                            <thead>
                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                    <th className="py-3 px-6 text-left">ID</th>
                                    <th className="py-3 px-6 text-left">Name</th>
                                    <th className="py-3 px-6 text-left">Email</th>
                                    <th className="py-3 px-6 text-left">Phone</th>
                                    <th className="py-3 px-6 text-left">Address</th>
                                    <th className="py-3 px-6 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-600 text-sm font-light">
                                {buyerData.length > 0 ? (
                                    buyerData.map((buyer, index) => (
                                        <tr key={buyer._id} className="border-b border-gray-200 hover:bg-gray-100" onClick={() =>handleBuyerDetails(buyer._id)}>
                                            <td className="py-3 px-6 text-left whitespace-nowrap">{index + 1}</td>
                                            <td className="py-3 px-6 text-left">{buyer.name}</td>
                                            <td className="py-3 px-6 text-left">{buyer.email}</td>
                                            <td className="py-3 px-6 text-left">{buyer.phone_number}</td>
                                            <td className="py-3 px-6 text-left">
                                                {buyer.Address?.length > 0
                                                    ? buyer.Address.map((addr, i) => (
                                                        <div key={i}>
                                                            {addr.name}, {addr.street}, {addr.city}, {addr.country}, {addr.pincode}
                                                        </div>
                                                    ))
                                                    : "No Address"}
                                            </td>
                                            <td className="py-3 px-6 text-left">
                                                <button className="text-green-500 hover:text-green-700">
                                                    <i className="fas fa-unlock" /> Block
                                                </button>
                                                <button className="text-red-500 hover:text-red-700 ml-2">
                                                    <i className="fas fa-trash" /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className="py-3 px-6 text-center">
                                            No Buyers Found
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

        </>
    );
}
