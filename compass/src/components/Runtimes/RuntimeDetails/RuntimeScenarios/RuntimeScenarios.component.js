import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Panel } from '@kyma-project/react-components';
import RuntimeScenarioModal from './RuntimeScenarioModal.container';
import { RuntimeQueryContext } from '././/../RuntimeDetails.component';

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
      name: 'Unassign',
      handler: unassignScenario,
    },
  ];

  async function unassignScenario(entry) {
    const scenarioName = entry.scenario;

    LuigiClient.uxManager()
      .showConfirmationModal({
        header: 'Unassign Scenario',
        body: `Are you sure you want to unassign ${scenarioName}?`,
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
              content: `Scenario "${scenarioName}" removed from application.`,
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
        entityId={runtimeId}
        scenarios={scenarios}
        notAssignedMessage={'Runtime is not assigned to any scenario.'}
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
        title="Assign to Scenario"
        notFoundMessage="This Runtime isn't assigned to any scenario"
        actions={actions}
        entries={entries}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
