import React from 'react';
import PropTypes from 'prop-types';
import LuigiClient from '@kyma-project/luigi-client';

import GenericList from '../../shared/components/GenericList/GenericList';

import CreateLabelModal from '../Labels/CreateLabelModal/CreateLabelModal.container';

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

  deleteMetadataDefinition = metadataDefinitionKey => {
    this.props
      .deleteLabelDefinition(metadataDefinitionKey)
      .then(() => {
        this.props.labelDefinitions.refetch();
      })
      .catch(err => {
        LuigiClient.uxManager().showAlert({
          text: `An error occurred while deleting Metadata Definition ${metadataDefinitionKey}: ${err.message}`,
          type: 'error',
          closeAfter: 10000,
        });
      });
  };

  actions = [
    {
      name: 'Delete',
      handler: entry => {
        LuigiClient.uxManager()
          .showConfirmationModal({
            header: 'Remove Metadata Definition',
            body: `Are you sure you want to delete Metadata Definition "${entry.key}"?`,
            buttonConfirm: 'Delete',
            buttonDismiss: 'Cancel',
          })
          .then(() => {
            this.deleteMetadataDefinition(entry.key);
          });
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
