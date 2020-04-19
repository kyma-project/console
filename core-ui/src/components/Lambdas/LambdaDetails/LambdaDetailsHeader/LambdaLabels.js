import React from 'react';

import { Labels } from 'react-shared';

import EditLambdaLabelsModal from './EditLambdaLabelsModal';

import { LAMBDA_DETAILS } from 'components/Lambdas/constants';

export default function LambdaLabels({ lambda }) {
  return (
    <div className="lambda-details-header__labels">
      <h3 className="lambda-details-header__labels-title fd-has-color-text-4">
        <span>{LAMBDA_DETAILS.LABELS.TITLE}</span>
        <EditLambdaLabelsModal lambda={lambda} />
      </h3>
      <div className="lambda-details-header__labels-content fd-has-color-text-1">
        <Labels labels={lambda.labels} />
      </div>
    </div>
  );
}
