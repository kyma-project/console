import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import { FieldWrapper, FieldLabel, FieldRequired } from '../field-components';

import { SelectWrapper, SelectField } from './components';

const Select = ({
  label,
  handleChange,
  name,
  items,
  groupedItems,
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
      {(groupedItems || items) &&
        firstEmptyValue && [
          <option key={''} value={''}>
            {'Select your option...'}
          </option>,
        ]}

      {groupedItems &&
        groupedItems.map((group, index) => {
          return (
            group.items &&
            group.items.length > 0 && (
              <optgroup key={group.name} label={group.name}>
                {group.items}
              </optgroup>
            )
          );
        })}

      {items}
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
  groupedItems: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.element),
  current: PropTypes.string,
  firstEmptyValue: PropTypes.bool,
  required: PropTypes.bool,
  noBottomMargin: PropTypes.bool,
};

export default Select;
