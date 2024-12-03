import axios from "axios";

const AddToCart = async (body) => {
    try {
        const response = await axios.post(`http://localhost:3000/addtocart`, body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("API Response in AddToCart:", response.data); // Log the full response here

        return response.data; // Return response data, which includes success, message, totalPrice
    } catch (error) {
        console.log("Error in AddToCart API:", error);
        throw error; // Re-throw the error for the component to handle
    }
};

export default AddToCart;
