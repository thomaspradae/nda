// src/components/LoanOfficerRegister.js

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoanOfficerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate(); // Initialize navigate

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/loan-officers/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/loan-officer/login'); // Use navigate instead of history.push
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="register-container">
      <h2>Loan Officer Registration</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input type="text" name="name" onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default LoanOfficerRegister;
