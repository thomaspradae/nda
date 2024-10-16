import React, { useState } from 'react';
import './App.css';

//sending

function App() {
  // State to track form data
  const [formData, setFormData] = useState({
    name: '',
    day: '',
    month: '',
    year: '',
  });

  // State to track which section is currently unlocked
  const [currentSection, setCurrentSection] = useState(1);

  // State to track whether to show the final review page
  const [showReview, setShowReview] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Move to the next section
  const handleNextSection = () => {
    if (currentSection < 3) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowReview(true);  // Once all sections are done, show the review page
    }
  };

  // Submit the form to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.text();
      console.log(data);  // This is where you'll see the response from the backend 
    } catch (error) {
      console.error('Error:', error); 
    }
  };

  return (
    <div className="App">
      <h1 className="heading">Personal information</h1> 
      
      {/* Final review page */} 
      {showReview ? (
        <div>
          <h2>Review Your Submission</h2>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>birthdate:</strong> {'${formData.day}/${formatData.month}/${formatData.year}'}</p>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <form>
          {/* Section 1: Name and Birthdate */}
          {currentSection >= 1 && (
            <div className='form-section'>
              <label htmlFor="name">Enter your name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your name"
                className='input-field'
                required
              />

              <label>When were you born?</label>
              <div className='birthdate-fields'>
                <input
                  type="number"
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleChange}
                  placeholder="Day"
                  className="birthdate-input"
                  required
                />
                <input
                  type="number"
                  id="month"
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  placeholder="Month"
                  className="birthdate-input"
                  required
                />
                <input
                  type="number"
                  id="year"
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  placeholder="Year"
                  className="birthdate-input"
                  required
                />
              </div>

              {formData.name && formData.day && formData.month && formData.year && (
                <button type="button" onClick={handleNextSection}>
                  Review
                </button>
              )}
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default App;

