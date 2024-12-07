import axios from "axios";

const CancelOder = async function(id, p_id) {
    try {
        // Update the URL to match the route defined on the backend
        let response = await axios.delete(`http://localhost:3000/cancelorder/${id}/${p_id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        console.log('Response from cancel order route', response);

        return response.data.message
    } catch (error) {
        console.log("Error canceling order:", error);
    }
};

export default CancelOder;
