import React, { useState, useRef, useEffect } from 'react';
import classNames from 'classnames';
import './LabelSelectorInput.scss';
import { Token, InlineHelp } from 'fundamental-react';

//TODO: move this component to a shared "place"

const domainSegmentRegexp = '([a-z0-9]([a-z0-9-_]{0,61}[a-z0-9])?)';

// Dot needs to be escaped for regexp
const domainRegexp = `(${domainSegmentRegexp}\\.)*${domainSegmentRegexp}`;
const nameAndValueRegexp = '[a-z0-9A-Z]([a-z0-9A-Z-_\\.]{0,61}[a-z0-9A-Z])?';
const pattern = `^((${domainRegexp})/)?${nameAndValueRegexp}=(${nameAndValueRegexp})?$`;
export const labelRegexp = new RegExp(pattern);

export const Label = ({ text, onClick }) => (
  <Token
    title="Click to remove"
    className="label-selector__label"
    onClick={onClick}
  >
    {text}
  </Token>
);

export const NonRemovableLabel = ({ text }) => (
  <Token className="label-selector__label--non-removable">{text}</Token>
);

const LabelSelectorInput = ({ labels = {}, readonlyLabels = {}, onChange }) => {
  const [isValid, setValid] = useState(true);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.setCustomValidity(
      isValid ? '' : `Please use the label format key=value`,
    );
    if (typeof inputRef.current.reportValidity === 'function')
      inputRef.current.reportValidity();
  }, [isValid]);

  function handleKeyDown(e) {
    if (!isValid) {
      setValid(true);
    }
    if (e.key !== 'Enter' && e.key !== ',') return;
    handleLabelEntered(e.target.value, e);
  }

  function handleOutOfFocus(e) {
    handleLabelEntered(e.target.value, e);
  }

  function handleLabelEntered(value, sourceEvent) {
    const newLabel = sourceEvent.target.value;
    if (!labelRegexp.test(value)) {
      if (value) setValid(false);
      return;
    }
    sourceEvent.preventDefault();
    sourceEvent.target.value = '';

    const key = value.split('=')[0];
    const newValue = value.split('=')[1];
    console.log(key, newValue);
    const newLabels = { ...labels };
    newLabels[key] = newValue;
    onChange(newLabels);
  }

  function createLabelsToDisplay(labels) {
    const labelsArray = [];
    for (const key in labels) {
      const value = labels[key];
      console.log(key, value);
      const labelToDisplay = `${key}=${value}`;
      labelsArray.push(labelToDisplay);
    }
    return labelsArray;
  }

  function deleteLabel(labelToDisplay) {
    const key = labelToDisplay.split('=')[0];
    const newLabels = { ...labels };
    delete newLabels[key];
    onChange(newLabels);
  }

  return (
    <div className="fd-form__item">
      <label className="fd-form__label">
        Labels
        <InlineHelp
          placement="bottom-right"
          text="A key and value should be separated by a '=', a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character."
        />
      </label>

      <div className="fd-form__set">
        <div
          className={classNames(['label-selector', { 'is-invalid': !isValid }])}
        >
          {createLabelsToDisplay(readonlyLabels).map(l => (
            <NonRemovableLabel key={l} text={l} />
          ))}

          {createLabelsToDisplay(labels).map(l => (
            <Label key={l} text={l} onClick={() => deleteLabel(l)} />
          ))}
          <input
            ref={inputRef}
            className="fd-form__control label-selector__input"
            type="text"
            placeholder="Enter label key=value"
            onKeyDown={handleKeyDown}
            onBlur={handleOutOfFocus}
            data-ignore-visual-validation
          />
        </div>
      </div>
    </div>
  );
};

export default LabelSelectorInput;
