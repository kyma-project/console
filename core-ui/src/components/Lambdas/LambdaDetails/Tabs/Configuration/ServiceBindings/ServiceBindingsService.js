import React, { createContext, useContext } from 'react';
import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';

import { useNotification } from 'react-shared';

import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import {
  CREATE_SERVICE_BINDING,
  CREATE_SERVICE_BINDING_USAGE,
  DELETE_SERVICE_BINDING_USAGE,
} from 'gql/mutations';
import { REFETCH_TIMEOUT } from 'shared/constants';

const ACTION_TYPE = {
  CREATE: 'Create',
  DELETE: 'Delete',
};

export const ServiceBindingsContext = createContext({
  createServiceBinding: () => void 0,
  deleteServiceBinding: () => void 0,
});

export const ServiceBindingsService = ({ lambdaName, children }) => {
  const notificationManager = useNotification();

  const [createServiceBindingMutation] = useMutation(CREATE_SERVICE_BINDING);
  const [createServiceBindingUsageMutation] = useMutation(
    CREATE_SERVICE_BINDING_USAGE,
  );
  const [deleteServiceBindingUsageMutation] = useMutation(
    DELETE_SERVICE_BINDING_USAGE,
  );

  function handleError(
    serviceInstanceName,
    error,
    mutationType = ACTION_TYPE.CREATE,
  ) {
    let actionVerb = 'creating';
    if (mutationType === ACTION_TYPE.DELETE) {
      actionVerb = 'deleting';
    }

    const errorToDisplay = extractGraphQlErrors(error);
    notificationManager.notifyError({
      content: `Error while ${actionVerb} Service Binding for "${serviceInstanceName}" Service Instance: ${errorToDisplay}`,
    });
  }

  async function handleDeleteServiceBindingUsage(
    serviceBindingUsage,
    refetchQuery,
  ) {
    const namespace = LuigiClient.getEventData().environmentId;
    const serviceBindingUsageName = serviceBindingUsage.name;

    try {
      let response = null;
      response = await deleteServiceBindingUsageMutation({
        variables: {
          serviceBindingUsageName,
          namespace,
        },
      });

      if (response.error) {
        handleError(
          serviceBindingUsageName,
          response.error,
          ACTION_TYPE.DELETE,
        );
        return;
      }

      let isSuccess =
        response.data &&
        response.data.deleteServiceBindingUsage &&
        response.data.deleteServiceBindingUsage.name;

      if (isSuccess) {
        notificationManager.notifySuccess({
          content: `Service Binding removing...`,
        });
        setTimeout(() => {
          refetchQuery();
        }, REFETCH_TIMEOUT);
      }
    } catch (err) {
      handleError(serviceBindingUsageName, err, ACTION_TYPE.DELETE);
    }
  }

  async function deleteServiceBindingUsage(
    serviceInstanceName,
    serviceBindingUsage,
    refetchQuery,
  ) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove Service Binding`,
        body: `Are you sure you want to delete Service Binding from "${serviceInstanceName}" Service Instance?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() =>
        handleDeleteServiceBindingUsage(serviceBindingUsage, refetchQuery),
      )
      .catch(_ => {});
  }

  function prepareServiceBindingUsageParameters({
    lambdaName,
    serviceBindingName,
    serviceBindingUsageParameters = undefined,
  }) {
    return {
      serviceBindingRef: {
        name: serviceBindingName,
      },
      usedBy: {
        name: lambdaName,
        kind: 'knative-service',
      },
      parameters: serviceBindingUsageParameters,
    };
  }

  async function createServiceBinding(
    {
      serviceInstanceName,
      serviceBindingUsageParameters,
      createCredentials = true,
      existingCredentials = undefined,
    },
    refetchQuery,
  ) {
    const namespace = LuigiClient.getEventData().environmentId;
    let serviceBindingName = existingCredentials;

    try {
      let response = null;
      if (createCredentials) {
        response = await createServiceBindingMutation({
          variables: {
            serviceInstanceName,
            namespace,
          },
        });

        if (response.error) {
          handleError(serviceInstanceName, response.error, ACTION_TYPE.CREATE);
          return;
        }
      }

      if (response) {
        serviceBindingName = response.data.createServiceBinding.name;
      }

      const serviceBindingUsageInput = prepareServiceBindingUsageParameters({
        lambdaName,
        serviceBindingName,
        serviceBindingUsageParameters,
      });

      response = await createServiceBindingUsageMutation({
        variables: {
          createServiceBindingUsageInput: serviceBindingUsageInput,
          namespace,
        },
      });

      if (response.error) {
        handleError(serviceInstanceName, response.error, ACTION_TYPE.CREATE);
        return;
      }

      notificationManager.notifySuccess({
        content: `Service Binding creating...`,
      });
      setTimeout(() => {
        refetchQuery();
      }, REFETCH_TIMEOUT * 3);
    } catch (err) {
      handleError(serviceInstanceName, err, ACTION_TYPE.CREATE);
    }
  }

  const exposedData = {
    createServiceBinding,
    deleteServiceBindingUsage,
  };

  return (
    <ServiceBindingsContext.Provider
      value={{
        ...exposedData,
      }}
    >
      {children}
    </ServiceBindingsContext.Provider>
  );
};

export function useServiceBindings() {
  return useContext(ServiceBindingsContext);
}
