import React from 'react';

import { HeaderLabelsEditor } from 'react-shared';
import { useUpdateLambda, UPDATE_TYPE } from 'components/Lambdas/gql/hooks';

export default function LambdaLabels({ lambda }) {
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.GENERAL_CONFIGURATION,
  });

  const handleLabelsUpdate = labels => updateLambda({ labels });

  return (
    <HeaderLabelsEditor
      labels={lambda.labels || {}}
      onApply={handleLabelsUpdate}
    />
  );
}
