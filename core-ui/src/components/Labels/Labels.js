import React from 'react';
import PropTypes from 'prop-types';
import { FormInput } from 'fundamental-react';

LabelsInput.propTypes = {
  labels: PropTypes.object,
  updateLabels: PropTypes.func,
  updateErrorMessage: PropTypes.func,
};

export default function LabelsInput({
  labels,
  updateLabels,
  updateErrorMessage,
}) {
  function validateLabel(event) {
    const newLabel = event.target.value.trim();
    if (newLabel === '') return;
    const separator = '=';
    if (!(newLabel.split(separator).length === 2)) {
      updateErrorMessage(
        `Invalid label '${newLabel}'. A key and value should be separated by a '='`,
      );
      return;
    }

    const regex = /([A-Za-z0-9][-A-Za-z0-9_.]*)?[A-Za-z0-9]/;
    const key = newLabel.split(separator)[0];
    const value = newLabel.split(separator)[1];
    const foundKey = key.match(regex);
    const foundVal = value.match(regex);
    const isKeyValid = foundKey && foundKey[0] === key && key !== '';
    const isValueValid = (foundVal && foundVal[0] === value) || value === '';
    if (!isKeyValid || !isValueValid) {
      updateErrorMessage(
        `Invalid label '${key}${separator}${value}'. In a valid label, a key cannot be empty, a key/value consists of alphanumeric characters, '-', '_' or '.', and must start and end with an alphanumeric character.`,
      );
      return;
    }
    if (labels[key]) {
      updateErrorMessage(`Label with key value '${key}' already exists.`);
      return;
    }

    const newLabels = { ...labels };
    newLabels[key] = value;
    updateLabels(newLabels);
    updateErrorMessage('');
    event.target.value = '';
  }

  return (
    <FormInput
      id="labels"
      type="text"
      placeholder="Add labels"
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
  );
}
