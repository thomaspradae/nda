import React, { useState } from 'react';

//sending

function App() {
  // State to track form data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    maritalStatus: '',
    age: '',
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
      <h1>Government Document Filler</h1>
      
      {/* Final review page */}
      {showReview ? (
        <div>
          <h2>Review Your Submission</h2>
          <p><strong>Name:</strong> {formData.name}</p>
          <p><strong>Email:</strong> {formData.email}</p>
          <p><strong>Marital Status:</strong> {formData.maritalStatus}</p>
          <p><strong>Age:</strong> {formData.age}</p>
          <button onClick={handleSubmit}>Submit</button>
        </div>
      ) : (
        <form>
          {/* Section 1: Name and Email */}
          {currentSection >= 1 && (
            <div>
              <label htmlFor="name">Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              {formData.name && formData.email && (
                <button type="button" onClick={handleNextSection}>
                  Next
                </button>
              )}
            </div>
          )}

          {/* Section 2: Marital Status and Age */}
          {currentSection >= 2 && (
            <div>
              <label htmlFor="maritalStatus">Marital Status</label>
              <input
                type="text"
                id="maritalStatus"
                name="maritalStatus"
                value={formData.maritalStatus}
                onChange={handleChange}
                required
              />

              <label htmlFor="age">Age</label>
              <input
                type="number"
                id="age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
              />

              {formData.maritalStatus && formData.age && (
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

