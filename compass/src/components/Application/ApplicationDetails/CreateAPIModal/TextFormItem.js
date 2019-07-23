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

export default function TextFormItem(props) {
  const { inputKey, required, label, type, defaultValue, onChange } = props;

  return (
    <FormItem key={inputKey}>
      <FormLabel htmlFor={inputKey} required={required}>
        {label}
      </FormLabel>
      <FormInput
        id={inputKey}
        type={type}
        placeholder={label}
        defaultValue={defaultValue}
        onChange={onChange}
        autoComplete="off"
      />
    </FormItem>
  );
}
