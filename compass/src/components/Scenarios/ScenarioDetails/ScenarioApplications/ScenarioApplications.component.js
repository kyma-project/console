import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import GenericList from '../../../../shared/components/GenericList/GenericList';
import { Panel } from '@kyma-project/react-components';
import AssignEntityToScenarioModal from './../shared/AssignEntityToScenarioModal/AssignApplicationsToScenarioModal.container';
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

  const deleteHandler = async application => {
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
    if (application.labels.scenarios.length === 1) {
      LuigiClient.uxManager().showAlert({
        text: 'At least one scenario is required.',
        type: 'warning',
        closeAfter: 10000,
      });
      return;
    }

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
  };

  const headerRenderer = () => ['Name', 'Total APIs'];

  const rowRenderer = application => [
    application.name,
    application.apis.totalCount + application.eventAPIs.totalCount,
  ];

  const actions = [
    {
      name: 'Unassign',
      handler: deleteHandler,
    },
  ];

  const assignedApplications = getApplicationsForScenario.applications.data;

  const extraHeaderContent = (
    <AssignEntityToScenarioModal
      originalEntities={assignedApplications}
      getEntitiesForScenario={getApplicationsForScenario}
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
