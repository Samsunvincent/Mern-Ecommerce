import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SellerRoute from "../../functionalities/AdminFunctionalities/SellersRoute";

export default function Sellers() {
    const navigate = useNavigate();
    const { login, id, usertype } = useParams();
    const [sellerData, setSellerData] = useState([]);
    const token = localStorage.getItem(login);

    const handleDashBoard = useCallback(() => {
        navigate(`/Admin/${login}/${id}/${usertype}`);
    }, [login, id, usertype, navigate]);

    useEffect(() => {
        const fetchSellerData = async () => {
            try {
                const response = await SellerRoute(token);
                console.log("Response from API:", response);

                if (response?.data?.data) {
                    setSellerData(response.data.data);
                    console.log("Seller data set to state:", response.data.data);
                } else {
                    console.error("No seller data found in response");
                }
            } catch (error) {
                console.error("Error fetching seller data:", error);
            }
        };
        fetchSellerData();
    }, [token]);

    const handleBuyer = useCallback(() =>{
        navigate(`/Buyer/${login}/${id}/${usertype}`)
    })

    const handleSellerDetails = useCallback((s_id) =>{
        navigate(`/SellerDetails/${login}/${id}/${usertype}/${s_id}`)
    })

    return (
        <div className="bg-gray-100 font-roboto min-h-screen">
            <nav className="bg-gray-800 text-white py-3">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <a
                                className="hover:text-gray-300"
                                onClick={handleDashBoard}
                                style={{ cursor: "pointer" }}
                            >
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a className="hover:text-gray-300" onClick={handleBuyer}>
                                Buyers
                            </a>
                        </li>
                        <li>
                            <a href="/admin-orders" className="hover:text-gray-300">
                                Orders
                            </a>
                        </li>
                        <li>
                            <a href="/admin-products" className="hover:text-gray-300">
                                Products
                            </a>
                        </li>
                        <li>
                            <a href="/admin-reports" className="hover:text-gray-300">
                                Reports
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Admin View - Sellers Data</h1>
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
                            {sellerData.length > 0 ? (
                                sellerData.map((seller, index) => (
                                    <tr
                                        key={seller._id}
                                        className="border-b border-gray-200 hover:bg-gray-100"
                                        onClick={() =>handleSellerDetails(seller._id)}
                                    >
                                        <td className="py-3 px-6 text-left whitespace-nowrap">
                                            {index + 1}
                                        </td>
                                        <td className="py-3 px-6 text-left">{seller.name}</td>
                                        <td className="py-3 px-6 text-left">{seller.email}</td>
                                        <td className="py-3 px-6 text-left">{seller.phone_number}</td>
                                        <td className="py-3 px-6 text-left">
                                            {seller.Address?.length > 0
                                                ? seller.Address.map((addr, i) => (
                                                      <div key={i}>
                                                          {addr.street}, {addr.city}, {addr.country}, {addr.pincode}
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
                                        No Sellers Found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
