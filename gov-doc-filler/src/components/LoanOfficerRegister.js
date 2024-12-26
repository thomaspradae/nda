import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const LoanOfficerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      await axios.post('http://localhost:5000/api/loan-officers/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      alert('Registration successful. Please log in.');
      navigate('/loan-officer/login'); // Redirect to loan officer login
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
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Confirm Password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Not a loan officer? <Link to="/log-in">Regular log in here</Link>
      </p>
      <p>
        Already have a loan officer account? <Link to="/loan-officer/login">Log in here</Link>
      </p>
    </div>
  );
};

export default LoanOfficerRegister;
