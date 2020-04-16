import LuigiClient from '@kyma-project/luigi-client';
import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { DELETE_LAMBDA } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS, BUTTONS } from 'components/Lambdas/constants';

export const useDeleteLambda = ({ redirect = false }) => {
  const notificationManager = useNotification();
  const [deleteLambdaMutation] = useMutation(DELETE_LAMBDA);

  function handleError(lambda, error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(GQL_MUTATIONS.DELETE_LAMBDA.ERROR_MESSAGE, {
      lambdaName: lambda.name,
      error: errorToDisplay,
    });

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function handleDeleteLambda(lambda) {
    try {
      const response = await deleteLambdaMutation({
        variables: {
          function: {
            name: lambda.name,
            namespace: lambda.namespace,
          },
        },
      });

      if (response.error) {
        handleError(lambda, response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.DELETE_LAMBDA.SUCCESS_MESSAGE,
        {
          lambdaName: lambda.name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });

      if (redirect) {
        LuigiClient.linkManager()
          .fromClosestContext()
          .navigate('');
      }
    } catch (err) {
      handleError(lambda, err);
    }
  }

  async function deleteLambda(lambda) {
    if (!lambda) {
      throw Error('lambda is nil');
    }

    const title = formatMessage(
      GQL_MUTATIONS.DELETE_LAMBDA.CONFIRM_MODAL.TITLE,
      {
        lambdaName: lambda.name,
      },
    );
    const message = formatMessage(
      GQL_MUTATIONS.DELETE_LAMBDA.CONFIRM_MODAL.MESSAGE,
      {
        lambdaName: lambda.name,
      },
    );

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: title,
        body: message,
        buttonConfirm: BUTTONS.DELETE,
        buttonDismiss: BUTTONS.CANCEL,
      })
      .then(() => handleDeleteLambda(lambda))
      .catch(() => {});
  }

  return deleteLambda;
};
