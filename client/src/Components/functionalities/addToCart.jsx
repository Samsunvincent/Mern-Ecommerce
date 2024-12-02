import axios from "axios"

const AddToCart = async function (body) {

    try {
        let response = await axios.post(`http://localhost:3000/addtocart`,body,{
            headers : {
                'Content-Type' : 'application/json',
            },
        });
        console.log("response",response);
        let data = response.data.data;
        console.log("data",data);

        return data;
    } catch (error) {
        console.log("error",error)
    }

}
export default AddToCart;