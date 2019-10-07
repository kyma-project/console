import React from 'react';
import PropTypes from 'prop-types';
import {
  FormItem,
  FormLabel,
  FormInput,
  Token,
  FormMessage,
  InlineHelp,
} from 'fundamental-react';

LabelsInput.propTypes = {
  labels: PropTypes.object,
  updateLabels: PropTypes.func,
};

export default function LabelsInput({ labels, updateLabels }) {
  const [errorMessage, setErrorMessage] = React.useState('');

  function addLabel(event) {
    event.preventDefault();
    setErrorMessage('');

    const newLabel = event.target.value.trim();
    if (!(newLabel.split('=').length === 2)) {
      return;
    }

    const regex = /(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])=(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]|$)/;
    const matchingLabel = newLabel.match(regex);
    const isLabelValid =
      matchingLabel && matchingLabel[0] === matchingLabel.input;
    if (!isLabelValid) {
      return;
    }

    const key = newLabel.split('=')[0];
    const value = newLabel.split('=')[1];
    if (labels[key]) {
      setErrorMessage(`Label with key '${key}' already exists.`);
      return;
    }

    const newLabels = { ...labels };
    newLabels[key] = value;
    updateLabels(newLabels);
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
      <FormLabel htmlFor="labels">
        Labels
        <InlineHelp
          placement="bottom-right"
          text="A key and value should be separated by a '=', a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character."
        />
      </FormLabel>

      {createLabelsToDisplay().map(label => (
        <Token onClick={e => deleteLabel(e)}>{label}</Token>
      ))}

      <FormInput
        id="labels"
        type="text"
        placeholder="Add new label"
        autoComplete="off"
        pattern="^(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9])=(([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]|$)"
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            addLabel(e);
          }
        }}
        onBlur={e => {
          addLabel(e);
        }}
      />

      {errorMessage && <FormMessage type="error">{errorMessage}</FormMessage>}
    </FormItem>
  );
}
