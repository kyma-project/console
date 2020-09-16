import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { CREATE_REPOSITORY } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';

import { GQL_MUTATIONS } from 'components/Lambdas/constants';

export const useCreateRepository = ({
  onSuccessCallback = () => void 0,
} = {}) => {
  const notificationManager = useNotification();
  const [createRepositoryMutation] = useMutation(CREATE_REPOSITORY);

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
      const response = await createRepositoryMutation({
        variables: {
          name,
          namespace,
          spec: spec,
        },
      });

      if (response.error) {
        handleError(name, response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.CREATE_REPOSITORY.SUCCESS_MESSAGE,
        {
          repositoryName: name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });

      if (onSuccessCallback && typeof onSuccessCallback === 'function') {
        onSuccessCallback();
      }
    } catch (err) {
      handleError(name, err);
    }
  }

  return createRepository;
};
