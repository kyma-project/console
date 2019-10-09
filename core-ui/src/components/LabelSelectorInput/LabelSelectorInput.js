import React from 'react';
import './LabelSelectorInput.scss';
import { Token } from 'fundamental-react/Token';

//TODO: move this component to a shared "place"

const domainSegmentRegexp = '([a-z0-9]([a-z0-9-_]{0,61}[a-z0-9])?)';

// Dot needs to be escaped for regexp
const domainRegexp = `(${domainSegmentRegexp}\\.)*${domainSegmentRegexp}`;
const nameAndValueRegexp = '[a-z0-9A-Z]([a-z0-9A-Z-_\\.]{0,61}[a-z0-9A-Z])?';
export const labelRegexp = new RegExp(
  `^((${domainRegexp})/)?${nameAndValueRegexp}=(${nameAndValueRegexp})?$`,
);

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

const LabelSelectorInput = ({ labels = [], readonlyLabels = [], onChange }) => {
  function handleLabelEntered(e) {
    const value = e.target.value;
    if ((e.key !== 'Enter' && e.key !== ',') || !labelRegexp.test(value))
      return;
    onChange([...labels, value]);
    e.preventDefault();
    e.target.value = '';
  }
  function handleLabelRemoved(label) {
    onChange(labels.filter(l => l !== label));
  }

  return (
    <div className="fd-form__set">
      <div className="label-selector">
        {readonlyLabels.map(l => (
          <NonRemovableLabel key={l} text={l} />
        ))}

        {labels.map(l => (
          <Label key={l} text={l} onClick={() => handleLabelRemoved(l)} />
        ))}
        <input
          className="fd-form__control label-selector__input"
          type="text"
          placeholder="Enter label key=value"
          onKeyDown={handleLabelEntered}
        />
      </div>
    </div>
  );
};

export default LabelSelectorInput;
