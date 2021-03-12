import { useNotification, usePost } from 'react-shared';

import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';

import { GQL_MUTATIONS } from 'components/Lambdas/constants';

export const useCreateRepository = () => {
  const notificationManager = useNotification();
  const postRequest = usePost();

  function handleError(name, error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.CREATE_REPOSITORY.ERROR_MESSAGE,
      {
        repositoryName: name,
        error: errorToDisplay,
      },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function createRepository({ name, namespace, spec }) {
    try {
      await postRequest(
        `/apis/serverless.kyma-project.io/v1alpha1/namespaces/${namespace}/gitrepositories/${name}`,
        {
          apiVersion: 'serverless.kyma-project.io/v1alpha1',
          kind: 'GitRepository',
          metadata: {
            name,
            namespace,
          },
          spec: spec,
        },
      );

      const message = formatMessage(
        GQL_MUTATIONS.CREATE_REPOSITORY.SUCCESS_MESSAGE,
        {
          repositoryName: name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });
    } catch (err) {
      handleError(name, err);
    }
  }

  return createRepository;
};
