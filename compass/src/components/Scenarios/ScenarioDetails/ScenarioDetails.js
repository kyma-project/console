import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ScenarioDetailsHeader from './ScenarioDetailsHeader/ScenarioDetailsHeader';
import ScenarioApplications from './ScenarioApplications/ScenarioApplications';
import ScenarioRuntimes from './ScenarioRuntimes/ScenarioRuntimes.container';

import ScenarioNameContext from './ScenarioNameContext';

ScenarioDetails.propTypes = {
  scenarioName: PropTypes.string.isRequired,
};

export default function ScenarioDetails({ scenarioName }) {
  const [applicationsCount, setApplicationsCount] = useState(0);

  return (
    <ScenarioNameContext.Provider value={scenarioName}>
      <ScenarioDetailsHeader applicationsCount={applicationsCount} />
      <ScenarioApplications updateApplicationsCount={setApplicationsCount} />
      <ScenarioRuntimes />
    </ScenarioNameContext.Provider>
  );
}
