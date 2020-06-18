import React from 'react';

import { HeaderLabelsEditor } from 'react-shared';
import {
  useUpdateLambda,
  UPDATE_TYPE,
} from 'components/Lambdas/gql/hooks/mutations';

export default function LambdaLabels({ lambda }) {
  const updateLambda = useUpdateLambda({
    lambda,
    type: UPDATE_TYPE.GENERAL_CONFIGURATION,
  });

  const handleLabelsUpdate = labels => updateLambda({ labels });

  return (
    <div className="fd-has-margin-bottom-l">
      <HeaderLabelsEditor
        labels={lambda.labels || {}}
        onApply={handleLabelsUpdate}
      />
    </div>
  );
}
