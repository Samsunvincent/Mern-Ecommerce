import axios from "axios";

const AllOrdersRoute = async function(token){
    try {
        let response = await axios.get(`http://localhost:3000/GetAllOrders`,{
            headers : {
                'Content-Type' : 'application/json',
                'Authorization' : `Bearer ${token}`,
            },
        });
        console.log('response from allorder route',response);
        return response.data
    } catch (error) {
        console.log('error',error);
    }
}

export default AllOrdersRoute