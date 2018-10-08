import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { InputField } from '../Input/components';
import { FieldWrapper, FieldLabel } from '../field-components';

const Checkbox = ({ label, checked, handleChange }) => (
  <FieldWrapper>
    <FieldLabel>
      <InputField
        type="checkbox"
        checked={checked}
        onClick={() => handleChange()}
        onChange={() => null}
      />
      {label}
    </FieldLabel>
  </FieldWrapper>
);

Checkbox.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  checked: PropTypes.bool,
};

export default Checkbox;
