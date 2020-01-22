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

export function handleDelete(
  entityType,
  entityId,
  entityName,
  deleteRequestFn,
  callback = () => {},
) {
  displayConfirmationMessage(entityType, entityName)
    .then(() => {
      return deleteRequestFn(entityId, entityName);
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

export function easyHandleDelete(
  entityType,
  entityName,
  deleteRequestFn,
  deleteRequestParam,
  deleteRequestName,
  notificationManager,
  callback = () => {},
) {
  displayConfirmationMessage(entityType, entityName)
    .then(async () => {
      try {
        const result = await deleteRequestFn(deleteRequestParam);
        const isSuccess =
          result.data &&
          (deleteRequestName ? result.data[deleteRequestName] : true);
        if (isSuccess) {
          notificationManager.notifySuccess({
            content: `Application ${entityName} deleted`,
          });
        } else {
          throw new Exception();
        }
      } catch (e) {
        throw e;
      }
    })
    .then(() => {
      callback();
    })
    .catch(err => {
      notificationManager.notifyError({
        content: `An error occurred while deleting ${entityType} ${entityName}: ${err.message}`,
      });
    });
}
