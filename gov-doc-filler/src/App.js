import React, { useState, useEffect } from 'react';
import './App.css';
import SectionsNavigator from './components/SectionsNavigator';


const sections = {
  personalInfo: [
    {
      groups: [
        {
          questions: [
            {
              title: 'Name',
              subtitle: '(First, Middle, Last, Suffix)',
              layout: '50%',
              help: 'Please provide your full legal name as it appears on your government ID.'
            },
            {
              title: 'Alternate Names',
              subtitle: '(First, Middle, Last, Suffix) - List any names by which you are known or any names under which credit was previously received',
              layout: '50%',
              help: 'Please provide any other names you have used or are known by.'
            },
          ],
        },
        {
          questions: [
            {
              title: 'Date of Birth',
              subtitle: '(mm-dd-yyyy)',
              layout: '50%',
            },
            {
              title: 'Social Security Number',
              subtitle: '(or Individual Taxpayer Identification Number)',
              layout: '50%',
            },
          ],
        },
        {
          questions: [
            {
              title: 'Marital Status',
              layout: '25%',
            },
            {
              title: 'Dependents',
              layout: '25%',
            },
          ],
        },
        {
          questions: [
            {
              title: 'Street',
              layout: '75%',
            },
            {
              title: '# Unit',
              layout: '25%',
            },
          ],
        },
        {
          questions: [
            {
              title: 'City',
              layout: '33%',
            },
            {
              title: 'State',
              layout: '33%',
            },
            {
              title: 'ZIP Code',
              layout: '33%',
            },
          ],
        },
        {
          questions: [
            {
              title: 'Have you served in the military?',
              layout: '100%',
              fieldType: 'radio',
              options: ['Yes', 'No'],
              name: 'militaryService',
            },
          ],
        },
        {
          condition: {
            field: 'militaryService',
            value: 'Yes',
          },

          questions: [
            {
              title: 'Branch of Service',
              layout: '50%',
              fieldType: 'text',
              name: 'branchOfService',
            },
            {
              title: 'Rank at Discharge',
              layout: '50%',
              fieldType: 'text',
              name: 'rankAtDischarge',
            },
            {
              title: 'Service Start Date',
              layout: '50%',
              fieldType: 'date',
              name: 'serviceStartDate',
            },
            {
              title: 'Service End Date',
              layout: '50%',
              fieldType: 'date',
              name: 'serviceEndDate',
            },
            // Add more military service-related questions as needed
          ],
        },
      ],
    },
    {
      title: 'Contact Information',
      groups: [
        {
          questions: [
            {
              title: 'Email',
              layout: '100%',
            },
          ],
        },
      ],
    },
  ],
  incomeSection: [
    {
      title: 'Income Information',
      groups: [
        {
          questions: [
            {
              title: 'Employment Status',
              layout: '50%',
              fieldType: 'radio',
              options: ['Employed', 'Unemployed', 'Self-Employed', 'Retired'],
              name: 'employmentStatus',
            },
            {
              title: 'Occupation',
              layout: '50%',
            },
          ],
        },
      ],
    },
    {
      title: 'Income Details',
      groups: [
        {
          questions: [
            {
              title: 'Annual Income',
              layout: '50%',
            },
            {
              title: 'Income Source',
              layout: '50%',
            },
          ],
        },
      ],
    }
  ],
  carlosSection: [
    {
      title: 'Carlos Information',
      groups: [
        {
          questions: [
            {
              title: 'Carlos Status',
              layout: '50%',
              fieldType: 'radio',
              options: ['Carlos', 'Not Carlos'],
              name: 'carlosStatus',
            },
            {
              title: 'Carlos Occupation',
              layout: '50%',
            },
          ],
        },
      ],
    }

  ],
};

const sectionTitles = {
  personalInfo: 'Personal Information',
  incomeSection: 'Income Information',
  carlosSection: 'Carlos Information',
  // ... other section titles
};

function App() {
  const sectionNames = Object.keys(sections);
  const totalSections = sectionNames.length;
  const [currentSection, setCurrentSection] = useState(0);
  const [currentSubPage, setCurrentSubPage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [formData, setFormData] = useState({});
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [clickedHelp, setClickedHelp] = useState({});

  const toggleHelp = (index) => {
    setClickedHelp((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleNavigation = (sectionIndex, subPageIndex) => {
    setCurrentSection(sectionIndex);
    setCurrentSubPage(subPageIndex);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest('.help-text') &&
        !event.target.closest('.help-text-trigger')
      ) {
        setClickedHelp({});
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
    }

    updateProgress();
  };

  const handlePreviousSubPage = () => {
    if (currentSubPage > 0) {
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
    e.preventDefault();
    console.log(formData);
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
  
    const { fieldType = 'text', name, options } = question;
  
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

  return (
    <div className="App">
      <div className="main-content">
        <div className="form-section">
          <h1>Document Filler</h1>

            <SectionsNavigator
              sectionNames={sectionNames}
              sections={sections}
              sectionTitles={sectionTitles}
              handleNavigation={handleNavigation}
            />

          <div className="progress-bar" style={{ width: `${progress}%` }}>
            {Math.round(progress)}%
          </div>
          <form onSubmit={handleSubmit}>
            <h2>{sectionTitles[sectionNames[currentSection]]}</h2>
            <h3>{currentSubPageContent.title}</h3>

            {currentSubPageContent.groups.map((group, groupIndex) => (
              renderGroup(group, groupIndex)
            ))}

            <div className="buttons">
              {(currentSection > 0 || currentSubPage > 0) && (
                <button type="button" onClick={handlePreviousSubPage}>
                  Back
                </button>
              )}
              <button type="button" onClick={handleNextSubPage}>
                Next
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;