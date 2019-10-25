import React from 'react';
import PropTypes from 'prop-types';
import { GenericList } from 'react-shared';

import CreateScenarios from './CreateScenario/CreateScenarioModal/CreateScenarioModal.container';

class Scenarios extends React.Component {
  navigateToScenario(scenarioName) {
    LuigiClient.linkManager().navigate(`details/${scenarioName}`);
  }

  headerRenderer = () => ['Name'];

  rowRenderer = scenario => [
    <span
      className="link"
      onClick={() => this.navigateToScenario(scenario.name)}
    >
      {scenario.name}
    </span>,
  ];

  render() {
    const scenarioLabelDefinitionSchemaQuery = this.props.scenarioLabelSchema;
    const scenarios =
      (scenarioLabelDefinitionSchemaQuery &&
        scenarioLabelDefinitionSchemaQuery.labelDefinition &&
        scenarioLabelDefinitionSchemaQuery.labelDefinition.schema &&
        JSON.parse(scenarioLabelDefinitionSchemaQuery.labelDefinition.schema)
          .items &&
        JSON.parse(scenarioLabelDefinitionSchemaQuery.labelDefinition.schema)
          .items.enum) ||
      [];
    const loading =
      scenarioLabelDefinitionSchemaQuery &&
      scenarioLabelDefinitionSchemaQuery.loading;
    const error =
      scenarioLabelDefinitionSchemaQuery &&
      scenarioLabelDefinitionSchemaQuery.error;

    const scenariosObjects = scenarios.map(scenario => {
      return { name: scenario };
    });

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <GenericList
        title="Scenarios"
        description="List of scenarios"
        entries={scenariosObjects}
        headerRenderer={this.headerRenderer}
        rowRenderer={this.rowRenderer}
        extraHeaderContent={
          <CreateScenarios
            scenariosQuery={scenarioLabelDefinitionSchemaQuery}
          />
        }
      />
    );
  }
}

Scenarios.propTypes = {
  scenarioLabelSchema: PropTypes.object.isRequired,
};

export default Scenarios;
