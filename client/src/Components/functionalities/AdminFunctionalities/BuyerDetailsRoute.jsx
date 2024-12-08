import axios from "axios";
const BuyerDetailsRoute = async function(token,b_id){
    try {
        let response = await axios.get(`http://localhost:3000/BuyerDetails/${b_id}`,{
            headers : {
                'Content-Type' : 'application/json',
                "Authorization" : `Bearer ${token}`,
            },
        });
        console.log("response",response);
        return response.data.data
    } catch (error) {
        console.log("error",error);
    }
}
export default BuyerDetailsRoute