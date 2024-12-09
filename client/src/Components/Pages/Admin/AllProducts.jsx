import { useCallback, useEffect, useState } from "react";
import FetchAllProducts from "../../functionalities/AdminFunctionalities/AllProductsRoute";
import { useNavigate, useParams } from "react-router-dom";

export default function AllProducts() {
    const { login, id, usertype } = useParams();
    const token = localStorage.getItem(login);
    const [allProducts, setAllProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const FetchedProducts = async () => {
            const fetcheddata = await FetchAllProducts(token);
            console.log("fetcheddata", fetcheddata);
            setAllProducts(fetcheddata);
        };
        FetchedProducts();
    }, [id]);

    const handleDashboard = useCallback(() => {
        navigate(`/Admin/${login}/${id}/${usertype}`);
    }, [login, id, usertype, navigate]);

    const handleSeller = useCallback(() => {
        navigate(`/Sellers/${login}/${id}/${usertype}`);
    });

    const handleBuyer = useCallback(() => {
        navigate(`/Buyer/${login}/${id}/${usertype}`);
    });
    const handleSingleView = useCallback((p_id) =>{
        
        navigate(`/singleView/${login}/${id}/${usertype}/${p_id}`)
    })

    return (
        <div className="bg-gray-100 font-roboto h-screen flex flex-col">
            <nav className="bg-gray-800 text-white py-3">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                    <ul className="flex space-x-4">
                        <li>
                            <a href="" onClick={handleDashboard} className="hover:text-gray-300">
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="" onClick={handleSeller} className="hover:text-gray-300">
                                Seller
                            </a>
                        </li>
                        <li>
                            <a href="" onClick={handleBuyer} className="hover:text-gray-300">
                                Buyer
                            </a>
                        </li>
                        <li>
                            <a href="" className="hover:text-gray-300">
                                Orders
                            </a>
                        </li>
                        <li>
                            <a href="" className="hover:text-gray-300">
                                Products
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <div className="flex-grow container mx-auto p-4">
                <h1 className="text-2xl font-bold mb-4">Admin Product View</h1>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200">
                        <thead>
                            <tr>
                                <th className="py-2 px-4 border-b">Product Image</th>
                                <th className="py-2 px-4 border-b">Product Name</th>
                                <th className="py-2 px-4 border-b">Category</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Stock</th>
                                <th className="py-2 px-4 border-b">Seller</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allProducts.map((product) => (
                                <tr key={product._id} onClick={() =>handleSingleView(product._id)}>
                                    <td className="py-2 px-4 border-b">
                                        <img
                                            alt={product.name}
                                            height={100}
                                            src={`http://localhost:3000/${product.images[0]?.url || ""}`}
                                            width={100}
                                        />
                                    </td>
                                    <td className="py-2 px-4 border-b">{product.name}</td>
                                    <td className="py-2 px-4 border-b">{product.category}</td>
                                    <td className="py-2 px-4 border-b">${product.price}</td>
                                    <td className="py-2 px-4 border-b">{product.stock}</td>
                                    <td className="py-2 px-4 border-b">
                                        {product.sellerDetails?.name || "Unknown Seller"}
                                    </td>
                                    <td className="py-2 px-4 border-b">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
