import React, { useRef } from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import { LambdaNameInput, LabelsInput } from 'components/Lambdas/components';

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
      <LambdaNameInput _ref={name} id="lambdaName" />
      <LabelsInput labels={labels} onChange={updateLabels} />
    </form>
  );
}
