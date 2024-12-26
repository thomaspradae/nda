import React, { useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../loginstyle.css';

function MainLogIn() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const googleSignInRef = useRef();
  const navigate = useNavigate();

  const toggleForm = () => setIsSignUp((prev) => !prev);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isSignUp ? '/api/register' : '/api/login';

    if (isSignUp && formData.password !== formData.confirmPassword) {
      alert('Passwords do not match.');
      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000${endpoint}`, formData);
      localStorage.setItem('token', response.data.token);
      const { role } = response.data.user;
      navigate(role === 'loan_officer' ? '/loan-officer/dashboard' : '/select-loan-officer');
    } catch (error) {
      console.error('Error during authentication:', error.response?.data || error.message);
      alert(error.response?.data?.message || 'Authentication failed');
    }
  };

  const handleGoogleSignIn = useCallback(async (response) => {
    try {
      const { credential: token } = response;
      const googleResponse = await axios.post('http://localhost:5000/api/google-login', { token });
      localStorage.setItem('token', googleResponse.data.token);
      const { role } = googleResponse.data.user;
      navigate(role === 'loan_officer' ? '/loan-officer/dashboard' : '/select-loan-officer');
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
          client_id: '451439771384-vk6ftioub9pqogjjcjfebl3anfp2qmiu.apps.googleusercontent.com',
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
    <div className="login-page">
      <div className="main-container">
        <div className={`left-section form-section ${isSignUp ? 'sign-up active' : 'sign-in active'}`}>
          <h1>{isSignUp ? 'Create an account' : 'Welcome'}</h1>
          <p>{isSignUp ? 'Please enter your details to sign up.' : 'Please sign in to continue.'}</p>

          <form onSubmit={handleSubmit}>
  {isSignUp && (
    <>
      <input
        type="text"
        name="name"
        placeholder="Enter your name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <select
        name="role"
        value={formData.role}
        onChange={handleChange}
        required
      >
        <option value="" disabled>Select Role</option>
        <option value="filler">Filler</option>
        <option value="loan_officer">Loan Officer</option>
      </select>
    </>
  )}
  <input
    type="email"
    name="email"
    placeholder="Email"
    value={formData.email}
    onChange={handleChange}
    required
  />
  <input
    type="password"
    name="password"
    placeholder="Password"
    value={formData.password}
    onChange={handleChange}
    required
  />
  {isSignUp && (
    <input
      type="password"
      name="confirmPassword"
      placeholder="Re-enter your password"
      value={formData.confirmPassword}
      onChange={handleChange}
      required
    />
  )}
  <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
</form>


          <div ref={googleSignInRef} style={{ margin: '20px 0' }}></div>

          <p>
            Loan officer?{' '}
            <a href={isSignUp ? '/loan-officer/register' : '/loan-officer/login'}>
              {isSignUp ? 'Create an account here' : 'Sign in here'}
            </a>
          </p>
          <button onClick={toggleForm}>
            {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </button>
        </div>

        <div className="right-section">
          <video autoPlay muted loop>
            <source src="assets/house3.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}

export default MainLogIn;
