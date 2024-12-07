import axios from "axios";

const Buynow = async function(body, id) {
    try {
        const response = await axios.post(
            `http://localhost:3000/placeOrders/${id}`,body, 
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Response from order: ', response);
        
        // Ensure response data exists and return the order
        if (response.data) {
            return response.data;
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error("Error placing order:", error);
        // Return a structured error object that can be used by the component
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export default Buynow;
