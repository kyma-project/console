import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@luigi-project/client';

import { useNotification } from 'react-shared';
import { DELETE_API_RULE } from 'gql/mutations';

import { formatMessage } from 'components/Lambdas/helpers/misc';
import { GQL_MUTATIONS } from '../constants';

export function useDeleteApiRule(onCompleted) {
  const namespace = LuigiClient.getContext().namespaceId;

  const notificationManager = useNotification();
  const [deleteAPIRule, opts] = useMutation(DELETE_API_RULE, {
    onError: handleDeleteError,
    onCompleted: handleDeleteSuccess,
  });

  function handleDeleteError(error) {
    notificationManager.notifyError({
      content: formatMessage(GQL_MUTATIONS.DELETE_API_RULE.ERROR_MESSAGE, {
        error: error.message,
      }),
    });
  }

  function handleDeleteSuccess(data) {
    notificationManager.notifySuccess({
      content: formatMessage(GQL_MUTATIONS.DELETE_API_RULE.SUCCESS_MESSAGE, {
        apiRuleName: data.deleteAPIRule.name,
      }),
    });
    if (onCompleted) {
      onCompleted();
    }
  }

  function handleDelete(name) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: GQL_MUTATIONS.DELETE_API_RULE.CONFIRM_MODAL.TITLE,
        body: formatMessage(
          GQL_MUTATIONS.DELETE_API_RULE.CONFIRM_MODAL.MESSAGE,
          {
            apiRuleName: name,
          },
        ),
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() =>
        deleteAPIRule({
          variables: { name: name, namespace },
        }),
      );
  }

  return [handleDelete, opts];
}
