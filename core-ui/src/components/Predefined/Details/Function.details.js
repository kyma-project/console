import React from 'react';

import LambdaDetailsWrapper from 'components/Lambdas/LambdaDetails/LambdaDetailsWrapper';
import { prettySourceType } from 'components/Lambdas/helpers/lambdas';
import { prettyRuntime } from 'components/Lambdas/helpers/runtime';
import { LAMBDA_DETAILS } from 'components/Lambdas/constants';
import { LambdaStatusBadge } from 'components/Lambdas/LambdaStatusBadge/LambdaStatusBadge';

export const FunctionsDetails = DefaultRenderer => ({ ...otherParams }) => {
  const customColumns = [
    {
      header: 'Status',
      value: resource => <LambdaStatusBadge status={resource.status} />,
    },
    {
      header: LAMBDA_DETAILS.SOURCE_TYPE.TEXT,
      value: resource => prettySourceType(resource.spec.type),
    },
    {
      header: LAMBDA_DETAILS.RUNTIME.TEXT,
      value: resource => prettyRuntime(resource.spec.runtime),
    },
  ];

  const Functions = (resource, resourceUrl) => {
    return (
      <LambdaDetailsWrapper
        key="lambdaDetails"
        lambda={resource}
        lambdaUrl={resourceUrl}
      />
    );
  };
  return (
    <DefaultRenderer
      customColumns={customColumns}
      customComponents={[Functions]}
      {...otherParams}
    />
  );
};
