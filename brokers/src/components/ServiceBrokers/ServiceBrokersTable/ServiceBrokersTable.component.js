import React from 'react';
import Moment from 'react-moment';
import { Table, Tooltip } from '@kyma-project/react-components';
import { statusColor } from '../../../commons/helpers';

function ServiceBrokersTable({ data, refetch, loading }) {
  const table = {
    title: 'Manage Service Brokers',
    columns: [
      {
        name: 'NAME',
        size: 0.2,
        accesor: el => {
          return el.name;
        },
      },
      {
        name: 'AGE',
        size: 0.2,
        accesor: el => {
          return (
            <Moment unix fromNow>
              {el.creationTimestamp}
            </Moment>
          );
        },
      },
      {
        name: 'URL',
        size: 0.4,
        accesor: el => {
          return el.url;
        },
      },
      {
        name: 'STATUS',
        size: 0.1,
        accesor: el => {
          let type = '';
          el.status.ready === true ? (type = 'RUNNING') : (type = 'FAILED');
          return (
            <Tooltip
              type={type === 'RUNNING' ? 'success' : 'error'}
              content={el.status.message}
              minWidth="250px"
            >
              <span style={{ color: statusColor(type), cursor: 'help' }}>
                {type}
              </span>
            </Tooltip>
          );
        },
      },
    ],
    data: data,
  };

  return (
    <Table
      title={table.title}
      columns={table.columns}
      data={table.data}
      loading={loading}
      notFoundMessage="No Service Brokers found"
    />
  );
}

export default ServiceBrokersTable;
