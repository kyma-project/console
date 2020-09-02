import LuigiClient from '@luigi-project/client';
import { useMutation } from '@apollo/react-hooks';
import { useNotification } from 'react-shared';

import { DELETE_REPOSITORY } from 'components/Lambdas/gql/mutations';
import extractGraphQlErrors from 'shared/graphqlErrorExtractor';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS, BUTTONS } from 'components/Lambdas/constants';

export const useDeleteRepository = ({
  onSuccessCallback = () => void 0,
} = {}) => {
  const notificationManager = useNotification();
  const [deleteRepositoryMutation] = useMutation(DELETE_REPOSITORY);

  function handleError(repository, error) {
    const errorToDisplay = extractGraphQlErrors(error);

    const message = formatMessage(
      GQL_MUTATIONS.DELETE_REPOSITORY.ERROR_MESSAGE,
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

  async function handleDeleteRepository(repository) {
    try {
      const response = await deleteRepositoryMutation({
        variables: {
          namespace: repository.namespace,
          name: repository.name,
        },
      });

      if (response.error) {
        handleError(repository, response.error);
        return;
      }

      const message = formatMessage(
        GQL_MUTATIONS.DELETE_REPOSITORY.SUCCESS_MESSAGE,
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
      handleError(repository, err);
    }
  }

  async function deleteRepository(repository) {
    if (!repository) {
      throw Error('repository is nil');
    }

    const title = formatMessage(
      GQL_MUTATIONS.DELETE_REPOSITORY.CONFIRM_MODAL.TITLE,
      {
        repositoryName: repository.name,
      },
    );
    const message = formatMessage(
      GQL_MUTATIONS.DELETE_REPOSITORY.CONFIRM_MODAL.MESSAGE,
      {
        repositoryName: repository.name,
      },
    );

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: title,
        body: message,
        buttonConfirm: BUTTONS.DELETE,
        buttonDismiss: BUTTONS.CANCEL,
      })
      .then(() => handleDeleteRepository(repository))
      .catch(() => {});
  }

  return deleteRepository;
};
