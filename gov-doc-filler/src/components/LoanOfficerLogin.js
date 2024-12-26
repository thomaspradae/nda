import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';

const LoanOfficerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/loan-officers/login', formData);
      setToken(response.data.token); // Store token
      navigate('/loan-officer/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
      alert(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div>
      <h2>Loan Officer Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input type="email" name="email" onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label>
          <input type="password" name="password" onChange={handleChange} required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Not a loan officer? <Link to="/log-in">Regular log in here</Link>
      </p>
      <button
        onClick={() => navigate('/loan-officer/register')}
        style={{
          marginTop: '10px',
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
        }}
      >
        Don't have a loan officer account? Register here
      </button>
    </div>
  );
};

export default LoanOfficerLogin;
