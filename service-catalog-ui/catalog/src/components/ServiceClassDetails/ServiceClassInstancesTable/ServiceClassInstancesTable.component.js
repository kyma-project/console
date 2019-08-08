import React, { Component } from 'react';

import { InstanceStatus, Table } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';

import { serviceClassConstants } from '../../../variables';

import { Link, LinkButton } from './styled';

export class ServiceClassInstancesTable extends Component {
  prepareRowData(serviceClassInstances) {
    return serviceClassInstances.map(instance => ({
      rowData: [
        <LinkButton>
          <Link
            onClick={() => this.goToServiceInstanceDetails(instance.name)}
            title={instance.name}
          >
            {instance.name}
          </Link>
        </LinkButton>,
        <InstanceStatus status={instance.status.type} />,
      ],
    }));
  }

  goToServiceInstanceDetails(instanceName) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-instances/details/${instanceName}`);
  }

  render() {
    return (
      <Table
        headers={[
          serviceClassConstants.tableHeaderInstance,
          serviceClassConstants.tableHeaderStatus,
        ]}
        tableData={this.prepareRowData(this.props.tableData)}
        notFoundMessage={serviceClassConstants.emptyInstancesListMessage}
      />
    );
  }
}
