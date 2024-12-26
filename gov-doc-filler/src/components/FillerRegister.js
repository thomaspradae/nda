import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const FillerRegister = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/fillers/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      // Save token to localStorage and navigate to filler dashboard
      const { token } = response.data;
      localStorage.setItem('token', token);

      alert('Registration successful. Redirecting to your dashboard...');
      navigate('/filler/dashboard'); // Redirect to filler dashboard
    } catch (error) {
      console.error('Error registering:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  return (
    <div className="register-container">
      <h2>Filler Registration</h2>
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
        Already have an account? <Link to="/log-in">Log in here</Link>
      </p>
    </div>
  );
};

export default FillerRegister;
