import React, { Component } from 'react';

import LuigiClient from '@luigi-project/client';
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
        tooltipContent={instance.status.message}
        type={getBadgeTypeForStatus(instance.status.type)}
      >
        {instance.status.type}
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
