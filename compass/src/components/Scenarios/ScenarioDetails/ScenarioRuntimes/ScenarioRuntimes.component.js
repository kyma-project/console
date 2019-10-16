import React from 'react';
import PropTypes from 'prop-types';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import { Panel } from '@kyma-project/react-components';
import AssignEntityToScenarioModal from '../shared/AssignEntityToScenarioModal/AssignRuntimesToScenarioModal.container';
import unassignScenarioHandler from '../shared/unassignScenarioHandler';

ScenarioRuntimes.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  getRuntimesForScenario: PropTypes.object.isRequired,
  removeRuntimeFromScenario: PropTypes.func.isRequired,
  sendNotification: PropTypes.func.isRequired,
};

export default function ScenarioRuntimes({
  scenarioName,
  getRuntimesForScenario,
  removeRuntimeFromScenario,
  sendNotification,
}) {
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
          removeRuntimeFromScenario,
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
      getEntitiesForScenario={getRuntimesForScenario}
    />
  );

  return (
    <Panel>
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
    </Panel>
  );
}
