// src/components/SectionsNavigator.js
import React from 'react';

const SectionsNavigator = ({
  sectionNames,
  sections,
  sectionTitles,
  handleNavigation,
}) => {
  return (
    <div className="sections-navigator">
      {sectionNames.map((sectionName, sectionIndex) => (
        <div key={sectionIndex} className="section-item">
          <div
            className="section-title"
            onClick={() => handleNavigation(sectionIndex, 0)}
          >
            {sectionTitles[sectionName] || sectionName}
          </div>
          <div className="subsections-list">
            {sections[sectionName].map((subsection, subIndex) => (
              <div
                key={subIndex}
                className="subsection-item"
                onClick={() => handleNavigation(sectionIndex, subIndex)}
              >
                {subsection.title || `Subsection ${subIndex + 1}`}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SectionsNavigator;
