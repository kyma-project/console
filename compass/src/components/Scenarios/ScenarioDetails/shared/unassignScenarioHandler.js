import LuigiClient from '@kyma-project/luigi-client';

export default async function(
  entityName,
  entityId,
  currentEntityScenarios,
  unassignMutation,
  scenarioKey,
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
        await unassignMutation(
          entityId,
          currentEntityScenarios.filter(scenario => scenario !== scenarioKey),
        );
        //applicationQuery.refetch();
        // sendNotification({
        //   variables: {
        //     content: `Scenario "${scenarioName}" removed from ${entityName}.`,
        //     title: `${entityName}`,
        //     color: '#359c46',
        //     icon: 'accept',
        //     instanceName: scenarioName,
        //   },
        // });
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
