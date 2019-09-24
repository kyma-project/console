import React, { useState } from 'react';
import { FormInput } from 'fundamental-react';

const labelRegexp = new RegExp(/[a-z0-9A-Z-_.]+="[a-z0-9A-Z-_.]+"/);

const convertLabelsToString = labels => `{${labels.join(', ')}}`;

const convertStringToLabels = async labelString =>
  labelString.replace(/[{}\s]/g, '').split(',');

const filterValidLabels = labels => labels.filter(l => l && isValidLabel(l));

const isValidLabel = label => labelRegexp.test(label);

const QueryInput = ({ labels, setLabelsAction }) => {
  const [currentValue, setCurrentValue] = useState('');
  const [labelsLength, setLabelsLength] = useState(0);
  const [validState, setValidState] = useState('normal');

  const labelsString = convertLabelsToString(labels);

  if (labels.length !== labelsLength) {
    setCurrentValue(labelsString);
    setLabelsLength(labels.length);
  }

  async function handleLabelStringChange(labelString) {
    setCurrentValue(labelString);
    try {
      const parsed = await convertStringToLabels(labelString);
      const filtered = filterValidLabels(parsed);
      if (parsed.length !== filtered.length) {
        // user is editing. Don't update context
        setValidState('warning');
      } else {
        // user has finished editing. Update context
        setValidState('normal');
        setLabelsAction(filtered);
      }
    } catch {
      setValidState('invalid');
    }
  }

  console.log('queryinput render');

  return (
    <FormInput
      id="query"
      type="text"
      onChange={async e => handleLabelStringChange(e.target.value)}
      autoComplete="off"
      state={validState}
      value={currentValue}
    />
  );
};

export default QueryInput;
