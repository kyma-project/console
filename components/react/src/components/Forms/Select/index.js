import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FieldWrapper, FieldLabel, FieldRequired } from '../field-components';

import { SelectWrapper, SelectField } from './components';

const Select = ({
  label,
  handleChange,
  name,
  items,
  current,
  firstEmptyValue,
  required,
  noBottomMargin,
}) => {
  const renderSelect = (
    <SelectField
      onChange={e => handleChange(e.target.value)}
      name={name}
      value={current ? current : ''}
    >
      {firstEmptyValue
        ? [
            <option key={''} value={''}>
              {'Select your option...'}
            </option>,
            ...items,
          ]
        : items}
    </SelectField>
  );

  return (
    <FieldWrapper noBottomMargin={noBottomMargin}>
      <FieldLabel>
        {label}
        {required ? <FieldRequired>*</FieldRequired> : ''}
      </FieldLabel>
      <SelectWrapper>{renderSelect}</SelectWrapper>
    </FieldWrapper>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  name: PropTypes.string,
  items: PropTypes.arrayOf(PropTypes.element),
  current: PropTypes.string,
  firstEmptyValue: PropTypes.bool,
  required: PropTypes.bool,
  noBottomMargin: PropTypes.bool,
};

export default Select;
