import axios from "axios";

const filterCategory = async (categoryName) => {
    if (!categoryName) {
        return { success: false, message: "Select a valid category." };
    }

    try {
        const response = await axios.post('http://localhost:3000/filter', { category: categoryName }, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = response.data.data;
        console.log("Data from filterCategory:", data);
        return data; // Return filtered products data
    } catch (error) {
        console.error("Internal server error", error);
        return { success: false, message: "An error occurred while fetching filtered products." };
    }
};

export default filterCategory;
