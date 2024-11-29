import axios from "axios";

const getCategory = async () => {
  try {
    const response = await axios.get("http://localhost:3000/getcategory", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = response.data?.data || []; // Ensure it's an array
    console.log("Data from getCategory:", data);
    return data; // Should be an array of objects like [{ _id, category, __v }]
  } catch (error) {
    console.log("Error in getCategory:", error);
    return []; // Return an empty array as a fallback
  }
};

export default getCategory;
