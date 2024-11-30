import axios from 'axios';


const SignUp = async (body, navigate) => {
    // Check if email and password are provided
    if (!body || !body.email || !body.password) {
        alert('Email and password are required');
        return; // Exit early if email and password are not provided
    }

    try {
        // Send the request to the login endpoint with the body containing email and password
        let response = await axios.post('http://localhost:3000/login', body, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Handle successful response
        console.log('Login successful:', response.data);

        if (response.data.statusCode === 200) {
            let data = response.data.data; // Access the 'data' object within the response
            console.log("data", data);

            let userType, id;

            // Check if the user or admin exists to determine userType
            if (data.user) {
                userType = data.user.userType.userType;  // Access userType correctly
                id = data.user._id;  // Assuming the user's id is under data.user._id
            } else if (data.admin) {
                userType = data.admin.userType.userType;  // Access admin userType correctly
                id = data.admin._id;  // Assuming the admin's id is under data.admin._id
            } else {
                alert("User type not found in response.");
                return; // Exit if user type is not found
            }

            console.log("userType", userType);

            // Store the token in localStorage
            let token = data.token;  // Assuming the token is available directly under data.token
            let token_key = id;
            localStorage.setItem(token_key, token);

           

           

            console.log("token",token);

            // Navigate based on user type
            if (userType === 'Admin') {
                navigate(`/Admin/${token_key}/${id}/${userType}`);
            } else if (userType === 'Buyer') {
                navigate(`/${token_key}/${id}/${userType}`);
            } else if (userType === "Seller") {
                navigate(`/seller/${token_key}/${id}/${userType}`);
            }
            

        }

        return response.data; // Or handle the response as needed (e.g., store token)

    } catch (error) {
        // Handle errors
        console.error('Error during login:', error.response?.data || error.message);
        return null; // Or handle the error state as needed
    }
};

export default SignUp;
