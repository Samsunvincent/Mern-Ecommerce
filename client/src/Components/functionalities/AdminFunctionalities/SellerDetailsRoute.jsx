import axios from "axios";

const SellerDetailsRoute = async (token,s_id) =>{
    try {
        let response = await axios.get(`http://localhost:3000/SellerDetails/${s_id}`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
        });
        console.log("response",response);
        return response.data.data
    } catch (error) {
        console.log("error",error);
    }
}

export default SellerDetailsRoute