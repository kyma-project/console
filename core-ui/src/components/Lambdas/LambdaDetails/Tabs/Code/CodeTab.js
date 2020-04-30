import React from 'react';

import CodeAndDependencies from './CodeAndDependencies/CodeAndDependencies';
import LambdaVariables from './LambdaVariables/LambdaVariables';

import { serializeVariables } from 'components/Lambdas/helpers/lambdaVariables';

export default function CodeTab({ lambda, bindingUsages }) {
  const {
    customVariables,
    customValueFromVariables,
    injectedVariables,
  } = serializeVariables({
    lambdaVariables: lambda.env,
    bindingUsages,
  });

  return (
    <>
      <CodeAndDependencies lambda={lambda} />
      <LambdaVariables
        lambda={lambda}
        customVariables={customVariables}
        customValueFromVariables={customValueFromVariables}
        injectedVariables={injectedVariables}
      />
    </>
  );
}
