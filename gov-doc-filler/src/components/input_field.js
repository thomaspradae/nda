import React from 'react';

const InputField = ({ question, formData, handleChange }) => {
  const { fieldType = 'text', name, options } = question;

  // Implement your input rendering logic here based on the fieldType
  // For example:
  if (fieldType === 'radio') {
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
  }

  // Add other field types as needed
  return (
    <input
      type={fieldType}
      name={name}
      value={formData[name] || ''}
      onChange={handleChange}
      className="styled-input"
    />
  );
};

export default InputField;
