import { useNotification, useUpdate } from 'react-shared';

import { createPatch } from 'rfc6902';

import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
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
  const updateLambdaMutation = useUpdate();

  function handleError(error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.UPDATE_LAMBDA[type].ERROR_MESSAGE,
      {
        lambdaName: lambda.metadata.name,
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
      const newLambda = {
        ...lambda,
        ...updatedData,
      };

      const diff = createPatch(lambda, newLambda);

      const response = await updateLambdaMutation(
        lambda.metadata.selfLink,
        diff,
      );

      if (response.error) {
        handleError(response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.UPDATE_LAMBDA[type].SUCCESS_MESSAGE,
        {
          lambdaName: lambda.metadata.name,
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
