import React from 'react';
import {
  FormItem,
  FormLabel,
  FormInput,
  FormSelect,
  InlineHelp,
} from 'fundamental-react';

import LabelsInput from '../../Shared/Labels';

export default function LambdasComponent({ onChange, formElementRef }) {
  const [labels, setLabels] = React.useState({ test: 'sss' });

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  function handleFormSubmit() {
    console.log(labels);
  }

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleFormSubmit}
    >
      <FormItem>
        <FormLabel htmlFor="lambdaName" required="true">
          Name
          <InlineHelp
            placement="bottom-right"
            text="Name must be no longer than 63 characters, must start and end with a lowercase letter, and may contain lowercase letters, numbers, and dashes."
          />
        </FormLabel>
        <FormInput
          pattern="^[a-z]([-a-z0-9]*[a-z0-9])?"
          required="true"
          id="lambdaName"
          type="text"
          placeholder="Lambda name"
        />
      </FormItem>

      <LabelsInput labels={labels} updateLabels={updateLabels}></LabelsInput>

      <FormItem>
        <FormLabel htmlFor="lambdaRuntime" required="true">
          Runtime
        </FormLabel>
        <FormSelect id="lambdaRuntime">
          <option value="nodejs6">Nodejs 6</option>
          <option value="nodejs8">Nodejs 8</option>
        </FormSelect>
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="lambdaSize" required="true">
          Size
        </FormLabel>
        <FormSelect id="lambdaSize">
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </FormSelect>
      </FormItem>
    </form>
  );
}
