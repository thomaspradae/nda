import React from 'react';
import Question from './Question';

const Group = ({
  group,
  groupIndex,
  renderQuestion,
  isConditionMet,
  Separator,
}) => {
  const isVisible = isConditionMet(group.condition);

  return (
    <React.Fragment key={groupIndex}>
      <div
        className={`form-wrapper group-transition ${
          isVisible ? 'visible' : 'hidden'
        }`}
      >
        {group.questions.map((question, questionIndex) =>
          renderQuestion(question, questionIndex, groupIndex)
        )}
      </div>

      {/* Add separator after the third group */}
      {groupIndex === 2 && <Separator title="Current Address" />}
    </React.Fragment>
  );
};

export default Group;
