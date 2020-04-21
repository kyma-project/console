import React from 'react';
import Moment from 'react-moment';

import { PageHeader, GenericList, Tooltip } from '../../react-shared';
import { Badge } from 'fundamental-react';

class ServiceBrokers extends React.Component {
  render() {
    const { serviceBrokers = {} } = this.props;
    const brokers = serviceBrokers.serviceBrokers || [];

    const headerRenderer = () => ['Name', 'Age', 'Url', 'Status'];

    const rowRenderer = item => {
      return [
        item.name,
        <Moment unix fromNow>
          {item.creationTimestamp}
        </Moment>,
        item.url,
        (_ => {
          const status = item.status.ready === true ? 'RUNNING' : 'FAILED';
          const type = item.status.ready === true ? 'success' : 'error';

          return (
            <Tooltip title={item.status.message}>
              <Badge type={type} modifier="filled">
                {status}
              </Badge>
            </Tooltip>
          );
        })(),
      ];
    };

    return (
      <article className="brokers-list">
        <PageHeader title="Service Brokers" />
        <GenericList
          actions={[]}
          entries={brokers}
          headerRenderer={headerRenderer}
          rowRenderer={rowRenderer}
        />
      </article>
    );
  }
}

export default ServiceBrokers;
