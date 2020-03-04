import { FormItem, FormLabel } from 'fundamental-react';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';

const getCheckStatus = (checked, indeterminate) => {
  if (indeterminate) {
    return 'mixed';
  } else if (checked) {
    return 'true';
  } else {
    return 'false';
  }
};

const Checkbox = React.forwardRef(
  (
    {
      className,
      initialChecked = false,
      disabled,
      disableStyles,
      id,
      indeterminate,
      inline,
      inputProps,
      labelProps,
      name,
      onChange,
      value,
      ...props
    },
    ref,
  ) => {
    const [checked, setChecked] = useState(initialChecked);
    const inputEl = useRef();

    useEffect(() => {
      inputEl && (inputEl.current.indeterminate = indeterminate);
    });

    return (
      <FormItem {...props} disabled={disabled} isInline={inline} ref={ref}>
        <FormLabel {...labelProps} disabled={disabled}>
          <input
            {...inputProps}
            aria-checked={getCheckStatus(checked, indeterminate)}
            checked={checked}
            className="fd-checkbox"
            disabled={disabled}
            id={name}
            name={name}
            onChange={e => {
              const newChecked = !checked;
              setChecked(newChecked);
              onChange(e, newChecked);
            }}
            ref={inputEl}
            type="checkbox"
          />
          {value}
        </FormLabel>
      </FormItem>
    );
  },
);

Checkbox.displayName = 'Checkbox';

Checkbox.propTypes = {
  className: PropTypes.string,

  initialChecked: PropTypes.bool,
  disabled: PropTypes.bool,
  disableStyles: PropTypes.bool,
  id: PropTypes.string,
  indeterminate: PropTypes.bool,
  inline: PropTypes.bool,
  inputProps: PropTypes.object,
  labelProps: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

Checkbox.defaultProps = {
  onChange: () => void 0,
};

Checkbox.propDescriptions = {
  checked:
    'Set to **true** when checkbox input is checked and a controlled component.',
  defaultChecked:
    'Set to **true** when the checkbox input is checked and an uncontrolled component.',
  indeterminate: 'When true, the checkbox renders a "mixed" state.',
  inline: '_INTERNAL USE ONLY._',
  inputProps: 'Props to be spread to the component `<input>` element.',
  labelProps: 'Props to be spread to the component `<label>` element.',
  name: 'Sets the `name` for the checkbox input.',
  value: 'Sets the `value` for the checkbox input.',
};

export default Checkbox;
