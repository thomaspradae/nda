import React from 'react';

const Sidebar = ({
  sectionNames,
  currentSection,
  currentSubPage,
  handleSectionClick,
  sectionTitles,
  sections,
  sidebarVisible,
}) => (
  <div className={`sidebar ${sidebarVisible ? 'visible' : 'hidden'}`}>
    <ul>
      {sectionNames.map((section, sectionIndex) => (
        <li key={sectionIndex}>
          <div
            className={`section-title ${
              sectionIndex === currentSection ? 'active' : ''
            }`}
            onClick={() => handleSectionClick(sectionIndex)}
          >
            {sectionIndex + 1}. {sectionTitles[section]}
          </div>
          <ul className="subpages-list">
            {sections[section].map((subpage, subpageIndex) => (
              <li
                key={`${sectionIndex}-${subpageIndex}`}
                className={
                  sectionIndex === currentSection &&
                  subpageIndex === currentSubPage
                    ? 'active-subpage'
                    : ''
                }
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
);

export default Sidebar;
