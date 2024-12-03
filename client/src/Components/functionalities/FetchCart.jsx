import axios from "axios"


const GetCartData = async function(id){
    try {
        let response = await axios.get(`http://localhost:3000/getCartData/${id}`);
        console.log("response while fetching",response);

      

        return response.data.data;
    } catch (error) {
        console.log("error",error);
    }
}
export default GetCartData