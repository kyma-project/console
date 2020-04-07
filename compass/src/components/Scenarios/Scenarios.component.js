import React from 'react';
import PropTypes from 'prop-types';
import { GenericList } from 'react-shared';
import LuigiClient from '@luigi-project/client';

import CreateScenarios from './CreateScenario/CreateScenarioModal/CreateScenarioModal.container';
import EnititesForScenarioCounter from './EntitiesForScenarioCounter/EnititesForScenarioCounter';
import { PageHeader } from 'react-shared';

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
    <EnititesForScenarioCounter
      scenarioName={scenario.name}
      entityType="runtimes"
    />,
    <EnititesForScenarioCounter
      scenarioName={scenario.name}
      entityType="applications"
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
      <>
        <PageHeader title="Scenarios" />
        <GenericList
          entries={scenariosObjects}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
          extraHeaderContent={
            <CreateScenarios scenariosQuery={scenarioLabelSchema} />
          }
        />
      </>
    );
  }
}

Scenarios.propTypes = {
  scenarioLabelSchema: PropTypes.object.isRequired,
};

export default Scenarios;
