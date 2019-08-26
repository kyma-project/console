import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import GenericList from '../../shared/components/GenericList/GenericList';
import CreateLabelModal from '../Labels/CreateLabelModal/CreateLabelModal.container';
import handleDelete from '../../shared/components/GenericList/actionHandlers/simpleDelete';

class MetadataDefinitions extends React.Component {
  headerRenderer = () => ['Labels', 'Schema Provided'];

  rowRenderer = labelDef => [
    <span
      onClick={() =>
        LuigiClient.linkManager().navigate(`details/${labelDef.key}`)
      }
      className="link"
    >
      {labelDef.key}
    </span>,
    <span>{labelDef.schema ? 'true' : 'false'}</span>,
  ];

  actions = [
    {
      name: 'Delete',
      handler: entry => {
        handleDelete(
          'Metadata Definition',
          entry.key,
          entry.key,
          this.props.deleteLabelDefinition,
          this.props.labelDefinitions.refetch,
        );
      },
      skipAction: function(entry) {
        return entry.key === 'scenarios';
      },
    },
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
        extraHeaderContent={<CreateLabelModal />}
        actions={this.actions}
      />
    );
  }
}

MetadataDefinitions.propTypes = {
  labelDefinitions: PropTypes.object.isRequired,
  deleteLabelDefinition: PropTypes.func.isRequired,
};

export default MetadataDefinitions;
