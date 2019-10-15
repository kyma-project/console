import React from 'react';
import PropTypes from 'prop-types';

import ScenarioDetailsHeader from './ScenarioDetailsHeader/ScenarioDetailsHeader.container';
import ScenarioApplications from './ScenarioApplications/ScenarioApplications.container';
//import ScenarioRuntimes from './ScenarioRuntimes/ScenarioRuntimes';

import './ScenarioDetails.scss';

ScenarioDetails.propTypes = {
  scenarioName: PropTypes.string.isRequired,
};

export default function ScenarioDetails({ scenarioName }) {
  return (
    <>
      <ScenarioDetailsHeader scenarioName={scenarioName} />
      <section
        id="scenario-details__panel"
        className="fd-section fd-has-margin-top-small"
      >
        <ScenarioApplications scenarioName={scenarioName} />
        {/* <ScenarioRuntimes scenarioName={scenarioName} /> */}
      </section>
    </>
  );
}
