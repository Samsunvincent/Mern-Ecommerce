import axios from "axios";

const GetUserTypes = async () => {
    try {
        const { data } = await axios.get('http://localhost:3000/getUserType');
        // Filter out "Admin" user type
        return data.data.filter(type => type.userType !== "Admin");
    } catch (error) {
        console.error('Error fetching user types:', error);
        return []; // Return an empty array in case of error
    }
};

export default GetUserTypes;
