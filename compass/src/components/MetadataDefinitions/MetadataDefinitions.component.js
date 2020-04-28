import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@luigi-project/client';

import { GenericList, handleDelete } from 'react-shared';
import CreateMDmodal from './CreateMDmodal/CreateMDmodal.container';
import { PageHeader } from 'react-shared';

class MetadataDefinitions extends React.Component {
  headerRenderer = () => ['Name', 'Schema Provided'];

  rowRenderer = labelDef => [
    <span
      onClick={() =>
        LuigiClient.linkManager().navigate(
          `details/${encodeURIComponent(labelDef.key)}`,
        )
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
      <>
        <PageHeader title="Metadata definitions" />
        <GenericList
          entries={labelsDefinitions}
          headerRenderer={this.headerRenderer}
          rowRenderer={this.rowRenderer}
          extraHeaderContent={<CreateMDmodal />}
          actions={this.actions}
          textSearchProperties={['key']}
        />
      </>
    );
  }
}

MetadataDefinitions.propTypes = {
  labelDefinitions: PropTypes.object.isRequired,
  deleteLabelDefinition: PropTypes.func.isRequired,
};

export default MetadataDefinitions;
