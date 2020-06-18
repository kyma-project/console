import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';

import { useNotification } from 'react-shared';
import { DELETE_API_RULE } from 'gql/mutations';

export function useDeleteApiRule(onCompleted) {
  const namespace = LuigiClient.getContext().namespaceId;

  const notificationManager = useNotification();
  const [deleteAPIRule, opts] = useMutation(DELETE_API_RULE, {
    onError: handleDeleteError,
    onCompleted: handleDeleteSuccess,
  });

  function handleDeleteError(error) {
    notificationManager.notifyError({
      content: `Could not delete API Rule: ${error.message}`,
    });
  }

  function handleDeleteSuccess(data) {
    if (onCompleted) {
      onCompleted();
    }
    notificationManager.notifySuccess({
      content: `API Rule ${data.deleteAPIRule.name} deleted successfully`,
    });
    LuigiClient.linkManager()
      .fromClosestContext()
      .navigate('');
  }

  function handleDelete(name) {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove ${name}`,
        body: `Are you sure you want to delete rule "${name}"?`,
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
