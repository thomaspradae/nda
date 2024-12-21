import React, { useState } from 'react';

function LoanOfficerForm() {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleForm = () => setIsSignUp((prev) => !prev);

  const handleSignUp = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem('loan_officers')) || {};
    if (users[email]) {
      alert('An account with this email already exists.');
      return;
    }

    users[email] = { password };
    localStorage.setItem('loan_officers', JSON.stringify(users));
    alert('Account created successfully!');
    window.location.href = '/loan-officer/dashboard'; // Redirect
  };

  const handleSignIn = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    const users = JSON.parse(localStorage.getItem('loan_officers')) || {};
    if (users[email]?.password === password) {
      alert('Sign in successful!');
      window.location.href = '/loan-officer/dashboard'; // Redirect
    } else {
      alert('Invalid email or password.');
    }
  };

  return (
    <div>
      <h1>{isSignUp ? 'Sign Up' : 'Sign In'}</h1>
      <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <input type="email" name="email" placeholder="Email" required />
        <input type="password" name="password" placeholder="Password" required />
        <button type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
      </form>
      <button onClick={toggleForm}>
        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
      </button>
    </div>
  );
}

export default LoanOfficerForm;
