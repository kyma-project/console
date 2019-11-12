import React from 'react';
import PropTypes from 'prop-types';
import { GenericList } from 'react-shared';
import LuigiClient from '@kyma-project/luigi-client';

import CreateScenarios from './CreateScenario/CreateScenarioModal/CreateScenarioModal.container';
import EnititesForScenarioCount from './EnititesForScenarioCount';

import {
  GET_APPLICATIONS_FOR_SCENARIO,
  GET_RUNTIMES_FOR_SCENARIO,
} from './gql';

class Scenarios extends React.Component {
  navigateToScenario(scenarioName) {
    LuigiClient.linkManager().navigate(`details/${scenarioName}`);
  }

  headerRenderer = () => ['Name', 'Runtimes', 'Applications'];

  rowRenderer = scenario => [
    <span
      className="link"
      onClick={() => this.navigateToScenario(scenario.name)}
    >
      {scenario.name}
    </span>,
    <EnititesForScenarioCount
      scenarioName={scenario.name}
      entityType="runtimes"
      query={GET_RUNTIMES_FOR_SCENARIO}
    />,
    <EnititesForScenarioCount
      scenarioName={scenario.name}
      entityType="applications"
      query={GET_APPLICATIONS_FOR_SCENARIO}
    />,
  ];

  render() {
    const scenarioLabelSchema = this.props.scenarioLabelSchema;
    const scenarios =
      (scenarioLabelSchema.labelDefinition &&
        scenarioLabelSchema.labelDefinition.schema &&
        JSON.parse(scenarioLabelSchema.labelDefinition.schema).items &&
        JSON.parse(scenarioLabelSchema.labelDefinition.schema).items.enum) ||
      [];
    const loading = scenarioLabelSchema.loading;
    const error = scenarioLabelSchema.error;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    const scenariosObjects = scenarios.map(scenario => ({ name: scenario }));

    return (
      <GenericList
        title="Scenarios"
        description="List of scenarios"
        entries={scenariosObjects}
        headerRenderer={this.headerRenderer}
        rowRenderer={this.rowRenderer}
        extraHeaderContent={
          <CreateScenarios scenariosQuery={scenarioLabelSchema} />
        }
      />
    );
  }
}

Scenarios.propTypes = {
  scenarioLabelSchema: PropTypes.object.isRequired,
};

export default Scenarios;
