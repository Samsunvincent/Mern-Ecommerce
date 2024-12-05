import axios from "axios";

const FetchWishlist = async function (id) {
    try {
        const response = await axios.get(`http://localhost:3000/getwishlist/${id}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log("Response from wishlist:", response);

        // Validate and extract the data
        if (response.data && response.data.success) {
            let data = response.data.data;
            console.log("Data from fetch wishlist:", data);
            return data;
        } else {
            console.warn("Wishlist fetch failed:", response.data.message || "Unknown error");
            return [];
        }
    } catch (error) {
        console.error("Error in FetchWishlist:", error.message || error);
        return [];
    }
};

export default FetchWishlist;
