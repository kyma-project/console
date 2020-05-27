import React, { Component } from 'react';

import LuigiClient from '@kyma-project/luigi-client';
import { GenericList, StatusBadge } from 'react-shared';

import { serviceClassConstants } from 'helpers/constants';
import { getBadgeTypeForStatus } from 'helpers/getBadgeTypeForStatus';

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
      <StatusBadge
        status={instance.status.type}
        type={getBadgeTypeForStatus(instance.status.type)}
      >
        {instance.status.message}
      </StatusBadge>,
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
