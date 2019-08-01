import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Panel } from '@kyma-project/react-components';
import GenericList from './../../../../shared/components/GenericList/GenericList';
import ApplicationScenarioModal from './ApplicationScenarioModal.container';
import { ApplicationQueryContext } from './../../ApplicationDetails/ApplicationDetails.component';

ApplicationDetailsScenarios.propTypes = {
  applicationId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateScenarios: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function ApplicationDetailsScenarios({
  applicationId,
  scenarios,
  updateScenarios,
  sendNotification,
}) {
  const applicationQuery = React.useContext(ApplicationQueryContext);

  async function unassignScenario(entry) {
    const scenarioName = entry.scenario;

    try {
      await updateScenarios(
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
        notAssignedMessage={'Application is not assigned to any scenario.'}
        entityQuery={applicationQuery}
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
        title="Assigned to Scenario"
        notFoundMessage="This Applications isn't assigned to any scenario"
        actions={actions}
        entries={entries}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
