import { useNotification, usePost } from 'react-shared';

import {
  formatMessage,
  randomNameGenerator,
} from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

export const useCreateServiceBindingUsage = () => {
  const postRequest = usePost();
  const notificationManager = useNotification();

  function handleError(serviceInstanceName, error) {
    console.error(error);
    const message = formatMessage(
      GQL_MUTATIONS.CREATE_BINDING_USAGE.ERROR_MESSAGE,
      { serviceInstanceName },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function createServiceBinding(name, namespace, instanceRefName) {
    return await postRequest(
      `/apis/servicecatalog.k8s.io/v1beta1/namespaces/${namespace}/servicebindings/${name}`,
      {
        apiVersion: 'servicecatalog.k8s.io/v1beta1',
        kind: 'ServiceBinding',
        metadata: {
          name,
          namespace,
        },
        spec: {
          instanceRef: {
            name: instanceRefName,
          },
        },
      },
    );
  }

  async function createServiceBindingUsage(
    name,
    namespace,
    serviceBindingName,
    lambdaName,
    parameters,
  ) {
    return await postRequest(
      `/apis/servicecatalog.kyma-project.io/v1alpha1/namespaces/${namespace}/servicebindingusages/${name}`,
      {
        apiVersion: 'servicecatalog.kyma-project.io/v1alpha1',
        kind: 'ServiceBindingUsage',
        metadata: {
          name,
        },
        spec: {
          serviceBindingRef: {
            name: serviceBindingName,
          },
          usedBy: {
            name: lambdaName,
            kind: CONFIG.functionUsageKind,
          },
          parameters,
        },
      },
    );
  }

  async function createServiceBindingUsageSet({
    namespace,
    serviceInstanceName,
    lambdaName,
    serviceBindingUsageParameters,
    existingCredentials = undefined,
  }) {
    try {
      let serviceBindingName = existingCredentials || randomNameGenerator();

      if (!existingCredentials)
        await createServiceBinding(
          serviceBindingName,
          namespace,
          serviceInstanceName,
        );

      await createServiceBindingUsage(
        randomNameGenerator(),
        namespace,
        serviceBindingName,
        lambdaName,
        serviceBindingUsageParameters,
      );
    } catch (err) {
      handleError(serviceInstanceName, err);
      return;
    }

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_BINDING_USAGE.SUCCESS_MESSAGE,
      { serviceInstanceName },
    );

    notificationManager.notifySuccess({
      content: message,
    });
  }

  return createServiceBindingUsageSet;
};
