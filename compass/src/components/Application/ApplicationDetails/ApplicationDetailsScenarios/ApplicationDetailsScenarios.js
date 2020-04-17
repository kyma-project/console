import React from 'react';
import { useMutation } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';
import { GenericList, useNotification } from 'react-shared';
import ApplicationScenarioModal from './ApplicationScenarioModal.container';
import { ApplicationQueryContext } from './../../ApplicationDetails/ApplicationDetails.component';

import { SET_APPLICATION_SCENARIOS, DELETE_SCENARIO_LABEL } from '../../gql';

ApplicationDetailsScenarios.propTypes = {
  applicationId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationDetailsScenarios({
  applicationId,
  scenarios,
}) {
  const notificationManager = useNotification();
  const applicationQuery = React.useContext(ApplicationQueryContext);
  const [updateScenarios] = useMutation(SET_APPLICATION_SCENARIOS);
  const [deleteScenarios] = useMutation(DELETE_SCENARIO_LABEL);
  async function handleScenariosUnassign(applicationId, scenarios) {
    console.log('handleScenariosUnassign');
    if (scenarios.length) {
      await updateScenarios({
        variables: { id: applicationId, scenarios: scenarios },
      });
    } else {
      await deleteScenarios({ variables: { id: applicationId } });
    }
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
          notificationManager.notifySuccess({
            content: `Scenario "${scenarioName}" removed from application.`,
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
      <ApplicationScenarioModal
        entityId={applicationId}
        scenarios={scenarios}
        notSelectedMessage={'Application is not assigned to any scenario.'}
        entityQuery={applicationQuery}
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
