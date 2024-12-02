import axios from "axios"

const UpdateUser = async (id,body) =>{
    try {
        let response = await axios.patch(`http://localhost:3000/updateuser/${id}`,body,{
            headers : {
                'Content-Type' : 'application/json',
            },
        });
            console.log('reponse',response);
    } catch (error) {
        console.log("error",error);
    }
}
export default UpdateUser