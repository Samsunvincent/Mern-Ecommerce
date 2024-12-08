import axios from "axios";

const Count = async function(token){
    try {
        let response = await axios.get(`http://localhost:3000/ordercount`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });
        console.log("response from count route :",response)
        return response.data
    } catch (error) {
        console.log("error",error);
    }
}
export default Count