import React from 'react';
import PropTypes from 'prop-types';
import CustomPropTypes from './../../typechecking/CustomPropTypes';

export const Input = ({ required, _ref, ...props }) => {
  return (
    <div>
      <input
        role="input"
        className="fd-form__control"
        required={required}
        type="text"
        ref={_ref}
        aria-required={required}
        {...props}
      />
    </div>
  );
};

Input.propTypes = {
  suffix: PropTypes.string.isRequired,
  required: PropTypes.bool,
  _ref: CustomPropTypes.ref,
};

Input.defaultProps = {
  required: false,
};
