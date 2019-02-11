import React from 'react';
import Moment from 'react-moment';

import { Table, Tooltip } from '@kyma-project/react-components';

import { statusColor } from '../../../commons/helpers';

function ServiceBrokersTable({ data, refetch, loading }) {
  const createTableData = () => {
    return data.map(broker => {
      return {
        rowData: [
          broker.name,
          <Moment unix fromNow>
            {broker.creationTimestamp}
          </Moment>,
          broker.url,
          (_ => {
            let type = '';
            broker.status.ready === true
              ? (type = 'RUNNING')
              : (type = 'FAILED');

            return (
              <Tooltip
                type={type === 'RUNNING' ? 'success' : 'error'}
                content={broker.status.message}
                minWidth="250px"
              >
                <span style={{ color: statusColor(type), cursor: 'help' }}>
                  {type}
                </span>
              </Tooltip>
            );
          })(),
        ],
      };
    });
  };

  const title = 'Manage Service Brokers';
  const headers = ['Name', 'Age', 'Url', 'Status'];
  const tableData = createTableData();

  return (
    <Table
      title={title}
      headers={headers}
      tableData={tableData}
      loadingData={loading}
      notFoundMessage="No Service Brokers found"
    />
  );
}

export default ServiceBrokersTable;
