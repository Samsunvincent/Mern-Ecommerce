import axios from "axios";

const ResetRoute = async (body,token) =>{
    try {
        let response = await axios.patch(`http://localhost:3000/reset-password`,body,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`
            },
        });
        console.log("response",response);
        return response;
    } catch (error) {
        console.log("error",error);
    }
}

export default ResetRoute