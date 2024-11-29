
import axios from 'axios';

const Register = async (body) => {
    if (!body) {
        console.error('Error: No data provided to register.');
        return { success: false, message: 'No data provided to register.' }; // Return a structured error response
    }

    try {
        // Sending POST request to the backend
        const response = await axios.post('http://localhost:3000/signin', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle successful registration
        console.log('Registration successful:', response.data);
        return { success: true, data: response.data }; // Return structured success data
    } catch (error) {
        // Improved error handling
        const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
        console.error('Error during registration:', errorMessage);
        return { success: false, message: errorMessage }; // Return structured error message
    }
};

export default Register;

