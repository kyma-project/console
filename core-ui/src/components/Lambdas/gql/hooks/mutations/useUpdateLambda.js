import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { UPDATE_LAMBDA } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage, omitTypenames } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';

export const UPDATE_TYPE = {
  GENERAL_CONFIGURATION: 'GENERAL_CONFIGURATION',
  CODE_AND_DEPENDENCIES: 'CODE_AND_DEPENDENCIES',
  REPOSITORY_CONFIG: 'REPOSITORY_CONFIG',
  RESOURCES_AND_REPLICAS: 'RESOURCES_AND_REPLICAS',
  VARIABLES: 'VARIABLES',
};

export const useUpdateLambda = ({
  lambda,
  type = UPDATE_TYPE.GENERAL_CONFIGURATION,
}) => {
  const notificationManager = useNotification();
  const [updateLambdaMutation] = useMutation(UPDATE_LAMBDA);

  function handleError(error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.UPDATE_LAMBDA[type].ERROR_MESSAGE,
      {
        lambdaName: lambda.name,
        error: errorToDisplay,
      },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function updateLambda(updatedData, userCallback = () => {}) {
    try {
      const params = {
        ...prepareUpdateLambdaInput(lambda),
        ...updatedData,
      };

      const response = await updateLambdaMutation({
        variables: {
          name: lambda.name,
          namespace: lambda.namespace,
          params,
        },
      });

      if (response.error) {
        handleError(response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.UPDATE_LAMBDA[type].SUCCESS_MESSAGE,
        {
          lambdaName: lambda.name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });
      userCallback({ ok: true });
    } catch (err) {
      handleError(err);
      userCallback({ ok: false });
    }
  }

  return updateLambda;
};

export function prepareUpdateLambdaInput(lambda = {}) {
  const preparedLambda = {
    labels: lambda.labels || {},
    source: lambda.source || '',
    sourceType: lambda.sourceType || '',
    dependencies: lambda.dependencies || '',
    resources: lambda.resources || {},
    replicas: lambda.replicas || {},
    env: lambda.env || [],
    runtime: lambda.runtime || '',
    reference: lambda.reference || null,
    baseDir: lambda.baseDir || null,
  };

  return omitTypenames(preparedLambda);
}
