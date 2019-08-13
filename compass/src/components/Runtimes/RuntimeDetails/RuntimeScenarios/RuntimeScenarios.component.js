import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Panel } from '@kyma-project/react-components';
import RuntimeScenarioModal from './RuntimeScenarioModal.container';
import { RuntimeQueryContext } from './../RuntimeDetails.component';

import GenericList from '../../../../shared/components/GenericList/GenericList';

RuntimeScenarios.propTypes = {
  runtimeId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateScenarios: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function RuntimeScenarios({
  runtimeId,
  scenarios,
  updateScenarios,
  sendNotification,
}) {
  const runtimeQuery = React.useContext(RuntimeQueryContext);

  const headerRenderer = () => ['Name'];
  const rowRenderer = label => [<b>{label.scenario}</b>];
  const actions = [
    {
      name: 'Deactivate',
      handler: deactivateScenario,
    },
  ];

  async function deactivateScenario(entry) {
    const scenarioName = entry.scenario;

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Deactivate Scenario',
        body: `Are you sure you want to deactivate ${scenarioName}?`,
        buttonConfirm: 'Confirm',
        buttonDismiss: 'Cancel',
      })
      .then(async () => {
        try {
          await updateScenarios(
            runtimeId,
            scenarios.filter(scenario => scenario !== scenarioName),
          );
          runtimeQuery.refetch();
          sendNotification({
            variables: {
              content: `${scenarioName}" deactivated in the runtime.`,
              title: `${scenarioName}`,
              color: '#359c46',
              icon: 'accept',
              instanceName: scenarioName,
            },
          });
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

  const extraHeaderContent = (
    <header>
      <RuntimeScenarioModal
        title="Activate scenario"
        entityId={runtimeId}
        scenarios={scenarios}
        notAssignedMessage="This Runtime doesn't have any active scenarios."
        entityQuery={runtimeQuery}
      />
    </header>
  );

  const entries = scenarios.map(scenario => {
    return { scenario };
  }); // list requires a list of objects

  return (
    <Panel>
      <GenericList
        extraHeaderContent={extraHeaderContent}
        title="Active scenarios"
        notFoundMessage="This Runtime doesn't have any active scenarios."
        actions={actions}
        entries={entries}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
