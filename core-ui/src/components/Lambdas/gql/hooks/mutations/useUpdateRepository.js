import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { UPDATE_REPOSITORY } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage, omitTypenames } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from 'components/Lambdas/constants';

export const useUpdateRepository = ({
  repository,
  onSuccessCallback = () => void 0,
} = {}) => {
  const notificationManager = useNotification();
  const [updateRepositoryMutation] = useMutation(UPDATE_REPOSITORY);

  function handleError(error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.UPDATE_REPOSITORY.ERROR_MESSAGE,
      {
        repositoryName: repository.name,
        error: errorToDisplay,
      },
    );

    notificationManager.notifyError({
      content: message,
      autoClose: false,
    });
  }

  async function updateRepository(updatedSpec) {
    try {
      const spec = {
        ...prepareUpdateRepositorySpec(repository),
        ...updatedSpec,
      };

      const response = await updateRepositoryMutation({
        variables: {
          name: repository.name,
          namespace: repository.namespace,
          spec,
        },
      });

      if (response.error) {
        handleError(response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.UPDATE_REPOSITORY.SUCCESS_MESSAGE,
        {
          repositoryName: repository.name,
        },
      );

      notificationManager.notifySuccess({
        content: message,
      });

      if (onSuccessCallback && typeof onSuccessCallback === 'function') {
        onSuccessCallback();
      }
    } catch (err) {
      handleError(err);
    }
  }

  return updateRepository;
};

export function prepareUpdateRepositorySpec(repository = {}) {
  const preparedRepository = {
    url: repository.url || '',
    auth: repository.auth || null,
  };

  return omitTypenames(preparedRepository);
}
