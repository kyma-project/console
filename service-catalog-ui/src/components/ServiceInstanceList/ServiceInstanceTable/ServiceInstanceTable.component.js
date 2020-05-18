import React, { Component } from 'react';
import LuigiClient from '@kyma-project/luigi-client';
import { Button } from 'fundamental-react';
import { GenericList, handleDelete } from 'react-shared';

import { backendModuleExists } from 'helpers';
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

    const serviceCatalogAddonsBackendModuleExists = backendModuleExists(
      'servicecatalogaddons',
    );

    const rowRenderer = instance =>
      renderRow(instance, serviceCatalogAddonsBackendModuleExists);

    const actions = [
      {
        name: 'Delete Instance',
        icon: 'delete',
        handler: entry =>
          handleDelete('Service Instance', entry.id, entry.name, () =>
            deleteServiceInstance(entry.name),
          ),
      },
    ];

    const headerRenderer = () => [
      'Name',
      'Service Class',
      'Plan',
      ...(serviceCatalogAddonsBackendModuleExists
        ? ['Bound Applications']
        : []),
      'Status',
      '',
    ];

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
      />
    );
  }
}

export default ServiceInstanceTable;
