import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const FillerLogin = () => {
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
      const response = await axios.post('http://localhost:5000/api/fillers/login', formData);
      const { token } = response.data;
      localStorage.setItem('token', token);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Error logging in:', error);
      alert(error.response?.data?.message || 'An error occurred');
    }
  };

  const handleGoogleSignIn = useCallback(async (response) => {
    try {
      const { credential: token } = response;
      const googleResponse = await axios.post('http://localhost:5000/api/google-login', { token });
      localStorage.setItem('token', googleResponse.data.token);
      navigate('/dashboard'); // Redirect to dashboard after successful login
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
          client_id: '451439771384-vk6ftioub9pqogjjcjfebl3anfp2qmiu.apps.googleusercontent.com', // Replace with your client ID
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
      <div ref={googleSignInRef} style={{ marginTop: '20px' }}></div>
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
