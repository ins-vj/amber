"use client";
import React, { useState } from 'react';
import Spline from '@splinetool/react-spline/next';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === 'test@example.com' && password === 'password123') {
      // Handle successful login
    } else {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex w-full h-screen">
      {/* Right Half - Spline Model */}
      <div className="w-1/2 h-full">
        <Spline
          scene="https://prod.spline.design/RDgrQ7VBrW9D-a90/scene.splinecode" 
          className="w-full h-full"
        />
      </div>

      {/* Left Half - Login Form */}
      <div className="w-1/2 flex items-center justify-center bg-[#f8bcac] bg-opacity-90 border rounded-lg">
        <div className="w-3/4 space-y-4 p-8 rounded">
          <h2 className="text-2xl font-bold text-center text-white">Login</h2>
          {/* {error && <p className="text-red-500">{error}</p>} */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-white">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <div>
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-white">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
