import React from 'react';
import PropTypes from 'prop-types';

import { FormLabel, FormRadioGroup, Checkbox } from 'fundamental-react';

CheckboxFormControl.propTypes = {
  availableValues: PropTypes.object.isRequired,
  values: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default function CheckboxFormControl({
  availableValues,
  values,
  name,
  onChange,
}) {
  const updateValues = (value, checked) => {
    if (checked) {
      values = [...values, value];
    } else {
      values = values.filter(v => v !== value);
    }
    onChange(values);
  };

  return (
    <>
      <FormLabel htmlFor={name} required>
        {name}
      </FormLabel>
      <FormRadioGroup inline className="inline-radio-group">
        {Object.entries(availableValues).map(([value, displayName]) => (
          <Checkbox
            key={value}
            value={displayName}
            defaultChecked={values.includes(value)}
            onChange={e => updateValues(value, e.target.checked)}
          />
        ))}
      </FormRadioGroup>
    </>
  );
}
