import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FormItem, FormLabel, InlineHelp } from 'fundamental-react';
import { useMutation } from '@apollo/react-hooks';
import * as LuigiClient from '@kyma-project/luigi-client';

import { CREATE_LAMBDA } from '../../../gql/mutations';
import LabelSelectorInput from '../../LabelSelectorInput/LabelSelectorInput';

CreateLambdaForm.propTypes = {
  onChange: PropTypes.func,
  onCompleted: PropTypes.func,
  onError: PropTypes.func,
  formElementRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};

export default function CreateLambdaForm({
  onChange,
  onCompleted,
  onError,
  formElementRef,
}) {
  const [labels, setLabels] = React.useState({});
  const [createLambda] = useMutation(CREATE_LAMBDA);

  const formValues = {
    name: useRef(null),
    size: useRef(null),
    runtime: useRef(null),
  };

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  async function handleFormSubmit(e) {
    try {
      const variables = {
        name: formValues.name.current.value,
        size: formValues.size.current.value,
        runtime: formValues.runtime.current.value,
        namespace: LuigiClient.getEventData().environmentId,
        labels,
      };
      await createLambda({
        variables,
      });
      onCompleted(variables.name, `Lambda created succesfully`);
      LuigiClient.linkManager().navigate(`details/${variables.name}`);
    } catch (e) {
      onError(`The lambda could not be created succesfully`, e.message || ``);
    }
  }

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleFormSubmit}
    >
      <FormItem>
        <FormLabel htmlFor="lambdaName" required={true}>
          Name
          <InlineHelp
            placement="bottom-right"
            text="Name must be no longer than 63 characters, must start with a lowercase letter, and may contain lowercase letters, numbers, and dashes."
          />
        </FormLabel>
        <input
          pattern="^[a-z]([-a-z0-9]*[a-z0-9])?"
          required={true}
          id="lambdaName"
          type="text"
          placeholder="Lambda name"
          ref={formValues.name}
        />
      </FormItem>

      <LabelSelectorInput labels={labels} onChange={updateLabels} />

      <FormItem>
        <FormLabel htmlFor="lambdaSize" required={true}>
          Size
        </FormLabel>
        <select id="lambdaSize" defaultValue="S" ref={formValues.size}>
          <option value="S">S</option>
          <option value="M">M</option>
          <option value="L">L</option>
        </select>
      </FormItem>

      <FormItem>
        <FormLabel htmlFor="lambdaRuntime" required={true}>
          Runtime
        </FormLabel>
        <select
          id="lambdaRuntime"
          defaultValue="nodejs6"
          ref={formValues.runtime}
        >
          <option value="nodejs6">Nodejs 6</option>
          <option value="nodejs8">Nodejs 8</option>
        </select>
      </FormItem>
    </form>
  );
}
