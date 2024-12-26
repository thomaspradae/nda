import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { setToken } from '../utils/auth';

const LoanOfficerLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const googleSignInRef = useRef();
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

  const handleGoogleSignIn = useCallback(async (response) => {
    try {
      const { credential: token } = response;
      const googleResponse = await axios.post('http://localhost:5000/api/google-login', { token });
      setToken(googleResponse.data.token); // Store token
      navigate('/loan-officer/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Google Sign-In Error:', error);
      alert('Google Sign-In failed.');
    }
  }, [navigate]);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: '451439771384-vk6ftioub9pqogjjcjfebl3anfp2qmiu.apps.googleusercontent.com', // Replace with your Google Client ID
          callback: handleGoogleSignIn,
        });
        window.google.accounts.id.renderButton(googleSignInRef.current, {
          theme: 'outline',
          size: 'large',
        });
      }
    };

    return () => document.body.removeChild(script);
  }, [handleGoogleSignIn]);

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
      <div ref={googleSignInRef} style={{ marginTop: '20px' }}></div>
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
