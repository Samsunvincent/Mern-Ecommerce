import axios from "axios";

const BuyerRoute = async function(token){
    try {
        let response = await axios.get(`http://localhost:3000/Buyers`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
        });
        console.log("response",response);
        return response;

    } catch (error) {
        console.log("error",error);
    }
}

export default BuyerRoute