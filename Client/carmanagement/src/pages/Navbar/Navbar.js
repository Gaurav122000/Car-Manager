// Navbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  // Check if user is logged in on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleAuthButtonClick = () => {
    if (isLoggedIn) {
      // Logout logic
      localStorage.removeItem('token');
      setIsLoggedIn(false);
      navigate('/'); // Redirect to home after logout
    } else {
      // Navigate to login page
      navigate('/');
    }
  };

  return (
    <nav className="navbar">
      <h1 className="logo">Car Manager</h1>
      <ul className="nav-links">
        <li><a href="/">Home</a></li>
        <li><a href="/list">List</a></li>
        <li><a href="/create-car">Services</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
      <button className="auth-button" onClick={handleAuthButtonClick}>
        {isLoggedIn ? 'Logout' : 'User Login'}
      </button>
    </nav>
  );
};

export default Navbar;
