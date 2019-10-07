import React from 'react';
import PropTypes from 'prop-types';
import {
  FormItem,
  FormLabel,
  FormInput,
  Token,
  FormMessage,
} from 'fundamental-react';

LabelsInput.propTypes = {
  labels: PropTypes.object,
  updateLabels: PropTypes.func,
};

export default function LabelsInput({ labels, updateLabels }) {
  const [errorMessage, setErrorMessage] = React.useState('');

  function validateLabel(event) {
    const newLabel = event.target.value.trim();
    if (newLabel === '') return;
    if (!(newLabel.split('=').length === 2)) {
      setErrorMessage(
        `Invalid label '${newLabel}'. A key and value should be separated by a '='`,
      );
      return;
    }

    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const key = newLabel.split('=')[0];
    const value = newLabel.split('=')[1];
    const foundKey = key.match(regex);
    const foundVal = value.match(regex);
    const isKeyValid = foundKey && foundKey[0] === key && key !== '';
    const isValueValid = (foundVal && foundVal[0] === value) || value === '';
    if (!isKeyValid || !isValueValid) {
      setErrorMessage(
        `Invalid label '${key}=${value}'. In a valid label, a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.`,
      );
      return;
    }
    if (labels[key]) {
      setErrorMessage(`Label with key '${key}' already exists.`);
      return;
    }

    const newLabels = { ...labels };
    newLabels[key] = value;
    updateLabels(newLabels);
    setErrorMessage('');
    event.target.value = '';
  }

  function createLabelsToDisplay() {
    const labelsArray = [];
    for (const key in labels) {
      const value = labels[key];
      const labelToDisplay = `${key}=${value}`;
      labelsArray.push(labelToDisplay);
    }
    return labelsArray;
  }

  function deleteLabel(event) {
    const labelToDisplay = event.target.innerHTML;
    const key = labelToDisplay.split('=')[0];
    const newLabels = { ...labels };
    delete newLabels[key];
    updateLabels(newLabels);
  }

  return (
    <FormItem key="labels">
      <FormLabel htmlFor="labels">Labels</FormLabel>

      {createLabelsToDisplay().map(label => (
        <Token onClick={e => deleteLabel(e)}>{label}</Token>
      ))}

      <FormInput
        type="text"
        placeholder="Add new label"
        autoComplete="off"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            validateLabel(e);
          }
        }}
        onBlur={e => {
          validateLabel(e);
        }}
      />

      {errorMessage && <FormMessage type="error">{errorMessage}</FormMessage>}
    </FormItem>
  );
}
