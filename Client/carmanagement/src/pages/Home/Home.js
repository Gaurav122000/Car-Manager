// Home.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Home.css';
import Navbar from '../Navbar/Navbar';

const Home = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin); // Toggle between login and signup forms
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      alert("User registered! You can log in now.");
      setIsLogin(true); // Switch to login form after successful registration
    } catch (err) {
      alert("Registration failed. User may already exist.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', loginData);
      localStorage.setItem('token', response.data.token); // Save token
      console.log(response.data.token);
      navigate('/list'); // Redirect
    } catch (err) {
      alert("Login failed. Check credentials.");
    }
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <Navbar/>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h2>Manage <span className="highlight">All your Cars.</span></h2>
          <p>One place for all your need...</p>
          <button className="join-button">Join Us</button>
        </div>

        {/* Login / Sign Up Form */}
        <div className="auth-form">
          {isLogin ? (
            // Login Form
            <form onSubmit={handleLogin}>
              <h3>Login Here</h3>
              <input 
                type="email" 
                placeholder="Enter Email Here" 
                value={loginData.email} 
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
              />
              <input 
                type="password" 
                placeholder="Enter Password Here" 
                value={loginData.password} 
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
              />
              <button type="submit" className="login-button">Login</button>
              <p className="toggle-text">
                Don't have an account? <span onClick={toggleForm}>Sign up here</span>
              </p>
            </form>
          ) : (
            // Sign Up Form
            <form onSubmit={handleSignUp}>
              <h3>Sign Up Here</h3>
              <input 
                type="text" 
                placeholder="Username" 
                value={formData.username} 
                onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
              />
              <input 
                type="email" 
                placeholder="Email" 
                value={formData.email} 
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
              />
              <input 
                type="password" 
                placeholder="Password" 
                value={formData.password} 
                onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
              />
              <button type="submit" className="login-button">Sign Up</button>
              <p className="toggle-text">
                Already have an account? <span onClick={toggleForm}>Login here</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
