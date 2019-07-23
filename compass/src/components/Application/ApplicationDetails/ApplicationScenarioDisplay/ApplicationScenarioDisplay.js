import React from 'react';
import PropTypes from 'prop-types';
import { Button, Panel } from '@kyma-project/react-components';
import GenericList from '../../../../shared/components/GenericList/GenericList';

ApplicationScenarioDisplay.propTypes = {
  applicationId: PropTypes.string.isRequired,
  labels: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default function ApplicationScenarioDisplay(props) {
  const headerRenderer = () => ['Name', 'Provided in Runtimes'];

  const rowRenderer = scenario => [
    <span className="link">
      {/* todo add link to scenario (other task) */}
      {scenario}
    </span>,
    '?/?', // todo add in other task
  ];

  const actions = [
    {
      name: 'Remove',
      handler: () => console.log('todo in other task'),
    },
  ];

  return (
    <Panel>
      <GenericList
        extraHeaderContent={<Button option="light">Add Scenario</Button>}
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
