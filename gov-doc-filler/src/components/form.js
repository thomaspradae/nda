import React from 'react';
import Group from './Group';

const FormSection = ({
  currentSubPageContent,
  sectionTitles,
  sectionNames,
  currentSection,
  renderGroup,
  handlePreviousSubPage,
  handleNextSubPage,
}) => (
  <form onSubmit={(e) => e.preventDefault()}>
    <h2>{sectionTitles[sectionNames[currentSection]]}</h2>
    <h3>{currentSubPageContent.title}</h3>

    {currentSubPageContent.groups.map((group, groupIndex) =>
      renderGroup(group, groupIndex)
    )}

    <div className="buttons">
      {(currentSection > 0 || currentSubPageContent > 0) && (
        <button type="button" onClick={handlePreviousSubPage}>
          Back
        </button>
      )}
      <button type="button" onClick={handleNextSubPage}>
        Next
      </button>
    </div>
  </form>
);

export default FormSection;
