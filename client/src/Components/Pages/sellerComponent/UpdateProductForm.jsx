import { useEffect, useState } from "react";
import SingleView from "../../functionalities/SingleView";
import { useParams } from "react-router-dom";
import getCategory from "../../functionalities/getCategory";
import Update from "../../functionalities/updateProduct";

export default function UpdateProduct() {
    const { p_id,id } = useParams();
    const [singleProduct, setSingleProduct] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [categoriesLoading, setCategoriesLoading] = useState(true);

    // Fetch product data
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const product = await SingleView(p_id);
                setSingleProduct(product);
            } catch (error) {
                console.error("Error fetching product:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProduct();
    }, [p_id]);

    // Fetch categories
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoryData = await getCategory();
                setCategories(categoryData);
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setCategoriesLoading(false);
            }
        };

        fetchCategories();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setSingleProduct((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                [name]: value,
            },
        }));
    };

    // Handle product update
    const handleUpdateProduct = async (e) => {
        e.preventDefault();
        try {
            await Update(id,p_id, singleProduct.product); // Assuming Update is a function to update the product
            alert("Product updated successfully!");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product.");
        }
    };

    // Handle image file selection
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setSingleProduct((prev) => ({
            ...prev,
            product: {
                ...prev.product,
                images: files,
            },
        }));
    };

    if (isLoading) {
        return <p>Loading product...</p>;
    }

    if (!singleProduct) {
        return <p>Product not found.</p>;
    }

    return (
        <div className="bg-gray-100 flex items-center justify-center min-h-screen">
            <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-4xl">
                <h1 className="text-2xl font-bold mb-6">Update Product</h1>
                <form onSubmit={handleUpdateProduct}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-gray-700">Product Name</label>
                            <input
                                type="text"
                                name="name"
                                value={singleProduct.product?.name || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Price</label>
                            <input
                                type="text"
                                name="price"
                                value={singleProduct.product?.price || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Category</label>
                            <select
                                name="category"
                                value={singleProduct.product?.category || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            >
                                <option value="">Select Category</option>
                                {categoriesLoading ? (
                                    <option>Loading categories...</option>
                                ) : categories.length > 0 ? (
                                    categories.map((category) => (
                                        <option key={category.id} value={category.category}>
                                            {category.category}
                                        </option>
                                    ))
                                ) : (
                                    <option>No categories available</option>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="block text-gray-700">Stock Quantity</label>
                            <input
                                type="text"
                                name="stock"
                                value={singleProduct.product?.stock || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Brand</label>
                            <input
                                type="text"
                                name="brand"
                                value={singleProduct.product?.brand || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Discount</label>
                            <input
                                type="text"
                                name="discount"
                                value={singleProduct.product?.discount || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                placeholder="e.g., 10%"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Offer</label>
                            <input
                                type="text"
                                name="offer"
                                value={singleProduct.product?.offer || ""}
                                onChange={handleChange}
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Buy 1 Get 1 Free"
                            />
                        </div>
                    </div>
                    <p className="text-gray-500 text-sm mt-2">
                        Specify the discount (e.g., "10%") and any additional offer (e.g., "Buy 1 Get 1 Free").
                    </p>
                    <div className="mt-6">
                        <label className="block text-gray-700">Description</label>
                        <textarea
                            name="description"
                            value={singleProduct.product?.description || ""}
                            onChange={handleChange}
                            className="w-full mt-1 p-2 border border-gray-300 rounded-md h-32"
                        />
                    </div>
                    <div className="mt-6">
                        <label className="block text-gray-700">Product Images</label>
                        <input type="file" className="mt-1" multiple onChange={handleImageChange} />
                    </div>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white p-2 rounded-md"
                        >
                            Update Product
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
