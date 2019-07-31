import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Panel } from '@kyma-project/react-components';
import GenericList from './../../../../shared/components/GenericList/GenericList';
import ApplicationScenarioModal from './ApplicationScenarioModal.container';

ApplicationDetailsScenarios.propTypes = {
  applicationId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string).isRequired,
  updateScenarios: PropTypes.func.isRequired,
};

export default function ApplicationDetailsScenarios(props) {
  async function removeScenario(entry) {
    const { applicationId, scenarios, updateScenarios } = props;

    try {
      await updateScenarios(
        applicationId,
        scenarios.filter(scenario => scenario !== entry.scenario),
      );
    } catch (error) {
      console.warn(error);
      LuigiClient.uxManager().showAlert({
        text: error.message,
        type: 'error',
        closeAfter: 10000,
      });
    }
  }

  const headerRenderer = () => ['Name', 'Provided in Runtimes'];

  const rowRenderer = label => [label.scenario, '?/?'];

  const actions = [
    {
      name: 'Remove',
      handler: removeScenario,
    },
  ];

  const extraHeaderContent = (
    <header>
      <ApplicationScenarioModal
        entityId={props.applicationId}
        scenarios={props.scenarios}
        notAssignedMessage={'Application is not assigned to any scenario.'}
      />
    </header>
  );

  const entries = props.scenarios.map(scenario => {
    return { scenario: scenario };
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
