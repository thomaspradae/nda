import React, { useState, useEffect } from 'react';
import '../App.css'; // Adjusted path to go up one directory
import SectionsNavigator from './SectionsNavigator'; // Adjusted path
import axios from 'axios';
import { sections, sectionTitles } from '../data/sections'; // Adjusted path
// import { getToken } from '../utils/auth';

function AppForm() {
  const sectionNames = Object.keys(sections);
  const totalSections = sectionNames.length;
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubPage, setCurrentSubPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [clickedHelp, setClickedHelp] = useState({});
  const [completedSubsections, setCompletedSubsections] = useState({});
  const [completedSections, setCompletedSections] = useState({});
  const [isReviewPage, setIsReviewPage] = useState(false); // New state variable
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [pdfLink, setPdfLink] = useState(null);


  const toggleHelp = (index) => {
    setClickedHelp((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const isSubsectionCompleted = (sectionIndex, subPageIndex) => {
    const subsection = sections[sectionNames[sectionIndex]][subPageIndex];
    const groups = subsection.groups;
  
    for (let group of groups) {
      if (!isConditionMet(group.condition)) continue;
      const questions = group.questions;
      for (let question of questions) {
        if (!isConditionMet(question.condition)) continue;
        const name = question.name || question.title;
  
        // Handle special cases
        if (name === 'dob') {
          if (
            !formData['dob-month'] ||
            !formData['dob-day'] ||
            !formData['dob-year']
          ) {
            return false;
          }
          continue; // Skip to the next question
        }
  
        if (name === 'ssn') {
          if (
            !formData['ssn-part1'] ||
            !formData['ssn-part2'] ||
            !formData['ssn-part3']
          ) {
            return false;
          }
          continue; // Skip to the next question
        }
  
        // Regular check for other questions
        if (!(name in formData) || formData[name] === '') {
          return false;
        }
      }
    }
    return true;
  };
  
  
  const isSectionCompleted = (sectionIndex) => {
    const totalSubPages = sections[sectionNames[sectionIndex]].length;
    for (let subPageIndex = 0; subPageIndex < totalSubPages; subPageIndex++) {
      const key = `${sectionIndex}-${subPageIndex}`;
      if (!completedSubsections[key]) {
        return false;
      }
    }
    return true;
  };
  

  const handleNavigation = (sectionIndex, subPageIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentSubPage(subPageIndex);
  };

  useEffect(() => {
    const newCompletedSubsections = {};
    const newCompletedSections = {};
  
    for (let sectionIndex = 0; sectionIndex < sectionNames.length; sectionIndex++) {
      const totalSubPages = sections[sectionNames[sectionIndex]].length;
      let sectionCompleted = true;
  
      for (let subPageIndex = 0; subPageIndex < totalSubPages; subPageIndex++) {
        const key = `${sectionIndex}-${subPageIndex}`;
        if (isSubsectionCompleted(sectionIndex, subPageIndex)) {
          newCompletedSubsections[key] = true;
          console.log(`Subsection completed: ${key}`);
        } else {
          sectionCompleted = false;
          console.log(`Subsection not completed: ${key}`);
        }
      }
  
      if (sectionCompleted) {
        newCompletedSections[sectionIndex] = true;
        console.log(`Section completed: ${sectionIndex}`);
      }
    }
  
    console.log('Completed Subsections:', newCompletedSubsections);
    console.log('Completed Sections:', newCompletedSections);
  
    setCompletedSubsections(newCompletedSubsections);
    setCompletedSections(newCompletedSections);
  }, [formData]);
  
  

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // For SSN parts, allow only digits and set specific lengths
    if (name.startsWith("ssn-part")) {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) return; // Prevents entering non-numeric characters
    }
  
    // Ensure max length for each SSN part
    if (name === 'ssn-part1' && value.length > 3) return;
    if (name === 'ssn-part2' && value.length > 2) return;
    if (name === 'ssn-part3' && value.length > 4) return;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  
  const handleNextSubPage = () => {
    const totalSubPages = sections[sectionNames[currentSection]].length;
    const questionKey = `${currentSection}-${currentSubPage}`;

    if (formData[sections[sectionNames[currentSection]][currentSubPage].title] && !answeredQuestions.has(questionKey)) {
      setAnsweredQuestions(new Set([...answeredQuestions, questionKey]));
    }

    if (currentSubPage < totalSubPages - 1) {
      setCurrentSubPage(currentSubPage + 1);
    } else if (currentSection < totalSections - 1) {
      setCurrentSection(currentSection + 1);
      setCurrentSubPage(0);
    } else {
      // We've reached the end of all sections and subpages
      setIsReviewPage(true); // Move to the review page
    }

    updateProgress();
 };

  const handlePreviousSubPage = () => {
    if (isReviewPage) {
      setIsReviewPage(false); // Go back from the review page
    } else if (currentSubPage > 0) {
      setCurrentSubPage(currentSubPage - 1);
    } else if (currentSection > 0) {
      const previousSection = currentSection - 1;
      setCurrentSection(previousSection);
      setCurrentSubPage(sections[sectionNames[previousSection]].length - 1);
    }
  };

  const updateProgress = () => {
    const totalQuestions = sectionNames.reduce((sum, section) => 
      sum + sections[section].reduce((subSum, subpage) => 
        subSum + subpage.groups.reduce((groupSum, group) => 
          groupSum + group.questions.length, 0), 0), 0);
    const completedQuestions = answeredQuestions.size;
    setProgress((completedQuestions / totalQuestions) * 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
  
    // Map formData keys to match backend expected keys
    const dataToSend = {
      name: formData.fullName,
      alternateNames: formData.alternateNames,
      dobMonth: formData['dob-month'],
      dobDay: formData['dob-day'],
      dobYear: formData['dob-year'],
      ssnPart1: formData['ssn-part1'],
      ssnPart2: formData['ssn-part2'],
      ssnPart3: formData['ssn-part3'],
      citizenship: formData.citizenship,
      maritalStatus: formData.maritalStatus,
      email: formData.email,
      employmentStatus: formData.employmentStatus,
      occupation: formData.occupation,
      annualIncome: formData.annualIncome,
      incomeSource: formData.incomeSource,
    };
  
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('User is not authenticated. Please log in.');
        return;
      }
  
      // Log payload and token for debugging
      console.log('Payload:', dataToSend);
      console.log('Token:', token);
  
      // Send data to the backend
      const response = await axios.post('http://localhost:5000/submit', dataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Ensure correct content type
        },
      });
  
      alert('Form submitted successfully!');
      console.log('Server response:', response.data);
  
      // Redirect or perform any other actions after successful submission
    } catch (error) {
      console.error('Error submitting form:', error.response?.data || error.message);
      alert(
        error.response?.data?.message || 'An error occurred during form submission.'
      );
    }
  };
  


  const Separator = ({ title }) => (
    <div className="separator">
      <hr />
      {title && <h4>{title}</h4>}
    </div>
  );

  const isConditionMet = (condition) => {
    if (!condition) return true; // No condition means always show
    const { field, value } = condition;
    return formData[field] === value;
  };

  const renderQuestion = (question, questionIndex, groupIndex) => {
    if (!isConditionMet(question.condition)) return null;
  
    const layoutClass = `layout-${question.layout.replace('%', '')}`;
    const questionId = `${groupIndex}-${questionIndex}`;
  
    return (
      <div
        key={questionIndex}
        className={`question-container ${layoutClass}`}
      >
        <div className="question-content">
          <div className="title-group" style={{ position: 'relative' }}>
            <div className="title-help-container">
              <label className="question-title">{question.title}</label>
              {question.help && (
                <span
                  className="help-text-trigger"
                  onClick={() => toggleHelp(questionId)}
                >
                  Need help?
                </span>
              )}
            </div>
            {question.subtitle && (
              <p className="question-subtitle">{question.subtitle}</p>
            )}
            {question.help && (
              <div
                className={`help-text ${
                  clickedHelp[questionId] ? 'visible' : ''
                }`}
              >
                <span
                  className="close-button"
                  onClick={() => {
                    setClickedHelp((prev) => ({
                      ...prev,
                      [questionId]: false,
                    }));
                  }}
                >
                  Close
                </span>
                <p className="question-help">{question.help}</p>
              </div>
            )}
          </div>
          {renderInput(question, questionIndex)}
        </div>
      </div>
    );
  };

  const renderInput = (question, questionIndex) => {
    if (!question) return null;
    if (!isConditionMet(question.condition)) return null;
  
    const { fieldType = 'text', options } = question;
    const name = question.name;
    
    if (!name) {
      console.error('Question is missing a name:', question);
      return null; // Skip rendering if name is missing
    }
      
    // Check for specific cases like Date of Birth, SSN, and other custom fields
    switch (question.title) {
      case 'Date of Birth':
        return (
          <div className="dob-inputs">
            <select
              name="dob-month"
              value={formData['dob-month'] || ''}
              onChange={handleChange}
              className="styled-select dob-select"
            >
              <option value="" disabled>Month</option>
              {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <span className="separator">-</span>
            <select
              name="dob-day"
              value={formData['dob-day'] || ''}
              onChange={handleChange}
              className="styled-select dob-select"
            >
              <option value="" disabled>Day</option>
              {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
            <span className="separator">-</span>
            <select
              name="dob-year"
              value={formData['dob-year'] || ''}
              onChange={handleChange}
              className="styled-select dob-select"
            >
              <option value="" disabled>Year</option>
              {Array.from({ length: 120 }, (_, i) => (new Date().getFullYear() - i).toString()).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        );
      case 'Social Security Number':
        return (
          <div className="ssn-inputs">
            <input
              type="text"
              name="ssn-part1"
              placeholder="XXX"
              value={formData['ssn-part1'] || ''}
              onChange={handleChange} 
              className="ssn-part"
              maxLength={3}
              pattern="\d{3}" // Ensures the value is numeric
            />
            <span className="separator">-</span>
            <input
              type="text"
              name="ssn-part2"
              placeholder="XX"
              value={formData['ssn-part2'] || ''}
              onChange={handleChange}
              className="ssn-part"
              maxLength={2}
              pattern="\d{2}" // Ensures the value is numeric
            />
            <span className="separator">-</span>
            <input
              type="text"
              name="ssn-part3"
              placeholder="XXXX"
              value={formData['ssn-part3'] || ''}
              onChange={handleChange}
              className="ssn-part"
              maxLength={4}
              pattern="\d{4}" // Ensures the value is numeric
            />
          </div>
        );
      case 'Citizenship':
        return (
          <select
            name="citizenship"
            value={formData['citizenship'] || ''}
            onChange={handleChange}
            className="styled-select"
          >
            <option value="" disabled>Select Citizenship</option>
            <option value="U.S. Citizen">U.S. Citizen</option>
            <option value="Permanent Resident Alien">Permanent Resident Alien</option>
            <option value="Non-Permanent Resident Alien">Non-Permanent Resident Alien</option>
          </select>
        );
      default:
        // Check for fieldType and handle different types like radio, select, date, etc.
        switch (fieldType) {
          case 'radio':
            return (
              <div className="radio-group">
                {options.map((option, idx) => (
                  <label key={idx} className="radio-label">
                    <input
                      type="radio"
                      name={name}
                      value={option}
                      checked={formData[name] === option}
                      onChange={handleChange}
                    />
                    {option}
                  </label>
                ))}
              </div>
            );
          case 'date':
            return (
              <input
                type="date"
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                className="styled-date"
              />
            );
          case 'select':
            return (
              <select
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                className="styled-select"
              >
                <option value="" disabled>Select an option</option>
                {options.map((option, idx) => (
                  <option key={idx} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            );
          default:
            return (
              <input
                type="text"
                name={name}
                value={formData[name] || ''}
                onChange={handleChange}
                className="styled-input"
              />
            );
        }
    }
  };   
  

  const renderGroup = (group, groupIndex) => {
    const isVisible = isConditionMet(group.condition);
  
    return (
      <React.Fragment key={groupIndex}>
        <div
          className={`form-wrapper group-transition ${
            isVisible ? 'visible' : 'hidden'
          }`}
        >
          {group.questions.map((question, questionIndex) => {
            return renderQuestion(question, questionIndex, groupIndex);
          })}
        </div>
  
        {/* Add separator after the third group */}
        {groupIndex === 2 && <Separator title="Current Address" />}
      </React.Fragment>
    );
  };

  const currentSubPageContent = sections[sectionNames[currentSection]][currentSubPage];
  const { baseText, boldText } = currentSubPageContent || {};

  return (
    <div className="App">
      <div className="main-content">
        <div className="form-section">
          <div className="progress-val">
          <h2 className="progress-title">Your progress</h2>
          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {Math.round(progress)}%
          </div>
          </div>
          <p className="progress-subtitle">
          In case you need to review or change any of your answers, 
          below is the form's navigation. Simply click on a section to navigate to it and view its subsections. 
          You'll also have the option to review all your answers in a final section before submitting.
          </p>
            <SectionsNavigator
              sectionNames={sectionNames}
              sections={sections}
              sectionTitles={sectionTitles}
              handleNavigation={handleNavigation}
              currentSection={currentSection}       // Pass currentSection
              currentSubPage={currentSubPage}       // Pass currentSubPage
              completedSubsections={completedSubsections} // Pass completedSubsections
              completedSections={completedSections}       // Pass completedSections
            />
          <form onSubmit={(e) => e.preventDefault()}>
          <hr className="startseparator"></hr>
          {isReviewPage ? (
            <>
              <h2>Review Your Information</h2>
              <div className="review-page">
                {Object.entries(formData).map(([key, value]) => (
                  <div key={key} className="review-item">
                    <strong>{key.replace(/-/g, ' ')}:</strong> {value}
                  </div>
                ))}
              </div>
              <div className="buttons">
                <button
                  type="button"
                  onClick={handlePreviousSubPage}
                  className="navigation-button back-button"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="navigation-button submit-button"
                >
                  Submit
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Render the form fields */}
              {currentSubPageContent && currentSubPageContent.groups.map((group, groupIndex) => (
                renderGroup(group, groupIndex)
              ))}

              <div className="buttons">
                {(currentSection > 0 || currentSubPage > 0) && (
                  <button
                    type="button"
                    onClick={handlePreviousSubPage}
                    className="navigation-button back-button"
                  >
                    Back
                  </button>
                )}
                <button
                  type="button"
                  onClick={handleNextSubPage}
                  className="navigation-button next-button"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  </div>
);
}

export default AppForm;