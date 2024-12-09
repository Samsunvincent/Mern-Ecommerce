import axios from "axios";

const EmailVerifyRoute = async (body) => {
  try {
    const response = await axios.post("http://localhost:3000/forgot-password", body, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log("response", response);
    return response; // Return the response to handle it in the component
  } catch (error) {
    console.error("Error in email verification request:", error);
    // Optional: Return a custom error message or rethrow the error
    throw new Error('Failed to send the verification email');
  }
};

export default EmailVerifyRoute;
