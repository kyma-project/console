import React from 'react';
import PropTypes from 'prop-types';
import GenericList from '../../../../shared/components/GenericList/GenericList';
import { Panel } from '@kyma-project/react-components';
import UnassignScenario from './../UnassignScenario/UnassignScenario';

ScenarioApplications.propTypes = {
  scenarioName: PropTypes.string.isRequired,
  getApplicationsAndScenarioApplications: PropTypes.func.isRequired,
  setApplicationScenario: PropTypes.func.isRequired,
  removeApplicationFromScenario: PropTypes.func.isRequired,
};

export default function ScenarioApplications({
  scenarioName,
  getApplicationsAndScenarioApplications,
  setApplicationScenario,
  removeApplicationFromScenario,
}) {
  const countApis = application =>
    application.apis.totalCount + application.eventAPIs.totalCount;

  if (getApplicationsAndScenarioApplications.loading) {
    return <p>Loading...</p>;
  }
  if (getApplicationsAndScenarioApplications.error) {
    return `Error! ${getApplicationsAndScenarioApplications.error.message}`;
  }
  const {
    applications,
    scenarioApplications,
  } = getApplicationsAndScenarioApplications;

  const headerRenderer = () => ['Name', 'APIs'];

  const rowRenderer = application => [application.name, 'todo'];

  const actions = [
    {
      name: 'Delete',
      handler: application =>
        UnassignScenario(
          application.name,
          application.id,
          removeApplicationFromScenario,
          scenarioName,
        ),
    },
  ];

  return (
    <Panel>
      <GenericList
        extraHeaderContent={<span className="link">Add Application</span>}
        title="Applications"
        notFoundMessage="No Applications for this Scenario"
        entries={scenarioApplications.data}
        headerRenderer={headerRenderer}
        actions={actions}
        rowRenderer={rowRenderer}
        showSearchField={false}
      />
    </Panel>
  );
}
