import axios from "axios";

const BlockorUnblock = async (id, description, token) => {
    try {
        let response = await axios.put(
            `http://localhost:3000/BlockOrUnBlock/${id}/${description}`,{},{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            }
        );
        console.log('Response from block router:', response);
        return response;
    } catch (error) {
        console.error('Error in BlockorUnblock:', error);
        throw error; // Throwing the error so it can be handled by the caller
    }
};

export default BlockorUnblock;
