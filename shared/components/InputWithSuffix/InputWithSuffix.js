import React from 'react';
import './InputWithSuffix.scss';

export const InputWithSuffix = ({
  suffix,
  id,
  placeholder,
  required,
  pattern,
  _ref,
}) => {
  return (
    <div className="input-with-suffix">
      <input
        role="input"
        className="fd-form__control"
        id={id}
        placeholder={placeholder}
        required={required}
        pattern={pattern}
        type="text"
        ref={_ref}
        aria-required={required}
      />
      <span className="input-with-suffix__suffix">{suffix}</span>
    </div>
  );
};
