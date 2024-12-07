import axios from "axios";

const RemoveCartData = async function(id,body){
    try {
        let response = await axios.delete(`http://localhost:3000/removeCartData/${id}`,body,{
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        console.log('response from remove cart data',response);
        return response
    } catch (error) {
        console.log("error",error)
    }
}

export default RemoveCartData