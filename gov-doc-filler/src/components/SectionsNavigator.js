import React from 'react';

const SectionsNavigator = ({
  sectionNames,
  sections,
  sectionTitles,
  handleNavigation,
  currentSection,
  currentSubPage,
  completedSubsections,
  completedSections,
}) => {
  return (
    <div className="sections-navigator">
      {sectionNames.map((sectionName, sectionIndex) => {
        const isActiveSection = currentSection === sectionIndex;

        return (
          <div
            key={sectionIndex}
            className={`section-item ${
              isActiveSection ? 'active-section' : 'inactive-section'
            } ${completedSections[sectionIndex] ? 'completed-section' : ''}`}
            onClick={() => handleNavigation(sectionIndex, 0)}
          >
            {/* Inactive Circle */}
            {/* Inactive Circle */}
            {!isActiveSection && (
              <div
                className={`section-number inactive-number ${
                  completedSections[sectionIndex] ? 'completed-number' : ''
                }`}
              >
                {sectionIndex + 1}
              </div>
            )}
            <div className="section-title-container">
              {isActiveSection ? (
                <div className="active-title-wrapper">
                  <div className="upper-half">
                    {/* Active Circle */}
                    <div className="active-section-titles">
                      {sections[sectionName][currentSubPage]?.baseText && (
                        <p className="section-base-text">
                          {sections[sectionName][currentSubPage].baseText}
                        </p>
                      )}
                      {sections[sectionName][currentSubPage]?.boldText && (
                        <p className="section-bold-text">
                          <strong>{sections[sectionName][currentSubPage].boldText}</strong>
                        </p>
                      )}
                    </div>
                    <div className={`section-number active-number`}>
                      {sectionIndex + 1}
                    </div>
                  </div>
                  <div className="subsections-content">
                  <div className="active-pills">
                  {sections[sectionName].map((subpage, subIndex) => (
                    <div
                      key={subIndex}
                      className="pill-container"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent triggering section navigation
                        handleNavigation(sectionIndex, subIndex);
                      }}
                    >
                      <span
                        className={`subsection-pill ${
                          currentSubPage === subIndex
                            ? 'active-pill'
                            : completedSubsections[`${sectionIndex}-${subIndex}`]
                            ? 'completed-pill'
                            : 'inactive-pill'
                        }`}
                        title={subpage.title}
                      ></span>
                      <span className="subsection-title">{subpage.title}</span>
                    </div>
                  ))}
                  </div>
                  </div>
                </div>
              ) : (
                <div className="inactive-title-wrapper">
                  <div className="inactive-pills">
                    <span className="inactive-pill"></span>
                  </div>
                  <span className="inactive-title">{sectionTitles[sectionName] || sectionName}</span>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default SectionsNavigator;