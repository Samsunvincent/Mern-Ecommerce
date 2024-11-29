import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from '../../functionalities/signUp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate(); // Get the navigate function

  const handleLogin = useCallback((event) => {
    event.preventDefault();
    
    const formData = {
      email,
      password,
    };

    // Call SignUp with form data and navigate function
    SignUp(formData, navigate);
  }, [email, password, navigate]);

  return (
    <div>
      <div className="w-25 container position-absolute top-50 start-50 translate-middle">
        <form onSubmit={handleLogin}>
          <div className="input-container pt-3">
            <input
              type="text"
              required
              autoComplete="off"
              name="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="email">Enter your email</label>
          </div>

          <div className="input-container pt-3">
            <input
              type="password"
              required
              autoComplete="off"
              name="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="password">Password</label>
          </div>

          <div className="pt-5 d-flex justify-content-center">
            <button type="submit" className="btn btn-dark create-account-button px-4 fw-bold">
              Login
            </button>
          </div>

          <div className="pt-3 text-center">
            <p>
              Don't have an account? <a href="./signin.html">Register Here</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
