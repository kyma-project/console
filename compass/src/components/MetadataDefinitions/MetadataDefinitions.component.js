import React from 'react';
import PropTypes from 'prop-types';

import GenericList from '../../shared/components/GenericList/GenericList';

class MetadataDefinitions extends React.Component {
  headerRenderer = () => ['Labels', 'Schema Provided'];

  rowRenderer = labelDef => [
    <span className="link">
      <b>{labelDef.key}</b>
    </span>,
    <span>{labelDef.schema ? 'true' : 'false'}</span>,
  ];

  render() {
    const labelsDefinitionsQuery = this.props.labelDefinitions;
    const labelsDefinitions = labelsDefinitionsQuery.labelDefinitions;

    const loading = labelsDefinitionsQuery.loading;
    const error = labelsDefinitionsQuery.error;

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;

    return (
      <GenericList
        title="Metadata Definitions"
        entries={labelsDefinitions}
        headerRenderer={this.headerRenderer}
        rowRenderer={this.rowRenderer}
      />
    );
  }
}

MetadataDefinitions.propTypes = {
  labelDefinitions: PropTypes.object.isRequired,
};

export default MetadataDefinitions;
