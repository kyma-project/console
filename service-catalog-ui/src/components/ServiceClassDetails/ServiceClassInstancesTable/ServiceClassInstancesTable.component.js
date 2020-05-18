import React, { Component } from 'react';

import { InstanceStatus } from '@kyma-project/react-components';
import LuigiClient from '@kyma-project/luigi-client';
import { GenericList } from 'react-shared';

import { serviceClassConstants } from 'helpers/constants';

import { Link, LinkButton } from './styled';

export class ServiceClassInstancesTable extends Component {
  goToServiceInstanceDetails(instanceName) {
    LuigiClient.linkManager()
      .fromContext('namespaces')
      .navigate(`cmf-instances/details/${instanceName}`);
  }

  render() {
    const headerRenderer = () => [
      serviceClassConstants.tableHeaderInstance,
      serviceClassConstants.tableHeaderStatus,
    ];

    const rowRenderer = instance => [
      <LinkButton>
        <Link
          onClick={() => this.goToServiceInstanceDetails(instance.name)}
          title={instance.name}
        >
          {instance.name}
        </Link>
      </LinkButton>,
      <InstanceStatus status={instance.status.type} />,
    ];

    return (
      <GenericList
        headerRenderer={headerRenderer}
        rowRenderer={rowRenderer}
        entries={this.props.tableData}
        notFoundMessage={serviceClassConstants.emptyInstancesListMessage}
        showRootHeader={false}
        hasExternalMargin={false}
      />
    );
  }
}
