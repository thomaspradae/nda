import React from 'react';
import InputField from './InputField';

const Question = ({
  question,
  questionIndex,
  groupIndex,
  formData,
  handleChange,
  toggleHelp,
  clickedHelp,
  isConditionMet,
}) => {
  if (!isConditionMet(question.condition)) return null;

  const layoutClass = `layout-${question.layout.replace('%', '')}`;
  const questionId = `${groupIndex}-${questionIndex}`;

  return (
    <div key={questionIndex} className={`question-container ${layoutClass}`}>
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
                  toggleHelp(questionId);
                }}
              >
                Close
              </span>
              <p className="question-help">{question.help}</p>
            </div>
          )}
        </div>
        <InputField
          question={question}
          formData={formData}
          handleChange={handleChange}
        />
      </div>
    </div>
  );
};

export default Question;
