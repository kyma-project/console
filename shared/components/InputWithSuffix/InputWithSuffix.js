import React from 'react';
import './InputWithSuffix.scss';

export const InputWithSuffix = ({ suffix, required, _ref, ...props }) => {
  return (
    <div className="input-with-suffix">
      <input
        role="input"
        className="fd-form__control"
        required={required}
        type="text"
        ref={_ref}
        aria-required={required}
        {...props}
      />
      <span className="input-with-suffix__suffix">{suffix}</span>
    </div>
  );
};
