import axios from "axios";

const FetchOrder = async function(id) {
    try {
        const response = await axios.get(`http://localhost:3000/getorders/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Check if the response data is valid and contains the expected structure
        if (response && response.data && response.data.data) {
            console.log('Response from fetch order:', response);
            return response.data.data; // Return the actual order data
        } else {
            console.log('No data found in response.');
            return []; // Return an empty array if no data is found
        }

    } catch (error) {
        console.error('Error fetching orders:', error);
        return []; // Return an empty array in case of an error
    }
}

export default FetchOrder;
