import axios from "axios";

const SingleView = async (p_id) => {
    try {
        let response = await axios.get(`http://localhost:3000/getSingleViewProduct/${p_id}`); // Corrected URL with `/` before ${id}
        let data = response.data.data;
        console.log("data", data);
        return data;
    } catch (error) {
        console.error("Error fetching single view product:", error);
        throw error; // Optionally rethrow the error for handling elsewhere
    }
};

export default SingleView;
