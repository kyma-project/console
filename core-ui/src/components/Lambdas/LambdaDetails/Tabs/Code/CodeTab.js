import React from 'react';

import CodeAndDependencies from './CodeAndDependencies/CodeAndDependencies';
import RepositoryConfig from './RepositoryConfig/RepositoryConfig';
import LambdaVariables from './LambdaVariables/LambdaVariables';

import { isGitSourceType } from 'components/Lambdas/helpers/lambdas';
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
      {isGitSourceType(lambda.sourceType) ? (
        <RepositoryConfig lambda={lambda} />
      ) : (
        <CodeAndDependencies lambda={lambda} />
      )}
      <LambdaVariables
        lambda={lambda}
        customVariables={customVariables}
        customValueFromVariables={customValueFromVariables}
        injectedVariables={injectedVariables}
      />
    </>
  );
}
