import { useNotification } from 'react-shared';
import LuigiClient from '@luigi-project/client';

import { usePost } from 'react-shared';
import { createLambdaInput } from './createLambdaInput';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { getDefaultDependencies } from 'components/Lambdas/helpers/runtime';

import { GQL_MUTATIONS } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

export const useCreateLambda = ({ redirect = true }) => {
  const notificationManager = useNotification();
  const postRequest = usePost();

  function handleError(name, error) {
    const message = formatMessage(GQL_MUTATIONS.CREATE_LAMBDA.ERROR_MESSAGE, {
      lambdaName: name,
      error,
    });

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function createLambda({ name, namespace, inputData }) {
    const input = createLambdaInput(name, namespace, inputData);
    try {
      await postRequest(
        `/apis/serverless.kyma-project.io/v1alpha1/namespaces/${namespace}/functions`,
        input,
      );

      const message = formatMessage(
        GQL_MUTATIONS.CREATE_LAMBDA.SUCCESS_MESSAGE,
        {
          lambdaName: name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });

      if (redirect) {
        LuigiClient.linkManager()
          .fromContext('namespaces')
          .navigate(`cmf-functions/details/${name}`);
      }
    } catch (err) {
      handleError(name, err);
    }
  }

  return createLambda;
};

export function prepareCreateLambdaInput(name, runtime = 'nodejs12') {
  return {
    labels: {},
    source: CONFIG.defaultLambdaCodeAndDeps[runtime].code,
    dependencies: getDefaultDependencies(name, runtime),
    resources: {
      requests: {},
      limits: {},
    },
    buildResources: {
      requests: {},
      limits: {},
    },
    replicas: {},
    env: [],
  };
}
