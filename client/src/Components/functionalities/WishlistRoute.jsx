import axios from "axios";

const Wishlist = async function(id, p_id) {
  try {
    let response = await axios.post(
      `http://localhost:3000/addtowishlist/${id}/${p_id}`,  // Corrected URL
      {},  // Empty object as body since you're only passing URL params
      {
        headers: {
          'Content-Type': 'application/json',  // This header is not needed unless you're sending JSON data in the body
        },
      }
    );
    console.log("response from wishlist",response)
    return response
   
  } catch (error) {
    console.log("error", error);
  }
};

export default Wishlist;
