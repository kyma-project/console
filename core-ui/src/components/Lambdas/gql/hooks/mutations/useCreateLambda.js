import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';
import LuigiClient from '@luigi-project/client';

import { CREATE_LAMBDA } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { getDefaultDependencies } from 'components/Lambdas/helpers/runtime';

import { GQL_MUTATIONS } from 'components/Lambdas/constants';
import { CONFIG } from 'components/Lambdas/config';

export const useCreateLambda = ({ redirect = true }) => {
  const notificationManager = useNotification();
  const [createLambdaMutation] = useMutation(CREATE_LAMBDA);

  function handleError(name, error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(GQL_MUTATIONS.CREATE_LAMBDA.ERROR_MESSAGE, {
      lambdaName: name,
      error: errorToDisplay,
    });

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function createLambda({ name, namespace, inputData }) {
    try {
      const params = {
        ...prepareCreateLambdaInput(name, inputData.runtime),
        ...inputData,
      };

      const response = await createLambdaMutation({
        variables: {
          name,
          namespace,
          params,
        },
      });

      if (response.error) {
        handleError(name, response.error);
        return;
      }

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

export function prepareCreateLambdaInput(name, runtime = 'nodejs14') {
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
