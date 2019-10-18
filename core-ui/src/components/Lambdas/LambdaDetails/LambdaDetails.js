import React from 'react';
import LuigiClient from '@kyma-project/luigi-client';

import LambdaDetailsHeader from './LambdaDetailsHeader/LambdaDetailsHeader';

export default function LambdaDetails({ lambdaId }) {
  const namespace = LuigiClient.getEventData().environmentId;

  //temporary
  const lambda = {
    name: lambdaId,
    namespace: namespace,
  };
  return (
    <>
      <LambdaDetailsHeader lambda={lambda}></LambdaDetailsHeader>
    </>
  );
}
