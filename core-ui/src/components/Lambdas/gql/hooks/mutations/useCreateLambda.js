import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';
import LuigiClient from '@kyma-project/luigi-client';

import { CREATE_LAMBDA } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import {
  GQL_MUTATIONS,
  DEFAULT_LAMBDA_CODE,
  DEFAULT_LAMBDA_DEPS,
} from 'components/Lambdas/constants';

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
        ...prepareCreateLambdaInput(name),
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
        LuigiClient.linkManager().navigate(`details/${name}`);
      }
    } catch (err) {
      handleError(name, err);
    }
  }

  return createLambda;
};

export function prepareCreateLambdaInput(name) {
  const dependencies = formatMessage(DEFAULT_LAMBDA_DEPS, {
    lambdaName: name,
  });

  return {
    labels: {},
    source: DEFAULT_LAMBDA_CODE,
    dependencies,
    resources: {
      requests: {
        cpu: '50m',
        memory: '64Mi',
      },
      limits: {
        cpu: '100m',
        memory: '128Mi',
      },
    },
    replicas: {
      min: 1,
      max: 1,
    },
    env: [],
  };
}
