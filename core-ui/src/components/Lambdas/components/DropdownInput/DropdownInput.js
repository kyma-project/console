import React from 'react';

import { InlineHelp, FormItem, FormLabel, FormSelect } from 'fundamental-react';

import './DropdownInput.scss';

export const DropdownInput = ({
  _ref,
  id,
  disabled = false,
  label = '',
  name = '',
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
      {label && (
        <FormLabel htmlFor={id} className="dropdown-input__label">
          {label}
          {inlineHelp && (
            <InlineHelp placement="bottom-right" text={inlineHelp} />
          )}
        </FormLabel>
      )}
      <FormSelect
        ref={_ref}
        disabled={disabled}
        id={id}
        name={name}
        role="select"
        value={df}
        onChange={onChange}
      >
        {options.map(({ key, value }) => (
          <option aria-label="option" key={key} value={value}>
            {key}
          </option>
        ))}
      </FormSelect>
    </FormItem>
  );
};
