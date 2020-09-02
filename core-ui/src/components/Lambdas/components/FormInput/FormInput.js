import React, {
  forwardRef,
  useState,
  useEffect,
  useImperativeHandle,
} from 'react';

import {
  FormItem,
  FormLabel,
  FormMessage,
  InlineHelp,
  FormInput as FioriFormInput,
} from 'fundamental-react';

import './FormInput.scss';

export const FormInput = forwardRef(
  (
    {
      label,
      noLabel = false,
      required = false,
      disabled = false,
      placeholder,
      firstValue = undefined,
      id = '',
      inlineHelp = undefined,
      _ref = undefined,
      validate = () => void 0,
    },
    ref,
  ) => {
    const [dirty, setDirty] = useState(false);
    const [status, setStatus] = useState('');
    const [value, setValue] = useState(firstValue || '');

    useImperativeHandle(ref, () => ({
      setFirstValue() {
        setValue(firstValue || '');
      },
    }));

    useEffect(() => {
      if (value) {
        setDirty(true);
      }
    }, [value, setDirty]);

    useEffect(() => {
      if (dirty) {
        validate(value, setStatus);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value, dirty, setStatus]);

    const validationMessage = status ? (
      <FormMessage type="error">{status}</FormMessage>
    ) : null;

    return (
      <FormItem className="form-input" key={id}>
        {!noLabel && (
          <FormLabel
            className="form-input__label"
            htmlFor={id}
            required={required}
          >
            {label}
            {inlineHelp && (
              <InlineHelp placement="bottom-right" text={inlineHelp} />
            )}
          </FormLabel>
        )}
        <FioriFormInput
          ref={_ref}
          disabled={disabled}
          id={id}
          placeholder={placeholder}
          type="text"
          value={value}
          onChange={e => setValue(e.target.value)}
        />
        {dirty && validationMessage}
      </FormItem>
    );
  },
);
