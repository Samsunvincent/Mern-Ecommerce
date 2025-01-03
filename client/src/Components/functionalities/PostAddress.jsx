import axios from "axios";

const PostAddress = async (id, Address) => {
    try {
        const response = await axios.patch(`http://localhost:3000/addAddress/${id}`, { Address }, {
            headers: {
                "Content-Type": "application/json",
            },
        }
        );
        console.log("Response from server:", response);
        let data = response.data.data;
        console.log("data from the post addres",data);

        return data

    } catch (error) {
        console.error("Error in PostAddress:", error.message);
        throw error; // Propagate the error for the caller to handle
    }
};

export default PostAddress;
