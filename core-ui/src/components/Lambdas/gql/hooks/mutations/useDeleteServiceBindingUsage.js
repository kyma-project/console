import LuigiClient from '@kyma-project/luigi-client';
import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { DELETE_SERVICE_BINDING_USAGE } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS, BUTTONS } from 'components/Lambdas/constants';

export const useDeleteServiceBindingUsage = ({ lambda }) => {
  const notificationManager = useNotification();
  const [deleteServiceBindingUsageMutation] = useMutation(
    DELETE_SERVICE_BINDING_USAGE,
  );

  function handleError(serviceInstanceName, error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.DELETE_BINDING_USAGE.ERROR_MESSAGE,
      {
        serviceInstanceName,
        error: errorToDisplay,
      },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function handleDeleteServiceBindingUsage(serviceBindingUsage) {
    const serviceBindingUsageName = serviceBindingUsage.name;
    const serviceInstanceName =
      serviceBindingUsage.serviceBinding.serviceInstanceName;

    try {
      const response = await deleteServiceBindingUsageMutation({
        variables: {
          serviceBindingUsageName,
          namespace: lambda.namespace,
        },
      });

      if (response.error) {
        handleError(serviceInstanceName, response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.DELETE_BINDING_USAGE.SUCCESS_MESSAGE,
        {
          serviceInstanceName,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });
    } catch (err) {
      handleError(serviceInstanceName, err);
    }
  }

  async function deleteServiceBindingUsage(serviceBindingUsage) {
    if (!serviceBindingUsage) {
      throw Error('serviceBindingUsage is nil');
    }

    const message = formatMessage(
      GQL_MUTATIONS.DELETE_BINDING_USAGE.CONFIRM_MODAL.MESSAGE,
      {
        serviceInstanceName:
          serviceBindingUsage.serviceBinding.serviceInstanceName,
      },
    );

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: GQL_MUTATIONS.DELETE_BINDING_USAGE.CONFIRM_MODAL.TITLE,
        body: message,
        buttonConfirm: BUTTONS.DELETE,
        buttonDismiss: BUTTONS.CANCEL,
      })
      .then(() => handleDeleteServiceBindingUsage(serviceBindingUsage))
      .catch(() => {});
  }

  return deleteServiceBindingUsage;
};
