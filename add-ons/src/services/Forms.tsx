import { useState, useEffect } from 'react';

export const useInput = (
  initialValue: string,
  validate?: (value: string) => string,
  initialError: string = '',
) => {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState(initialError);
  const [valid, setValid] = useState(false);

  const resetValue = () => setValue('');
  const resetError = () => setError('');
  const resetValid = () => setValid(false);

  const cleanUpField = () => {
    resetValue();
    resetError();
    resetValid();
  };

  const checkState = (): string => {
    if (error) return 'invalid';
    if (valid) return 'valid';
    return 'normal';
  };

  useEffect(() => {
    if (error) setValid(false);
    if (value && !error) setValid(true);
  }, [error, value]);

  return {
    value,
    error,
    valid,
    setValue,
    setError,
    setValid,
    resetValue,
    resetError,
    resetValid,
    cleanUpField,
    checkState,
    bind: {
      value,
      onChange: (event: any) => {
        const v: string = event.target.value;
        setValue(v);
        validate && setError(validate(v));
      },
    },
  };
};
