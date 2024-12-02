import React, { useReducer, useEffect, useCallback } from "react";
import getCategory from "../../functionalities/getCategory"; // Function to fetch categories
import PostProducts from "../../functionalities/PostProducts"; // Function to post product data
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';  // Import toastify components
import 'react-toastify/dist/ReactToastify.css';  // Import toastify styles

// Initial state for the form
const initialState = {
  categories: [],
  isLoading: true,
  error: null,
  selectedCategory: '',
  name: '',
  price: '',
  stock: '',
  brand: '',
  description: '',
  discount : '',
  offer : '',
  images: [], // Store images as files
};

// Reducer function
function formReducer(state, action) {
  switch (action.type) {
    case "SET_CATEGORIES":
      return { ...state, categories: action.payload, isLoading: false };
    case "SET_ERROR":
      return { ...state, error: action.payload, isLoading: false };
    case "SET_LOADING":
      return { ...state, isLoading: true };
    case "UPDATE_FIELD":
      return { ...state, [action.field]: action.value };
    case "ADD_IMAGES":
      return { ...state, images: [...state.images, ...action.payload] };
    case "RESET_FORM":
      return initialState;
    default:
      return state;
  }
}

export default function AddProducts() {
  const [state, dispatch] = useReducer(formReducer, initialState);
  const { categories, isLoading, error, name, price, stock, brand, description, selectedCategory,discount,offer, images } = state;
  const params = useParams();

  // Fetch categories from the server
  useEffect(() => {
    const fetchCategories = async () => {
      dispatch({ type: "SET_LOADING" });
      try {
        const data = await getCategory();
        if (Array.isArray(data)) {
          dispatch({ type: "SET_CATEGORIES", payload: data });
        } else {
          throw new Error("Invalid data format received.");
        }
      } catch (err) {
        dispatch({ type: "SET_ERROR", payload: err.message });
      }
    };

    fetchCategories();
  }, []);

  // Handle form submission using FormData
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const id = params.id;

      // Create a FormData object
      const formData = new FormData();

      // Append the product fields to the FormData object
      formData.append("name", name);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("brand", brand);
      formData.append("description", description);
      formData.append("category", selectedCategory);
      formData.append("discount", discount);
      formData.append("offer", offer);



      // Append images using 'images[]' for multiple files
      images.forEach((image) => {
        formData.append("images[]", image); // Append each image as 'images[]'
      });

      try {
        // Send the form data to the backend
        await PostProducts(formData, id);  // Assuming PostProducts sends the request
        dispatch({ type: "RESET_FORM" });
        toast.success("Product added successfully!");  // Display success toast
      } catch (error) {
        console.error("Error adding product:", error);
        toast.error("Failed to add the product. Please try again.");  // Display error toast
      }
    },
    [name, price, stock, brand, description, selectedCategory, images, params]
  );

  // Handle file input changes
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files); // Convert FileList to array
    dispatch({ type: "ADD_IMAGES", payload: files });
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Product Name */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="name">
                Product Name
              </label>
              <input
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                id="name"
                type="text"
                value={name}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "name", value: e.target.value })}
              />
            </div>

            {/* Price */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="price">
                Price
              </label>
              <input
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                id="price"
                type="number"
                value={price}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "price", value: e.target.value })}
              />
            </div>

            {/* Category */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="category">
                Category
              </label>
              <select
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                id="category"
                value={selectedCategory}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "selectedCategory", value: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category._id} value={category.category}>
                    {category.category}
                  </option>
                ))}
              </select>
            </div>

            {/* Stock */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="stock">
                Stock Quantity
              </label>
              <input
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                id="stock"
                type="number"
                value={stock}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "stock", value: e.target.value })}
              />
            </div>

            {/* Brand */}
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700" htmlFor="brand">
                Brand
              </label>
              <input
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                id="brand"
                type="text"
                value={brand}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "brand", value: e.target.value })}
              />
            </div>
            {/* discount */}
            {/* Discount and Offer */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="discount">
                Discount
              </label>
              <div className="flex items-center gap-4 mt-1">
                <input
                  className="block w-1/2 p-2 border border-gray-300 rounded-md"
                  id="discount"
                  type="text"
                  placeholder="e.g., 10%"
                  value={state.discount}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "discount", value: e.target.value })}
                />
                <label className="block text-sm font-medium text-gray-700" htmlFor="offer">
                  Offer
                </label>
                <input
                  className="block w-1/2 p-2 border border-gray-300 rounded-md"
                  id="offer"
                  type="text"
                  placeholder="e.g., Buy 1 Get 1 Free"
                  value={state.offer}
                  onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "offer", value: e.target.value })}
                />
              </div>
              <p className="text-sm text-gray-500 mt-2">Specify the discount (e.g., "10%") and any additional offer (e.g., "Buy 1 Get 1 Free").</p>
            </div>


            {/* Description */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700" htmlFor="description">
                Description
              </label>
              <textarea
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                id="description"
                rows={4}
                value={description}
                onChange={(e) => dispatch({ type: "UPDATE_FIELD", field: "description", value: e.target.value })}
              />
            </div>

            {/* Images */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">Product Images</label>
              <input
                className="mt-2 block w-full"
                id="images"
                type="file"
                multiple
                onChange={handleFileChange}
              />
              <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(image)}
                    alt={`Product Preview ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6">
            <button className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md shadow-sm" type="submit">
              Add Product
            </button>
          </div>
        </form>
      </div>

      {/* Toast Container to display notifications */}
      <ToastContainer />
    </div>
  );
}
