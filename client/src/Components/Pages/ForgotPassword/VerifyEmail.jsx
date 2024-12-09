import { useState } from "react";
import EmailVerifyRoute from "../../functionalities/AdminFunctionalities/EmailVerificationRoute";

export default function EmailVerify() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null); // For handling error
  const [success, setSuccess] = useState(false); // For handling success message
  const [showToast, setShowToast] = useState(false); // To control toast visibility

  const handleVerificationSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      const emailVerified = await EmailVerifyRoute({ email });
      console.log("Email Verified:", emailVerified);
      setSuccess(true); // Set success state if email is verified successfully
      setError(null); // Reset error state

      // Show toast message for 3 seconds
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to verify email. Please try again.");
      setSuccess(false); // Reset success state if there is an error
    }
  };

  return (
    <div className="bg-gray-100 font-roboto h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg overflow-hidden shadow-lg">
        <div className="p-4 bg-blue-500 text-white text-center">
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
        </div>
        <div className="p-4">
          <form onSubmit={handleVerificationSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                name="email"
                placeholder="Enter your email"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {/* Show error message */}
            {error && (
              <div className="text-red-500 text-center mb-4">{error}</div>
            )}

            <div className="text-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                type="submit"
              >
                Verify Email
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div
          className="fixed bottom-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg"
          role="alert"
        >
          A reset link has been sent to your email!
        </div>
      )}
    </div>
  );
}
