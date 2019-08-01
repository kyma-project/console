import React from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormInput, FormLabel } from '@kyma-project/react-components';

TextFormItem.propTypes = {
  inputKey: PropTypes.string.isRequired,
  required: PropTypes.bool,
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  onChange: PropTypes.func.isRequired,
};

TextFormItem.defaultProps = {
  type: 'text',
};

export default function TextFormItem({
  inputKey,
  required,
  label,
  type,
  onChange,
}) {
  return (
    <FormItem key={inputKey}>
      <FormLabel htmlFor={inputKey} required={required}>
        {label}
      </FormLabel>
      <FormInput
        id={inputKey}
        type={type}
        placeholder={label}
        onChange={onChange}
        autoComplete="off"
      />
    </FormItem>
  );
}
