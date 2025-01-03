import axios from "axios";

const RemoveCartData = async function(id,p_id){
    try {
        let response = await axios.delete(`http://localhost:3000/removeCartData/${id}/${p_id}`,{
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        console.log("response",response);
        return response.data
    } catch (error) {
        console.log("error",error);
    }
}

export default RemoveCartData