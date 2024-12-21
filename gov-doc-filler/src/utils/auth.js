// src/utils/auth.js

// Store token to localStorage
export const setToken = (token) => {
    localStorage.setItem('token', token);
  };
  
  // Retrieve token from localStorage
  export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  // Remove token (logout functionality)
  export const removeToken = () => {
    localStorage.removeItem('token');
  };
  