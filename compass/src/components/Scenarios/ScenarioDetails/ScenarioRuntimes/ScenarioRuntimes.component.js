import React from 'react';
import PropTypes from 'prop-types';
import { GenericList } from 'react-shared';
import { useMutation } from '@apollo/react-hooks';

import AssignEntityToScenarioModal from '../shared/AssignEntityToScenarioModal/AssignRuntimesToScenarioModal.container';
import unassignScenarioHandler from '../shared/unassignScenarioHandler';
import { SEND_NOTIFICATION } from '../../../../gql';

ScenarioRuntimes.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  getRuntimesForScenario: PropTypes.object.isRequired,
  setRuntimeScenarios: PropTypes.func.isRequired,
  deleteRuntimeScenarios: PropTypes.func.isRequired,
};

export default function ScenarioRuntimes({
  scenarioName,
  getRuntimesForScenario,
  setRuntimeScenarios,
  deleteRuntimeScenarios,
}) {
  const [sendNotification] = useMutation(SEND_NOTIFICATION);

  if (getRuntimesForScenario.loading) {
    return <p>Loading...</p>;
  }
  if (getRuntimesForScenario.error) {
    return `Error! ${getRuntimesForScenario.error.message}`;
  }

  const showSuccessNotification = runtimeName => {
    sendNotification({
      variables: {
        content: `Unassigned "${runtimeName}" from ${scenarioName}.`,
        title: runtimeName,
        color: '#359c46',
        icon: 'accept',
        instanceName: scenarioName,
      },
    });
  };

  const actions = [
    {
      name: 'Unassign',
      handler: async runtime => {
        await unassignScenarioHandler(
          runtime.name,
          runtime.id,
          runtime.labels.scenarios,
          setRuntimeScenarios,
          deleteRuntimeScenarios,
          scenarioName,
          async () => {
            showSuccessNotification(runtime.name);
            await getRuntimesForScenario.refetch();
          },
        );
      },
    },
  ];

  const assignedRuntimes = getRuntimesForScenario.runtimes.data;

  const extraHeaderContent = (
    <AssignEntityToScenarioModal
      originalEntities={assignedRuntimes}
      entitiesForScenarioRefetchFn={getRuntimesForScenario.refetch}
    />
  );

  return (
    <GenericList
      extraHeaderContent={extraHeaderContent}
      title="Runtimes"
      notFoundMessage="No Runtimes for this Scenario"
      entries={assignedRuntimes}
      headerRenderer={() => ['Name']}
      actions={actions}
      rowRenderer={runtime => [runtime.name]}
      showSearchField={false}
    />
  );
}
