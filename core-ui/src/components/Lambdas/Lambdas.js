import React from 'react';
import { FormItem, FormLabel, FormMessage } from 'fundamental-react';

import LabelsInput from '../Labels/Labels';

export default function LambdasComponent() {
  const [labels, setLabels] = React.useState({ test: 'sss' });

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  return (
    <LabelsInput labels={labels} updateLabels={updateLabels}></LabelsInput>
  );
}
