import React from 'react';
import PropTypes from 'prop-types';
import { Button, Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import ApplicationScenarioModal from './ApplicationScenarioModal/ApplicationScenarioModal.container';

ApplicationScenarioDisplay.propTypes = {
  applicationId: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default function ApplicationScenarioDisplay(props) {
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
      handler: () => console.log('todo in other task'),
    },
  ];

  const extraHeaderContent = (
    <header>
      <Button option="light">Add Scenario</Button>
      <ApplicationScenarioModal
        applicationId={props.applicationId}
        applicationScenarios={props.labels}
      />
    </header>
  );

  
  return (
    <Panel>
      <GenericList
        extraHeaderContent={extraHeaderContent}
        title="Assigned to Scenario"
        notFoundMessage="This Applications isn't assigned to any scenario"
        actions={actions}
        entries={props.labels}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
      />
    </Panel>
  );
}
