import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SignUp from '../../functionalities/signUp';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = useCallback((event) => {
    event.preventDefault();

    const formData = {
      email,
      password,
    };

    SignUp(formData, navigate);
  }, [email, password, navigate]);

  const handleRegister = useCallback(() => {
    navigate(`/signin`)
  })

  const handleForgotPassword = useCallback(() => {
    navigate('/verifyEmail'); // Navigate to the forgotPassword page
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-[400px] p-8">
        <form onSubmit={handleLogin}>
          <div className="relative mb-6">
            <input
              type="text"
              required
              autoComplete="off"
              name="email"
              id="email"
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 peer"
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor="email"
              className="absolute left-4 top-3 px-2 text-gray-500 bg-white peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:bg-white peer-focus:px-2 transition-all"
            >
              Enter your email
            </label>
          </div>

          <div className="relative mb-6">
            <input
              type="password"
              required
              autoComplete="off"
              name="password"
              id="password"
              className="w-full px-4 py-3 border-2 border-gray-400 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-300 peer"
              onChange={(e) => setPassword(e.target.value)}
            />
            <label
              htmlFor="password"
              className="absolute left-4 top-3 px-2 text-gray-500 bg-white peer-focus:-translate-y-4 peer-focus:scale-90 peer-focus:bg-white peer-focus:px-2 transition-all"
            >
              Password
            </label>
          </div>

          <div className="flex justify-center pt-6">
            <button
              type="submit"
              className="px-6 py-2 text-white bg-gray-900 rounded-full font-bold"
            >
              Login
            </button>
          </div>

          <div className="pt-4 text-center">
            <p>
              Don't have an account?{' '}
              <a href="" onClick={handleRegister} className="text-blue-500 hover:underline">
                Register Here
              </a>
            </p>
            <p className="pt-3">
              <a href="" onClick={handleForgotPassword}>Forgot Password?</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
