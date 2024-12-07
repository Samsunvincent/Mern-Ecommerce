import axios from "axios";

const FetchAddress = async function (id) {
    try {
        let response = await axios.get(`http://localhost:3000/getAddress/${id}`);
        let data = response.data.data;
        console.log('response from the get address route : ',data);
        // Return data if everything is fine
        return data;
    } catch (error) {
        // Log the error
        console.log('Error fetching address:', error);

        // Return null or a custom error object, so the caller can handle it appropriately
        return null;
    }
}

export default FetchAddress;
