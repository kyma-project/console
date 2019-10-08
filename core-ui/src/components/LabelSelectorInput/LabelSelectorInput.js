import React from 'react';
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
  function handleLabelEntered(e) {
    const newLabel = e.target.value;
    if (!(e.type === 'blur' || e.keyCode === 13) || !labelRegexp.test(newLabel))
      return;
    e.target.value = '';

    const key = newLabel.split('=')[0];
    const value = newLabel.split('=')[1];
    const newLabels = { ...labels };
    newLabels[key] = value;
    onChange(newLabels);
  }

  function createLabelsToDisplay(labels) {
    const labelsArray = [];
    for (const key in labels) {
      const value = labels[key];
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
        <div className="label-selector">
          {createLabelsToDisplay(readonlyLabels).map(l => (
            <NonRemovableLabel key={l} text={l} />
          ))}

          {createLabelsToDisplay(labels).map(l => (
            <Label key={l} text={l} onClick={() => deleteLabel(l)} />
          ))}
          <input
            className="fd-form__control label-selector__input"
            type="text"
            placeholder="Enter new label"
            onKeyDown={handleLabelEntered}
            onBlur={handleLabelEntered}
            pattern={pattern}
          />
        </div>
      </div>
    </div>
  );
};

export default LabelSelectorInput;
