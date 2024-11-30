import axios from "axios";

const getAllProducts = async function (id, usertype) {
    try {
        const response = await axios.get(`http://localhost:3000/getProducts/${id}/${usertype}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const products = response.data.data;

        // Log the products to verify the structure
        console.log("Fetched products:", products);

        if (Array.isArray(products)) {
            return products; // Return the array of products
        } else {
            console.error("Fetched data is not an array:", products);
            return []; // Return an empty array in case of invalid data
        }
    } catch (error) {
        console.error("Error fetching products:", error);
        return []; // Return an empty array in case of an error
    }
};

export default getAllProducts;
