import React, { Component } from 'react';
import LuigiClient from '@luigi-project/client';
import { Button } from 'fundamental-react';
import { GenericList, handleDelete } from 'react-shared';

import renderRow from './ServiceInstanceRowRenderer';

export class ServiceInstanceTable extends Component {
  goToServiceCatalog = () => {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .withParams({ selectedTab: this.props.type })
      .navigate('cmf-service-catalog');
  };

  render() {
    const { data, deleteServiceInstance, loading } = this.props;

    if (loading) return 'Loading...';

    const rowRenderer = instance => renderRow(instance);

    const actions = [
      {
        name: 'Delete Instance',
        icon: 'delete',
        handler: entry =>
          handleDelete(
            'Service Instance',
            entry.metadata.uid,
            entry.metadata.name,
            () => deleteServiceInstance(entry.metadata.name),
          ),
      },
    ];

    const headerRenderer = () => ['Name', 'Service Class', 'Plan', 'Status'];

    const addServiceInstanceButton = (
      <Button
        compact
        option="light"
        onClick={this.goToServiceCatalog}
        data-e2e-id="add-instance"
        glyph="add"
      >
        Add Instance
      </Button>
    );

    return (
      <GenericList
        extraHeaderContent={addServiceInstanceButton}
        title="Manage Service Instances"
        actions={actions}
        entries={data}
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        notFoundMessage="No Service Instances found"
        hasExternalMargin={false}
        textSearchProperties={['metadata.name']}
      />
    );
  }
}

export default ServiceInstanceTable;
