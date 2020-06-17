import React from 'react';

import LambdaDetailsWrapper from 'components/Lambdas/LambdaDetails/LambdaDetailsWrapper';
import { useConfigData } from 'components/Lambdas/helpers/misc/useConfigData';

export default function LambdaDetails({ match }) {
  useConfigData();
  return <LambdaDetailsWrapper lambdaName={match.params.name} />;
}
