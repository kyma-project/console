import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import './StringInput.scss';
import { Token } from 'fundamental-react';

export const SingleString = ({ text, onClick }) => (
  <Token
    title="Click to remove"
    className="label-selector__label"
    onClick={onClick}
  >
    {text}
  </Token>
);

export const StringInput = ({
  stringList = {},
  onChange,
  regexp = /^[A-z_-]+$/,
  placeholder = 'Enter multiple values separated by comma',
  ...props
}) => {
  const [isValid, setValid] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.setCustomValidity(
      isValid ? '' : `Please match the requested format`,
    );
    if (typeof inputRef.current.reportValidity === 'function')
      inputRef.current.reportValidity();
  }, [isValid]);

  function handleKeyDown(e) {
    if (!isValid) {
      setValid(true);
    }
    if (e.key !== 'Enter' && e.key !== ',') return;
    handleStringEntered(e);
  }

  function handleOutOfFocus(e) {
    handleStringEntered(e);
  }

  function handleStringEntered(sourceEvent) {
    const inputValue = sourceEvent.target.value;
    if (!regexp.test(inputValue)) {
      if (inputValue) setValid(false);
      return;
    }
    sourceEvent.preventDefault();
    sourceEvent.target.value = '';

    const stringListWithoutDuplicates = stringList.filter(
      s => s !== inputValue,
    );
    onChange([...stringListWithoutDuplicates, inputValue]);
  }

  function deleteString(string) {
    onChange(stringList.filter(s => s !== string));
  }

  return (
    <div className="fd-form__set">
      <div
        className={classNames(['label-selector', { 'is-invalid': !isValid }])}
      >
        {!!stringList.length &&
          stringList.map(s => (
            <SingleString key={s} text={s} onClick={() => deleteString(s)} />
          ))}
        <input
          ref={inputRef}
          className="fd-form__control label-selector__input"
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          onBlur={handleOutOfFocus}
          data-ignore-visual-validation
          {...props}
        />
      </div>
    </div>
  );
};
