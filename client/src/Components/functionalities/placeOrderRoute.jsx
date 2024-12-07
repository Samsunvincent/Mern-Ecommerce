import axios from "axios";

const Buynow = async function (data, userId) {
    try {
        const response = await axios.post(
            `http://localhost:3000/placeOrders/${userId}`,
            { products: data.products },  // Send the products array as the body
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
        console.log('Response from order: ', response);

        if (response.data) {
            return response.data; // Return the order data to be handled by the component
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error("Error placing order:", error);
        return { success: false, message: error.message || "Something went wrong" };
    }
};

export default Buynow;
