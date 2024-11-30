import axios from "axios";

const PostProducts = async function (body, id) {
    try {
        let response = await axios.post(`http://localhost:3000/addProducts/${id}`, body, {
            // Remove Content-Type header as it is automatically set by axios for FormData
        });
        console.log("Add Products Response:", response);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

export default PostProducts;
