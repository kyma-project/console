import React from 'react';

import { InlineHelp, FormItem, FormLabel, FormSelect } from 'fundamental-react';

import './DropdownInput.scss';

export const DropdownInput = ({
  _ref,
  id,
  disabled = false,
  label = '',
  inlineHelp = undefined,
  defaultValue = '',
  onChange = () => void 0,
  options = [],
}) => {
  if (!options.length) {
    return null;
  }
  const df = defaultValue === undefined ? options[0].value : defaultValue;

  return (
    <FormItem className="dropdown-input" key={id}>
      <FormLabel htmlFor={id} className="dropdown-input__label">
        {label}
        {inlineHelp && (
          <InlineHelp placement="bottom-right" text={inlineHelp} />
        )}
      </FormLabel>
      <FormSelect
        ref={_ref}
        disabled={disabled}
        id={id}
        role="select"
        defaultValue={df}
        onChange={onChange}
      >
        {options.map(option => (
          <option aria-label="option" key={option.key} value={option.value}>
            {option.key}
          </option>
        ))}
      </FormSelect>
    </FormItem>
  );
};
