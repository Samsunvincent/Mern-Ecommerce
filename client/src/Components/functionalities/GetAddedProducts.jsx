import axios from "axios";

const GetAddedProducts = async (id) => {
    try {
        // Make the GET request to the server
        const { data } = await axios.get(`http://localhost:3000/getAddedProducts/${id}`, {
            headers: { 'Content-Type': 'application/json' },
        });

        // Check if the response contains valid data
        if (data && Array.isArray(data.data)) {
            console.log("Fetched products:", data.data);
            return data.data; // Return the valid product data
        }

        // If data is not in the expected format or no products found, log and return empty array
        console.log("No products found or invalid data structure");
        return [];
    } catch (error) {
        // Log the error and return an empty array to handle the failure gracefully
        console.error("Error fetching products:", error.message || error);
        return [];
    }
};

export default GetAddedProducts;
