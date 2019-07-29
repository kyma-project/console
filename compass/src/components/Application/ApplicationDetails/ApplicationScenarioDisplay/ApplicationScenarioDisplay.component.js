import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';
import { Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import ApplicationScenarioModal from './ApplicationScenarioModal/ApplicationScenarioModal.container';

ApplicationScenarioDisplay.propTypes = {
  applicationId: PropTypes.string.isRequired,
  scenarios: PropTypes.arrayOf(PropTypes.string).isRequired,
  setScenarios: PropTypes.func.isRequired,
};

export default function ApplicationScenarioDisplay(props) {
  async function removeScenario(entry) {
    const { applicationId, scenarios, setScenarios } = props;

    try {
      await setScenarios(
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

  const rowRenderer = label => [
    <span className="link">
      {/* todo add link to scenario (other task) */}
      {label.scenario}
    </span>,
    '?/?', // todo add in other task
  ];

  const actions = [
    {
      name: 'Remove',
      handler: removeScenario,
    },
  ];

  const extraHeaderContent = (
    <header>
      <ApplicationScenarioModal
        applicationId={props.applicationId}
        applicationScenarios={props.scenarios}
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
