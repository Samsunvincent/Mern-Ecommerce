import axios from "axios";

const Update = async function(id, p_id, body) {
    // Validation: Ensure required parameters and body data are provided
    if (!id || !p_id) {
        console.error("Error: Missing product or ID.");
        return null;  // Return null or handle as necessary
    }

    // Validate the body data structure (assuming 'body' is an object representing the product data)
    if (!body || typeof body !== "object") {
        console.error("Error: Invalid body data.");
        return null;  // Return null or handle as necessary
    }

    // Perform specific field validations
    if (!body.name || !body.price || !body.category) {
        console.error("Error: Missing required fields (name, price, or category).");
        return null;  // Return null or handle as necessary
    }

    // Ensure that price is a valid number
    if (isNaN(body.price)) {
        console.error("Error: Price must be a valid number.");
        return null;  // Return null or handle as necessary
    }

    // Optional: Add more validations as per your needs
    // For example: validate discount, offer, etc.

    try {
        // Send PUT request with the product update data
        let response = await axios.put(`http://localhost:3000/updateProducts/${id}/${p_id}`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if response is successful
        if (response && response.data && response.data.data) {
            let data = response.data.data;
            console.log("Product updated successfully:", data);
            return data;
        } else {
            console.error("Error: Invalid response data.");
            return null;
        }

    } catch (error) {
        // Handle specific error cases
        if (error.response) {
            // Server-side error (e.g., 400, 500)
            console.error("Server Error:", error.response.data);
        } else if (error.request) {
            // Network error (no response)
            console.error("Network Error:", error.request);
        } else {
            // General error
            console.error("Error:", error.message);
        }
        return null;  // Return null or handle as necessary
    }
};

export default Update;
