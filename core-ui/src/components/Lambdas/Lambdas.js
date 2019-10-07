import React from 'react';
import { FormItem, FormLabel } from 'fundamental-react';

import LabelsInput from '../Labels/Labels';

export default function LambdasComponent() {
  const [labels, setLabels] = React.useState({ test: 'sss' });
  const [errorMessage, setErrorMessage] = React.useState('');

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  function updateErrorMessage(error) {
    setErrorMessage(error);
  }

  return (
    <FormItem key="labels">
      <FormLabel htmlFor="labels">Labels</FormLabel>
      {JSON.stringify(labels)}
      <LabelsInput
        labels={labels}
        updateLabels={updateLabels}
        updateErrorMessage={updateErrorMessage}
      ></LabelsInput>
      {errorMessage}
    </FormItem>
  );
}
