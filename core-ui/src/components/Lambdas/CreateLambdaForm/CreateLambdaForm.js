import React, { useRef } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { FormItem } from 'fundamental-react';
import { K8sNameInput } from 'react-shared';

import LabelSelectorInput from '../../LabelSelectorInput/LabelSelectorInput';

import { useCreateLambda } from 'components/Lambdas/gql/hooks/mutations';

export default function CreateLambdaForm({ onChange, formElementRef }) {
  const createLambda = useCreateLambda({ redirect: true });
  const [labels, setLabels] = React.useState({});
  const name = useRef(null);

  function updateLabels(newLabels) {
    setLabels(newLabels);
  }

  async function handleSubmit() {
    const inputData = {
      labels,
    };

    await createLambda({
      name: name.current.value,
      namespace: LuigiClient.getEventData().environmentId,
      inputData,
    });
  }

  return (
    <form
      ref={formElementRef}
      style={{ width: '30em' }}
      onChange={onChange}
      onSubmit={handleSubmit}
    >
      <FormItem>
        <K8sNameInput _ref={name} id="lambdaName" kind="Lambda" />
      </FormItem>

      <LabelSelectorInput labels={labels} onChange={updateLabels} />
    </form>
  );
}
