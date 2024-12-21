import React, { useState } from 'react';
import './App.css';

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
  // ... other sections
};

const sectionTitles = {
  personalInfo: 'Personal Information',
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
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [activeHelp, setActiveHelp] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    if (name.startsWith("ssn-part")) {
      const regex = /^[0-9]*$/;
      if (!regex.test(value)) return;
    }
  
    if (name === 'ssn-part1' && value.length > 3) return;
    if (name === 'ssn-part2' && value.length > 2) return;
    if (name === 'ssn-part3' && value.length > 4) return;
  
    setFormData({
      ...formData,
      [name]: value,
    });
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

  const handleSectionClick = (sectionIndex, subPageIndex = 0) => {
    setCurrentSection(sectionIndex);
    setCurrentSubPage(subPageIndex);
  };

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const toggleHelp = (questionId) => {
    setActiveHelp(activeHelp === questionId ? null : questionId);
  };

  const Separator = ({ title }) => (
    <div className="separator">
      <hr />
      {title && <h4>{title}</h4>}
    </div>
  );

  const renderInput = (question) => {
    switch (question.title) {
      case 'Date of Birth':
        return (
          <div className="dob-inputs">
            <select name="dob-month" value={formData['dob-month'] || ''} onChange={handleChange} className="styled-select dob-select">
              <option value="" disabled>Month</option>
              {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
            <span className="separator">-</span>
            <select name="dob-day" value={formData['dob-day'] || ''} onChange={handleChange} className="styled-select dob-select">
              <option value="" disabled>Day</option>
              {Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0')).map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <span className="separator">-</span>
            <select name="dob-year" value={formData['dob-year'] || ''} onChange={handleChange} className="styled-select dob-select">
              <option value="" disabled>Year</option>
              {Array.from({ length: 120 }, (_, i) => (new Date().getFullYear() - i).toString()).map((year) => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        );
      case 'Social Security Number':
        return (
          <div className="ssn-inputs">
            <input type="text" name="ssn-part1" placeholder="XXX" value={formData['ssn-part1'] || ''} onChange={handleChange} className="ssn-part" maxLength={3} />
            <span className="separator">-</span>
            <input type="text" name="ssn-part2" placeholder="XX" value={formData['ssn-part2'] || ''} onChange={handleChange} className="ssn-part" maxLength={2} />
            <span className="separator">-</span>
            <input type="text" name="ssn-part3" placeholder="XXXX" value={formData['ssn-part3'] || ''} onChange={handleChange} className="ssn-part" maxLength={4} />
          </div>
        );
      default:
        return (
          <input
            type="text"
            name={question.title}
            value={formData[question.title] || ''}
            onChange={handleChange}
            className="styled-input"
            placeholder={question.subtitle}
          />
        );
    }
  };

  const renderGroup = (group, groupIndex) => {
    return (
      <React.Fragment key={groupIndex}>
        <div className="form-wrapper">
          {group.questions.map((question, questionIndex) => {
            const layoutClass = `layout-${question.layout.replace('%', '')}`;
            const questionId = `${groupIndex}-${questionIndex}`;
            const isHelpActive = activeHelp === questionId;
            return (
              <div key={questionIndex} className={`question-container ${layoutClass}`}>
                <div className="question-content">
                  <div className="title-group">
                    <div className="title-help-container">
                      <label className="question-title">{question.title}</label>
                      {question.help && (
                        <button 
                          className="help-icon"
                          onClick={() => toggleHelp(questionId)}
                        >
                          ?
                        </button>
                      )}
                    </div>
                    <p className="question-subtitle">{question.subtitle}</p>
                  </div>
                  {renderInput(question)}
                </div>
                {question.help && (
                  <div className={`help-drawer ${isHelpActive ? 'active' : ''}`}>
                    <p>{question.help}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
          <button className="toggle-sidebar" onClick={toggleSidebar}>
            {sidebarVisible ? 'Hide Sidebar' : 'Show Sidebar'}
          </button>
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

        {sidebarVisible && (
          <div className="sidebar">
            <ul>
              {sectionNames.map((section, sectionIndex) => (
                <li key={sectionIndex}>
                  <div
                    className={`section-title ${sectionIndex === currentSection ? 'active' : ''}`}
                    onClick={() => handleSectionClick(sectionIndex)}
                  >
                    {sectionIndex + 1}. {sectionTitles[section]}
                  </div>
                  <ul className="subpages-list">
                    {sections[section].map((subpage, subpageIndex) => (
                      <li
                        key={`${sectionIndex}-${subpageIndex}`}
                        className={sectionIndex === currentSection && subpageIndex === currentSubPage ? 'active-subpage' : ''}
                        onClick={() => handleSectionClick(sectionIndex, subpageIndex)}
                      >
                        {subpageIndex + 1}. {subpage.title}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;