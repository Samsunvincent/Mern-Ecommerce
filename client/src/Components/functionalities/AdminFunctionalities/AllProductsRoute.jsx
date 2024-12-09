import axios from "axios";

const FetchAllProducts = async function(token){
    try {
        let response = await axios.get(`http://localhost:3000/AllProducts`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
        });
        console.log('response from fetch products route',response);
        return response.data.data
    } catch (error) {
        console.log("error",error);
    }
}

export default FetchAllProducts