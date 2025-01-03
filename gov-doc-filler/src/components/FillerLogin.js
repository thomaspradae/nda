import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const FillerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/fillers/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirect to the register page
  };

  return (
    <div className="login-container">
      <h2>Filler Login</h2>
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
      <button onClick={handleRegisterRedirect} style={{ marginTop: '10px' }}>
        Don't have an account? Register here
      </button>
      <p style={{ marginTop: '10px' }}>
        Loan Officer? <Link to="/loan-officer/login">Log in here</Link>
      </p>
    </div>
  );
};

export default FillerLogin;
