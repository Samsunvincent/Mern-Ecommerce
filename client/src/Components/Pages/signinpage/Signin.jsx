import { useEffect, useReducer, useCallback, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import GetUserTypes from "../../functionalities/getUserTypes";
import Register from "../../functionalities/Register";
import { Link } from "react-router-dom";
// Initial form state
const initialFormState = {
    name: '',
    email: '',
    password: '',
    phone: '',
    userType: '',
};

// Reducer to manage form state
const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            return { ...state, [action.field]: action.value };
        case 'RESET_FORM':
            return initialFormState;
        default:
            return state;
    }
};

export default function Signin() {
    const [formData, dispatch] = useReducer(formReducer, initialFormState);
    const [userTypes, setUserTypes] = useState([]);
    const [passwordVisible, setPasswordVisible] = useState(false); // Track password visibility

    // Fetch user types once on mount
    useEffect(() => {
        const fetchUserTypes = async () => {
            const types = await GetUserTypes(); // Call the asynchronous function
            setUserTypes(types); // Update state with the fetched user types
        };
        fetchUserTypes();
    }, []);

    // Memoized handler to update form fields
    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        dispatch({ type: 'SET_FIELD', field: name, value });
    }, []);

    // Form submission handler
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        const register = await Register(formData);
        console.log("Form Data:", formData);
    }, [formData]);

    // Toggle password visibility
    const togglePasswordVisibility = () => {
        setPasswordVisible(prevState => !prevState); // Toggle between true/false
    };

    return (
        <div className="container">
            {/* Form Row */}
            <div className="row">
                <div className="col-4" />
                <div className="col-4">
                    <h2 className="pt-3 fs-2 fw-light text-center">
                        Now let's make you a Nike Member.
                    </h2>
                    <form onSubmit={handleSubmit} className="w-100 pt-3">
                        {/* Input Fields */}
                        {['name', 'email', 'phone'].map((field, index) => (
                            <div className="inputGroup pt-3" key={index}>
                                <input
                                    type={field === 'password' ? (passwordVisible ? 'text' : 'password') : 'text'} // Dynamically change input type
                                    required
                                    autoComplete="off"
                                    name={field}
                                    id={field}
                                    value={formData[field]}
                                    onChange={handleChange}
                                />
                                <label htmlFor={field}>
                                    {`Enter your ${field === 'phone' ? 'Phone Number' : field}`}
                                </label>
                            </div>
                        ))}

                        {/* Password Field with Toggle */}
                        <div className="inputGroup pt-3" style={{ position: 'relative' }}>
                            <input
                                type={passwordVisible ? 'text' : 'password'}
                                required
                                autoComplete="off"
                                name="password"
                                id="password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <label htmlFor="password">Password</label>
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{
                                    position: 'absolute',
                                    right: '10px',
                                    top: '40px',
                                    border: 'none',
                                    background: 'transparent',
                                    cursor: 'pointer',
                                }}
                            >
                                {passwordVisible ? (
                                    <FaEye size={20} style={{ color: 'black' }} /> // Change the color of the eye icon
                                ) : (
                                    <FaEyeSlash size={20} style={{ color: 'black' }} /> // Change the color of the eye icon
                                )}
                            </button>
                        </div>

                        {/* User Type Dropdown */}
                        <div className="inputGroup pt-3">
                            <select
                                value={formData.userType}
                                onChange={handleChange}
                                required
                                name="userType"
                                id="userType"
                            >
                                <option value="" disabled>Select User Type</option>
                                {userTypes.length > 0
                                    ? userTypes.map((type, index) => (
                                        <option key={index} value={type.userType}>
                                            {type.userType}
                                        </option>
                                    ))
                                    : <option>Loading...</option>}
                            </select>
                            <label htmlFor="userType">User Type</label>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-5 d-flex justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-dark create-account-button px-4 fw-bold"
                            >
                                Create Account
                            </button>
                        </div>

                        {/* Login Link */}
                        <div className="pt-3 text-center">
                        <Link to={"/Login"}>Already have an account</Link>
                        </div>
                    </form>
                </div>
                <div className="col-4" />
            </div>
        </div>
    );
}
