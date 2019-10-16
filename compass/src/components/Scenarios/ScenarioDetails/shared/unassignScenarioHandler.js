import LuigiClient from '@kyma-project/luigi-client';

export default async function unassignScenarioHandler(
  entityName,
  entityId,
  currentEntityScenarios,
  unassignMutation,
  scenarioName,
  successCallback,
) {
  const showConfirmation = () =>
    LuigiClient.uxManager().showConfirmationModal({
      header: `Unassign ${entityName}`,
      body: `Are you sure you want to unassign ${entityName}?`,
      buttonConfirm: 'Confirm',
      buttonDismiss: 'Cancel',
    });

  const tryDeleteScenario = async () => {
    try {
      const scenarios = currentEntityScenarios.filter(
        scenario => scenario !== scenarioName,
      );

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
  };

  showConfirmation()
    .then(tryDeleteScenario)
    .catch(() => {});
}
