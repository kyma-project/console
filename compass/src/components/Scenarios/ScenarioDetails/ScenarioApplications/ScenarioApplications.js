import React, { useContext } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { useQuery, useMutation } from '@apollo/react-hooks';

import { GenericList } from 'react-shared';
import AssignEntityToScenarioModal from './../shared/AssignEntityToScenarioModal/AssignApplicationsToScenarioModal.container';
import unassignScenarioHandler from './../shared/unassignScenarioHandler';
import {
  createEqualityQuery,
  GET_APPLICATIONS_FOR_SCENARIO,
  SET_APPLICATION_SCENARIOS,
} from '../../gql';
import ScenarioNameContext from '../ScenarioNameContext';
import { SEND_NOTIFICATION } from '../../../../gql';

export default function ScenarioApplications({ updateApplicationsCount }) {
  const scenarioName = useContext(ScenarioNameContext);
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

  let {
    data: applicationsForScenario,
    error,
    loading,
    refetch: refetchApplications,
  } = useQuery(GET_APPLICATIONS_FOR_SCENARIO, {
    variables: {
      filter: [
        {
          key: 'scenarios',
          query: createEqualityQuery(scenarioName),
        },
      ],
    },
  });

  const [removeApplicationFromScenario] = useMutation(
    SET_APPLICATION_SCENARIOS,
  );

  if (loading) {
    return <p>Loading...</p>;
  }
  if (error) {
    return <p>`Error! ${error.message}`;</p>;
  }

  updateApplicationsCount(applicationsForScenario.applications.totalCount);

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
      undefined,
      scenarioName,
      async () => {
        await refetchApplications();
        updateApplicationsCount(
          applicationsForScenario.applications.totalCount,
        );
        showSuccessNotification(application.name);
      },
    );
  };

  const headerRenderer = () => ['Name', 'Total APIs'];

  const rowRenderer = application => [
    application.name,
    application.apiDefinitions.totalCount +
      application.eventDefinitions.totalCount,
  ];

  const actions = [
    {
      name: 'Unassign',
      handler: deleteHandler,
    },
  ];

  const assignedApplications = applicationsForScenario.applications.data;

  const extraHeaderContent = (
    <AssignEntityToScenarioModal
      originalEntities={assignedApplications}
      entitiesForScenarioRefetchFn={refetchApplications}
    />
  );

  return (
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
  );
}
