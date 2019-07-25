import React from 'react';
import PropTypes from 'prop-types';
import GenericList from '../../shared/components/GenericList/GenericList';

class Scenarios extends React.Component {
  static propTypes = {
    scenario_label_schema: PropTypes.object.isRequired,
  };

  headerRenderer = scenarios => ['Name'];

  rowRenderer = scenario => [
    <span className="link">
      <b>{scenario}</b>
    </span>,
  ];

  render() {
    const scenarioLabelDefinitionSchemaQuery = this.props.scenario_label_schema;
    const scenarios =
      (scenarioLabelDefinitionSchemaQuery &&
        scenarioLabelDefinitionSchemaQuery.labelDefinition &&
        scenarioLabelDefinitionSchemaQuery.labelDefinition.schema &&
        scenarioLabelDefinitionSchemaQuery.labelDefinition.schema.items &&
        scenarioLabelDefinitionSchemaQuery.labelDefinition.schema.items.enum) ||
      {};
    const loading =
      scenarioLabelDefinitionSchemaQuery &&
      scenarioLabelDefinitionSchemaQuery.loading;
    const error =
      scenarioLabelDefinitionSchemaQuery &&
      scenarioLabelDefinitionSchemaQuery.error;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <GenericList
        title="Scenarios"
        description="List of scenarios"
        entries={scenarios}
        headerRenderer={this.headerRenderer}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

export default Scenarios;
