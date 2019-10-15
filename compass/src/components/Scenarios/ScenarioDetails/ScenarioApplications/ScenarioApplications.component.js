import React from 'react';
import PropTypes from 'prop-types';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import { Panel } from '@kyma-project/react-components';
import AssignApplicationsToScenarioModal from './AssignApplicationsToScenarioModal/AssignApplicationsToScenarioModal.container';
import unassignScenarioHandler from './../shared/unassignScenarioHandler';

ScenarioApplications.propTypes = {
  scenarioName: PropTypes.string.isRequired,

  getApplicationsForScenario: PropTypes.object.isRequired,
  removeApplicationFromScenario: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function ScenarioApplications({
  scenarioName,
  getApplicationsForScenario,
  removeApplicationFromScenario,
  sendNotification,
}) {
  if (getApplicationsForScenario.loading) {
    return <p>Loading...</p>;
  }
  if (getApplicationsForScenario.error) {
    return `Error! ${getApplicationsForScenario.error.message}`;
  }

  const assignedApplications = getApplicationsForScenario.applications.data;

  const showSuccessNotification = applicationName => {
    sendNotification({
      variables: {
        content: `Unassigned "${applicationName}" from ${scenarioName}.`,
        title: applicationName,
        color: '#359c46',
        icon: 'accept',
        instanceName: scenarioName,
      },
    });
  };

  const headerRenderer = () => ['Name', 'Total APIs'];

  const rowRenderer = application => [
    application.name,
    application.apis.totalCount + application.eventAPIs.totalCount,
  ];

  const actions = [
    {
      name: 'Unassign',
      handler: async application => {
        await unassignScenarioHandler(
          application.name,
          application.id,
          application.labels.scenarios,
          removeApplicationFromScenario,
          scenarioName,
          async () => {
            showSuccessNotification(application.name);
            await getApplicationsForScenario.refetch();
          },
        );
      },
    },
  ];

  const extraHeaderContent = (
    <AssignApplicationsToScenarioModal
      scenarioName={scenarioName}
      originalApplications={assignedApplications}
      getApplicationsForScenarioQuery={getApplicationsForScenario}
    />
  );

  return (
    <Panel>
      <GenericList
        extraHeaderContent={extraHeaderContent}
        title="Applications"
        notFoundMessage="No Applications for this Scenario"
        entries={assignedApplications}
        headerRenderer={headerRenderer}
        actions={actions}
        rowRenderer={rowRenderer}
        showSearchField={false}
      />
    </Panel>
  );
}
