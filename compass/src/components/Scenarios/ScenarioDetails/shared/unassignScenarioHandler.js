import LuigiClient from '@kyma-project/luigi-client';

export default async function unassignScenarioHandler(
  entityName,
  entityId,
  currentEntityScenarios,
  unassignMutation,
  scenarioName,
  successCallback,
) {
  LuigiClient.uxManager()
    .showConfirmationModal({
      header: 'Unassign Application',
      body: `Are you sure you want to unassign ${entityName}?`,
      buttonConfirm: 'Confirm',
      buttonDismiss: 'Cancel',
    })
    .then(async () => {
      try {
        const scenarios = currentEntityScenarios.filter(
          scenario => scenario !== scenarioName,
        );

        if (!scenarios.length) {
          throw Error('At least one scenario is required.');
        }

        await unassignMutation(entityId, scenarios);
        if (successCallback) {
          successCallback();
        }
      } catch (error) {
        console.warn(error);
        LuigiClient.uxManager().showAlert({
          text: error.message,
          type: 'error',
          closeAfter: 10000,
        });
      }
    })
    .catch(() => {});
}
