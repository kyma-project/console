import React from 'react';
import PropTypes from 'prop-types';

import { FormSet, FormItem, FormLabel, FormSelect } from 'fundamental-react';

const Select = ({
  label,
  handleChange,
  name,
  items,
  disabled,
  groupedItems,
  firstEmptyValue,
  placeholderText,
  required,
}) => {
  const randomId = `select-${(Math.random() + 1).toString(36).substr(2, 5)}`;
  const renderSelect = (
    <FormSelect
      id={randomId}
      onChange={e => handleChange(e.target.value)}
      name={name}
      disabled={disabled}
    >
      {(groupedItems || items) &&
        firstEmptyValue && [
          <option key={''} value={''}>
            {placeholderText || 'Select your option...'}
          </option>,
        ]}

      {groupedItems &&
        groupedItems.map(group => {
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
    </FormSelect>
  );

  return (
    <FormSet>
      <FormItem>
        <FormLabel htmlFor={randomId} required={required}>
          {label}
        </FormLabel>
        {renderSelect}
      </FormItem>
    </FormSet>
  );
};

Select.propTypes = {
  label: PropTypes.string.isRequired,
  handleChange: PropTypes.func,
  name: PropTypes.string,
  groupedItems: PropTypes.object,
  items: PropTypes.arrayOf(PropTypes.element),
  placeholderText: PropTypes.string,
  disabled: PropTypes.bool,
  firstEmptyValue: PropTypes.bool,
  required: PropTypes.bool,
  noBottomMargin: PropTypes.bool,
};

export default Select;
