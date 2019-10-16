import React from 'react';
import PropTypes from 'prop-types';

import ScenarioDetailsHeader from './ScenarioDetailsHeader/ScenarioDetailsHeader.container';
import ScenarioApplications from './ScenarioApplications/ScenarioApplications.container';
import ScenarioRuntimes from './ScenarioRuntimes/ScenarioRuntimes.container';
import './ScenarioDetails.scss';

import ScenarioNameContext from './ScenarioNameContext';

ScenarioDetails.propTypes = {
  scenarioName: PropTypes.string.isRequired,
};

export default function ScenarioDetails({ scenarioName }) {
  return (
    <ScenarioNameContext.Provider value={scenarioName}>
      <ScenarioDetailsHeader />
      <section className="scenario-details__panel fd-section fd-has-margin-top-small">
        <ScenarioApplications />
        <ScenarioRuntimes />
      </section>
    </ScenarioNameContext.Provider>
  );
}
