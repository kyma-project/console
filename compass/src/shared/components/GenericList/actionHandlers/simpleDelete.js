import LuigiClient from '@kyma-project/luigi-client';

function displayConfirmationMessage(entityType, entityName) {
  return new Promise(resolve => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove ${entityType}`,
        body: `Are you sure you want to delete ${entityType} "${entityName}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() => {
        resolve();
      })
      .catch(e => {});
  });
}

export default function handleDelete(
  entityType,
  entityName,
  deleteRequestFn,
  callback,
) {
  displayConfirmationMessage(entityType, entityName)
    .then(() => {
      return deleteRequestFn(entityName);
    })
    .then(() => {
      callback();
    })
    .catch(err => {
      LuigiClient.uxManager().showAlert({
        text: `An error occurred while deleting ${entityType} ${entityName}: ${err.message}`,
        type: 'error',
        closeAfter: 10000,
      });
    });
}
