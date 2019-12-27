import { useMutation } from '@apollo/react-hooks';
import LuigiClient from '@kyma-project/luigi-client';

import { useNotification } from 'contexts/notifications';
import { DELETE_API_RULE } from 'gql/mutations';

export function useDeleteApiRule(onCompleted) {
  const namespace = LuigiClient.getContext().namespaceId;

  const notificationManager = useNotification();
  const [deleteAPIRule, opts] = useMutation(DELETE_API_RULE, {
    onError: handleDeleteError,
    onCompleted: handleDeleteSuccess,
  });

  function handleDeleteError(error) {
    notificationManager.notify({
      content: `Could not delete API Rule: ${error.message}`,
      title: 'Error',
      color: '#BB0000',
      icon: 'decline',
      autoClose: false,
    });
  }

  function handleDeleteSuccess(data) {
    if (onCompleted) {
      onCompleted();
    }
    notificationManager.notify({
      content: `API Rule ${data.deleteAPIRule.name} deleted successfully`,
      title: 'Success',
      color: '#107E3E',
      icon: 'accept',
      autoClose: true,
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
