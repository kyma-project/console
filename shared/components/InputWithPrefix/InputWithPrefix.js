import React from 'react';
import PropTypes from 'prop-types';
import './InputWithPrefix.scss';

export const InputWithPrefix = ({
  prefix,
  required,
  onChange,
  value,
  replacePrefix,
  ...props
}) => {
  if (replacePrefix && value.startsWith(prefix)) {
    value = value.substring(prefix.length);
  }

  const onValueChange = e => {
    if (replacePrefix) {
      const value = e.target.value;
      if (value.startsWith(prefix)) {
        e.target.value = value.substring(prefix.length);
      }
    }
    onChange && onChange(e);
  };

  return (
    <div className="input-with-prefix">
      <span className="input-with-prefix__prefix">{prefix}</span>
      <input
        data-prefix={prefix}
        role="input"
        className="fd-form__control"
        required={required}
        type="text"
        aria-required={required}
        onChange={onValueChange}
        value={value}
        {...props}
      />
    </div>
  );
};

InputWithPrefix.propTypes = {
  prefix: PropTypes.string.isRequired,
  required: PropTypes.bool,
  onChange: PropTypes.func,
  value: PropTypes.string,
  replacePrefix: PropTypes.bool,
};

InputWithPrefix.defaultProps = {
  required: false,
  replacePrefix: false,
};
