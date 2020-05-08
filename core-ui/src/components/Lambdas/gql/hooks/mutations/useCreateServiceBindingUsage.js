import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import {
  CREATE_SERVICE_BINDING,
  CREATE_SERVICE_BINDING_USAGE,
} from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

export const useCreateServiceBindingUsage = ({ lambda }) => {
  const notificationManager = useNotification();
  const [createServiceBindingMutation] = useMutation(CREATE_SERVICE_BINDING);
  const [createServiceBindingUsageMutation] = useMutation(
    CREATE_SERVICE_BINDING_USAGE,
  );

  function handleError(serviceInstanceName, error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_BINDING_USAGE.ERROR_MESSAGE,
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

  function prepareServiceBindingUsageParameters({
    serviceBindingName,
    serviceBindingUsageParameters = undefined,
  }) {
    return {
      serviceBindingRef: {
        name: serviceBindingName,
      },
      usedBy: {
        name: lambda.name,
        kind: CONFIG.functionUsageKind,
      },
      parameters: serviceBindingUsageParameters,
    };
  }

  async function createServiceBindingUsage({
    serviceInstanceName,
    serviceBindingUsageParameters,
    createCredentials = true,
    existingCredentials = undefined,
  }) {
    let serviceBindingName = existingCredentials;

    try {
      let response = null;
      if (createCredentials) {
        response = await createServiceBindingMutation({
          variables: {
            serviceInstanceName,
            namespace: lambda.namespace,
          },
        });

        if (response.error) {
          handleError(serviceInstanceName, response.error);
          return;
        }
      }

      if (response && response.data) {
        serviceBindingName = response.data.createServiceBinding.name;
      }

      const serviceBindingUsageInput = prepareServiceBindingUsageParameters({
        serviceBindingName,
        serviceBindingUsageParameters,
      });

      response = await createServiceBindingUsageMutation({
        variables: {
          createServiceBindingUsageInput: serviceBindingUsageInput,
          namespace: lambda.namespace,
        },
      });

      if (response.error) {
        handleError(serviceInstanceName, response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.CREATE_BINDING_USAGE.SUCCESS_MESSAGE,
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

  return createServiceBindingUsage;
};
