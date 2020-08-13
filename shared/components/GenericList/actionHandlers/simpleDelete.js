import LuigiClient from '@luigi-project/client';

function displayConfirmationMessage(entityType, entityName) {
  return new Promise(resolve => {
    LuigiClient.uxManager()
      .showConfirmationModal({
        header: `Remove ${entityType}`,
        body: `Are you sure you want to delete ${entityType} "${entityName}"?`,
        buttonConfirm: 'Delete',
        buttonDismiss: 'Cancel',
      })
      .then(() => resolve(true))
      .catch(_e => resolve(false));
  });
}

export async function handleDelete(
  entityType,
  entityId,
  entityName,
  deleteRequestFn,
  callback = () => {},
) {
  try {
    if (await displayConfirmationMessage(entityType, entityName)) {
      deleteRequestFn(entityId, entityName);
      callback();
    }
  } catch (err) {
    LuigiClient.uxManager().showAlert({
      text: `An error occurred while deleting ${entityType} ${entityName}: ${err.message}`,
      type: 'error',
      closeAfter: 10000,
    });
  }
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
  return displayConfirmationMessage(entityType, entityName)
    .then(async shouldDelete => {
      if (shouldDelete) {
        try {
          const result = await deleteRequestFn(deleteRequestParam);
          const isSuccess =
            result.data &&
            (deleteRequestName ? result.data[deleteRequestName] : true);
          if (isSuccess) {
            notificationManager.notifySuccess({
              content: `${entityName} deleted`,
            });
            callback();
          } else {
            throw Error();
          }
        } catch (e) {
          throw e;
        }
      }
    })
    .catch(err => {
      notificationManager.notifyError({
        content: `An error occurred while deleting ${entityType} ${entityName}: ${err.message}`,
      });
    });
}
