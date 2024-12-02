import axios from "axios";

const GetUser = async function(id){
    try {
        let response = await axios.get(`http://localhost:3000/user/${id}`)
        console.log("user data",response);

        let data = response.data.data;
        console.log("data",data);

        return data;
    } catch (error) {
        console.log('error',error);
    }
}
export default GetUser