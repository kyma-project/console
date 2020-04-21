import React from 'react';
import Moment from 'react-moment';

import { PageHeader, GenericList, Tooltip } from '../../react-shared';
import { statusColor } from '../../commons/helpers';

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
          let type = '';
          item.status.ready === true ? (type = 'RUNNING') : (type = 'FAILED');

          return (
            <Tooltip title={item.status.message}>
              <span style={{ color: statusColor(type), cursor: 'help' }}>
                {type}
              </span>
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
