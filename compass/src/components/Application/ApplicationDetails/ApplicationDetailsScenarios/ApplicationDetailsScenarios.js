import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { GenericList } from 'react-shared';
import AssignScenarioModal from './../../../Shared/AssignScenario/AssignScenarioModal.container';
import { ApplicationQueryContext } from '../ApplicationDetails';
import { SEND_NOTIFICATION } from '../../../../gql';

import { SET_APPLICATION_SCENARIOS, DELETE_SCENARIO_LABEL } from '../../gql';

ApplicationDetailsScenarios.propTypes = {
  applicationId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationDetailsScenarios({
  applicationId,
  scenarios,
}) {
  const [sendNotification] = useMutation(SEND_NOTIFICATION);
  const applicationQuery = React.useContext(ApplicationQueryContext);
  const [updateScenarios] = useMutation(SET_APPLICATION_SCENARIOS);
  const [deleteScenarios] = useMutation(DELETE_SCENARIO_LABEL);

  async function handleScenariosUnassign(applicationId, scenarios) {
    if (scenarios.length) {
      return await updateScenarios({
        variables: { id: applicationId, scenarios: scenarios },
      });
    }
    return await deleteScenarios({ variables: { id: applicationId } });
  }

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
          await handleScenariosUnassign(
            applicationId,
            scenarios.filter(scenario => scenario !== scenarioName),
          );
          applicationQuery.refetch();
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

  const headerRenderer = () => ['Name'];

  const rowRenderer = label => [label.scenario];

  const actions = [
    {
      name: 'Unassign',
      handler: unassignScenario,
    },
  ];

  const extraHeaderContent = (
    <header>
      <AssignScenarioModal
        entityId={applicationId}
        scenarios={scenarios}
        notSelectedMessage={'Application is not assigned to any scenario.'}
        entityQuery={applicationQuery}
        updateScenarios={(applicationId, scenarios) =>
          handleScenariosUnassign(applicationId, scenarios)
        }
      />
    </header>
  );

  const entries = scenarios.map(scenario => ({ scenario })); // list requires a list of objects

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Assigned to Scenario"
      notFoundMessage="This Applications isn't assigned to any scenario"
      actions={actions}
      entries={entries}
      headerRenderer={headerRenderer}
      rowRenderer={rowRenderer}
      textSearchProperties={['scenario']}
    />
  );
}
